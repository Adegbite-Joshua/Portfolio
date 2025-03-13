"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as random from "maath/random/dist/maath-random.esm"
import { useTheme } from "@/providers/theme-provider"
import type * as THREE from "three"

function ParticleField({ count = 5000 }) {
  const points = useRef<THREE.Points>(null!)
  const { theme } = useTheme()

  // Generate random points in a sphere
  const sphere = random.inSphere(new Float32Array(count * 3), { radius: 1.5 })

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.x += delta * 0.05
      points.current.rotation.y += delta * 0.075
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={points} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={theme === "dark" ? "#6366f1" : "#6366f1"}
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  )
}

export function Background3D() {
  const [mounted, setMounted] = useState(false)

  // Only render after component has mounted (client-side)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 -z-10 opacity-70">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleField />
      </Canvas>
    </div>
  )
}

