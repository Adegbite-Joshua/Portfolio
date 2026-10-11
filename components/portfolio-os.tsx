"use client"

import Image from "next/image"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { gsap } from "gsap"
import {
  ArrowLeft,
  BatteryFull,
  BriefcaseBusiness,
  Code2,
  Download,
  ExternalLink,
  FileText,
  Github,
  Home,
  Linkedin,
  Mail,
  Minimize2,
  Maximize2,
  Minus,
  Monitor,
  PanelsTopLeft,
  Search,
  Settings,
  Smartphone,
  Sparkles,
  Terminal,
  Twitter,
  User,
  Wifi,
  X,
} from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { cn } from "@/lib/utils"
import { experiences, portfolioProjects, profile, skillGroups, systemStats } from "@/data/portfolio"

// Shared motion vocabulary so every GSAP timeline across the OS feels consistent.
const MOTION = {
  ease: {
    out: "power3.out",
    inOut: "power3.inOut",
    in: "power3.in",
    expo: "power4.out",
    back: "back.out(1.9)",
    elastic: "elastic.out(1, 0.5)",
  },
  dur: {
    fast: 0.22,
    base: 0.36,
    slow: 0.58,
  },
} as const

const ACCENT_PALETTE = ["#83eee2", "#9cc8ff", "#e2a8ff", "#ffb86b", "#79e0b5", "#ff8aa6"] as const

type AppId = "about" | "projects" | "experience" | "skills" | "contact" | "resume" | "terminal" | "github" | "linkedin" | "settings"

type WindowBounds = {
  x: number
  y: number
  width: number
  height: number
}

type SnapZone = "left" | "right" | "max"

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"

type WindowState = {
  id: AppId
  minimized: boolean
  maximized?: boolean
  snapped?: SnapZone
  restoreBounds?: WindowBounds
  z: number
  x: number
  y: number
  width: number
  height: number
}

type DragState = {
  id: AppId
  startX: number
  startY: number
  initialX: number
  initialY: number
}

type ResizeState = {
  id: AppId
  dir: ResizeDir
  startX: number
  startY: number
  startBounds: WindowBounds
}

type OpenOptions = {
  mobile?: boolean
  projectSlug?: string
  originRect?: DOMRect
}

type TerminalEntry =
  | { type: "system"; text: string }
  | { type: "prompt"; command: string }
  | { type: "output"; text: string }
  | { type: "error"; text: string }
  | { type: "success"; text: string }
  | { type: "skills" }
  | { type: "neofetch" }

type TerminalCommand = { name: string; usage?: string; description: string }

const TERMINAL_COMMANDS: TerminalCommand[] = [
  { name: "help", description: "List available commands" },
  { name: "whoami", description: "Print the current user" },
  { name: "about", description: "Read Joshua's professional summary" },
  { name: "neofetch", description: "Show the system / developer summary" },
  { name: "skills", description: "List the technical skill tree" },
  { name: "projects", description: "List featured portfolio projects" },
  { name: "experience", description: "Show the work history" },
  { name: "contact", description: "Show contact links" },
  { name: "resume", description: "Open the resume document" },
  { name: "open", usage: "open <app>", description: "Launch an OS app (about, projects, skills, contact, resume, settings)" },
  { name: "theme", usage: "theme <color>", description: "Recolor the OS accent, e.g. theme #ff8aa6" },
  { name: "echo", usage: "echo <text>", description: "Print text back to the screen" },
  { name: "date", description: "Print the current date and time" },
  { name: "pwd", description: "Print the working directory" },
  { name: "history", description: "Show command history" },
  { name: "ls", description: "List files in the current directory" },
  { name: "clear", description: "Clear the terminal output" },
]

const appIcons = {
  about: User,
  projects: Code2,
  experience: BriefcaseBusiness,
  skills: Sparkles,
  contact: Mail,
  resume: FileText,
  terminal: Terminal,
  github: Github,
  linkedin: Linkedin,
  settings: Settings,
}

const appGradients: Record<AppId, string> = {
  about: "linear-gradient(145deg, #f8fbff, #9cc8ff 43%, #536dfe)",
  projects: "linear-gradient(145deg, #fbfff8, #79e0b5 42%, #18745a)",
  experience: "linear-gradient(145deg, #fff8ed, #ffb86b 45%, #a34f1e)",
  skills: "linear-gradient(145deg, #fff7fd, #e2a8ff 43%, #6654f1)",
  contact: "linear-gradient(145deg, #f9fffd, #83eee2 42%, #196a84)",
  resume: "linear-gradient(145deg, #ffffff, #d6dde8 45%, #65758d)",
  terminal: "linear-gradient(145deg, #3b4251, #1d2430 44%, #090b10)",
  github: "linear-gradient(145deg, #f9fafb, #6b7280 46%, #111827)",
  linkedin: "linear-gradient(145deg, #f6fbff, #6bb7f0 45%, #0a66c2)",
  settings: "linear-gradient(145deg, #fbfaf7, #dbc8a3 45%, #475569)",
}

const appNames: Record<AppId, string> = {
  about: "About",
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
  contact: "Mail",
  resume: "Resume",
  terminal: "Terminal",
  github: "GitHub",
  linkedin: "LinkedIn",
  settings: "System",
}

const internalApps: AppId[] = ["about", "projects", "experience", "skills", "contact", "resume", "terminal", "settings"]
const desktopApps: AppId[] = ["about", "projects", "experience", "skills", "contact", "resume", "terminal", "github", "linkedin", "settings"]

const defaultWindowPositions: Record<AppId, Pick<WindowState, "x" | "y" | "width" | "height">> = {
  about: { x: 430, y: 82, width: 760, height: 570 },
  projects: { x: 455, y: 70, width: 900, height: 650 },
  experience: { x: 430, y: 98, width: 860, height: 610 },
  skills: { x: 470, y: 120, width: 760, height: 560 },
  contact: { x: 455, y: 96, width: 800, height: 620 },
  resume: { x: 520, y: 84, width: 720, height: 580 },
  terminal: { x: 390, y: 76, width: 820, height: 610 },
  github: { x: 520, y: 120, width: 680, height: 450 },
  linkedin: { x: 530, y: 140, width: 680, height: 450 },
  settings: { x: 580, y: 95, width: 600, height: 540 },
}

function getInitialWindowState(id: AppId, z: number): WindowState {
  const defaults = defaultWindowPositions[id]
  if (typeof window === "undefined") {
    return { id, minimized: false, z, ...defaults }
  }

  const width = Math.min(defaults.width, Math.max(320, window.innerWidth - 72))
  const height = Math.min(defaults.height, Math.max(360, window.innerHeight - 126))
  const preferredX = window.innerWidth >= 1180 ? defaults.x : 36
  const x = Math.min(preferredX, Math.max(24, window.innerWidth - width - 28))
  const y = Math.min(defaults.y, Math.max(42, window.innerHeight - height - 92))

  return { id, minimized: false, z, x, y, width, height }
}

function isAppId(value: string | null): value is AppId {
  return Boolean(value && desktopApps.includes(value as AppId))
}

const WINDOW_MIN_WIDTH = 320
const WINDOW_MIN_HEIGHT = 360

function getMaximizedBounds(): WindowBounds {
  return {
    x: 36,
    y: 42,
    width: Math.max(WINDOW_MIN_WIDTH, window.innerWidth - 72),
    height: Math.max(WINDOW_MIN_HEIGHT, window.innerHeight - 136),
  }
}

function getHalfBounds(side: "left" | "right"): WindowBounds {
  const margin = 24
  const gap = 12
  const top = 58
  const bottomGap = 96
  const width = Math.max(WINDOW_MIN_WIDTH, (window.innerWidth - margin * 2 - gap) / 2)
  const height = Math.max(WINDOW_MIN_HEIGHT, window.innerHeight - top - bottomGap)
  return { x: side === "left" ? margin : margin + width + gap, y: top, width, height }
}

function snapBoundsFor(zone: SnapZone): WindowBounds {
  return zone === "max" ? getMaximizedBounds() : getHalfBounds(zone)
}

function detectSnapZone(clientX: number, clientY: number): SnapZone | null {
  const edge = 26
  if (clientX <= edge) return "left"
  if (clientX >= window.innerWidth - edge) return "right"
  if (clientY <= edge) return "max"
  return null
}

function formatProjectSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function isCoarsePointer() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
}

function applyAccent(color: string) {
  if (typeof document === "undefined") return
  document.documentElement.style.setProperty("--os-accent", color)
}

export function PortfolioOS() {
  const [booted, setBooted] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [time, setTime] = useState<Date>(() => new Date())
  const [windows, setWindows] = useState<WindowState[]>([])
  const [zCounter, setZCounter] = useState(10)
  const [mobileApp, setMobileApp] = useState<AppId | null>(null)
  const [mobileHistory, setMobileHistory] = useState<AppId[]>([])
  const [showMobileRecents, setShowMobileRecents] = useState(false)
  const [selectedProject, setSelectedProject] = useState(formatProjectSlug(portfolioProjects[0]?.name ?? ""))
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [resizeState, setResizeState] = useState<ResizeState | null>(null)
  const [snapPreview, setSnapPreview] = useState<{ zone: SnapZone; bounds: WindowBounds } | null>(null)
  const snapZoneRef = useRef<SnapZone | null>(null)
  const [spotlightOpen, setSpotlightOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [accentIndex, setAccentIndex] = useState(0)
  const spotlightTrigger = useRef<HTMLElement | null>(null)
  const firstWindowButton = useRef<HTMLButtonElement>(null)
  const closingWindows = useRef<Set<AppId>>(new Set())
  const resizingWindows = useRef<Set<AppId>>(new Set())
  const launchOrigins = useRef<Partial<Record<AppId, DOMRect>>>({})

  useEffect(() => {
    setTime(new Date())
    const interval = window.setInterval(() => setTime(new Date()), 15000)
    return () => window.clearInterval(interval)
  }, [])

  // Skip the boot sequence for reduced-motion users and after the first boot of a session.
  useEffect(() => {
    if (prefersReducedMotion() || window.sessionStorage.getItem("mushos-booted")) {
      setBooted(true)
      return
    }
    window.sessionStorage.setItem("mushos-booted", "1")
  }, [])

  const completeBoot = useCallback(() => {
    setBooted(true)
    window.setTimeout(() => document.querySelector<HTMLElement>(".unlock-button")?.focus(), 60)
  }, [])

  const openSpotlight = useCallback((trigger?: HTMLElement | null) => {
    spotlightTrigger.current = trigger ?? (document.activeElement as HTMLElement) ?? null
    setContextMenu(null)
    setSpotlightOpen(true)
  }, [])

  const closeSpotlight = useCallback(() => {
    setSpotlightOpen(false)
    const trigger = spotlightTrigger.current
    if (trigger && typeof trigger.focus === "function") window.setTimeout(() => trigger.focus(), 0)
  }, [])

  const cycleAccent = useCallback(() => {
    setAccentIndex((index) => {
      const next = (index + 1) % ACCENT_PALETTE.length
      applyAccent(ACCENT_PALETTE[next])
      return next
    })
  }, [])

  const cleanUpIcons = useCallback(() => {
    if (prefersReducedMotion()) return
    const icons = document.querySelectorAll<HTMLElement>(".desktop-icon-grid .app-icon")
    gsap.fromTo(
      icons,
      { y: 16, scale: 0.92, opacity: 0.3 },
      { y: 0, scale: 1, opacity: 1, stagger: 0.03, duration: MOTION.dur.base, ease: MOTION.ease.back },
    )
  }, [])

  const handleDesktopContextMenu = useCallback((event: React.MouseEvent) => {
    if (isCoarsePointer()) return
    if ((event.target as HTMLElement).closest(".os-window, .desktop-dock, .glass-menubar")) return
    event.preventDefault()
    setSpotlightOpen(false)
    setContextMenu({ x: event.clientX, y: event.clientY })
  }, [])

  const writeUrlState = useCallback((app: AppId | null, projectSlug?: string) => {
    const url = new URL(window.location.href)
    if (app) {
      url.searchParams.set("app", app)
      if (projectSlug) url.searchParams.set("project", projectSlug)
      if (!projectSlug) url.searchParams.delete("project")
    } else {
      url.searchParams.delete("app")
      url.searchParams.delete("project")
    }
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`)
  }, [])

  const animateWindowPresence = useCallback((id: AppId, intent: "minimize" | "close", onComplete: () => void) => {
    const windowElement = document.querySelector<HTMLElement>(`[data-window-id="${id}"]`)
    if (!windowElement || prefersReducedMotion()) {
      onComplete()
      return
    }

    const dockTarget = document.querySelector<HTMLElement>(`[data-dock-id="${id}"]`)
    const windowRect = windowElement.getBoundingClientRect()
    const dockRect = dockTarget?.getBoundingClientRect()
    const targetX = dockRect ? dockRect.left + dockRect.width / 2 - (windowRect.left + windowRect.width / 2) : 0
    const targetY = dockRect ? dockRect.top + dockRect.height / 2 - (windowRect.top + windowRect.height / 2) : 36

    gsap.killTweensOf(windowElement)
    gsap.to(windowElement, {
      x: intent === "minimize" ? targetX : 22,
      y: intent === "minimize" ? targetY : 8,
      scale: intent === "minimize" ? 0.08 : 0.86,
      opacity: 0,
      filter: "blur(14px)",
      transformOrigin: "50% 90%",
      duration: intent === "minimize" ? 0.42 : 0.24,
      ease: intent === "minimize" ? "power3.inOut" : "power2.in",
      onComplete,
    })
  }, [])

  const bringToFront = useCallback((id: AppId) => {
    setZCounter((current) => {
      const next = current + 1
      setWindows((items) => items.map((windowItem) => (windowItem.id === id ? { ...windowItem, z: next, minimized: false } : windowItem)))
      return next
    })
  }, [])

  const openApp = useCallback(
    (id: AppId, options?: OpenOptions) => {
      if (id === "github") {
        window.open(profile.links.github, "_blank", "noopener,noreferrer")
        return
      }
      if (id === "linkedin") {
        window.open(profile.links.linkedin, "_blank", "noopener,noreferrer")
        return
      }

      if (options?.projectSlug) setSelectedProject(options.projectSlug)
      if (options?.originRect) launchOrigins.current[id] = options.originRect
      setUnlocked(true)
      setZCounter((current) => {
        const next = current + 1
        setWindows((items) => {
          const existing = items.find((windowItem) => windowItem.id === id)
          if (existing) {
            return items.map((windowItem) => (windowItem.id === id ? { ...windowItem, z: next, minimized: false } : windowItem))
          }
          return [...items, getInitialWindowState(id, next)]
        })
        return next
      })
      if (options?.mobile) {
        setMobileHistory((history) => (mobileApp ? [...history, mobileApp] : history))
        setMobileApp(id)
        setShowMobileRecents(false)
      }
      writeUrlState(id, options?.projectSlug)
      window.setTimeout(() => firstWindowButton.current?.focus(), 80)
    },
    [mobileApp, writeUrlState],
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const appParam = params.get("app") ?? window.location.hash.replace("#", "")
    const projectParam = params.get("project")
    if (projectParam) setSelectedProject(projectParam)
    if (isAppId(appParam)) {
      setUnlocked(true)
      openApp(appParam, { mobile: window.innerWidth < 768, projectSlug: projectParam ?? undefined })
    }
  }, [openApp])

  const unlock = useCallback(() => {
    setUnlocked(true)
    const params = new URLSearchParams(window.location.search)
    const appParam = params.get("app")
    if (isAppId(appParam)) openApp(appParam, { mobile: window.innerWidth < 768 })
  }, [openApp])

  const minimizeWindow = useCallback((id: AppId) => {
    if (closingWindows.current.has(id)) return
    closingWindows.current.add(id)
    animateWindowPresence(id, "minimize", () => {
      closingWindows.current.delete(id)
      setWindows((items) => items.map((windowItem) => (windowItem.id === id ? { ...windowItem, minimized: true } : windowItem)))
    })
  }, [animateWindowPresence])

  const closeWindow = useCallback(
    (id: AppId) => {
      if (closingWindows.current.has(id)) return
      closingWindows.current.add(id)
      animateWindowPresence(id, "close", () => {
        closingWindows.current.delete(id)
        setWindows((items) => items.filter((windowItem) => windowItem.id !== id))
        if (mobileApp === id) setMobileApp(null)
        const remaining = windows.filter((item) => item.id !== id)
        if (!remaining.length) writeUrlState(null)
      })
    },
    [animateWindowPresence, mobileApp, windows, writeUrlState],
  )

  const closeMobileAppToHome = useCallback((nextApp: AppId | null = null) => {
    const appElement = document.querySelector<HTMLElement>(".mobile-app-view")
    if (!appElement || prefersReducedMotion()) {
      setMobileApp(nextApp)
      return
    }

    gsap.killTweensOf(appElement)
    gsap.to(appElement, {
      y: 34,
      scale: 0.92,
      opacity: 0,
      filter: "blur(12px)",
      duration: 0.26,
      ease: "power2.inOut",
      onComplete: () => setMobileApp(nextApp),
    })
  }, [])

  const maximizeWindow = useCallback((id: AppId) => {
    if (resizingWindows.current.has(id)) return

    const targetWindow = windows.find((windowItem) => windowItem.id === id)
    if (!targetWindow) return

    const currentBounds: WindowBounds = {
      x: targetWindow.x,
      y: targetWindow.y,
      width: targetWindow.width,
      height: targetWindow.height,
    }
    const nextBounds: WindowBounds =
      targetWindow.maximized && targetWindow.restoreBounds
        ? targetWindow.restoreBounds
        : {
            x: 36,
            y: 42,
            width: Math.max(320, window.innerWidth - 72),
            height: Math.max(360, window.innerHeight - 136),
          }
    const nextMaximized = !targetWindow.maximized

    const commitResize = () => {
      resizingWindows.current.delete(id)
      setWindows((items) =>
        items.map((windowItem) =>
          windowItem.id === id
            ? {
                ...windowItem,
                ...nextBounds,
                maximized: nextMaximized,
                snapped: undefined,
                restoreBounds: nextMaximized ? currentBounds : undefined,
              }
            : windowItem,
        ),
      )
    }

    const windowElement = document.querySelector<HTMLElement>(`[data-window-id="${id}"]`)
    if (!windowElement || prefersReducedMotion()) {
      commitResize()
      return
    }

    resizingWindows.current.add(id)
    bringToFront(id)
    gsap.killTweensOf(windowElement)
    gsap.to(windowElement, {
      left: nextBounds.x,
      top: nextBounds.y,
      width: nextBounds.width,
      height: nextBounds.height,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.36,
      ease: "power3.inOut",
      onComplete: commitResize,
    })
  }, [bringToFront, windows])

  const commitSnap = useCallback(
    (id: AppId, zone: SnapZone, bounds: WindowBounds) => {
      const target = windows.find((windowItem) => windowItem.id === id)
      if (!target) return
      const current: WindowBounds = { x: target.x, y: target.y, width: target.width, height: target.height }
      const commit = () =>
        setWindows((items) =>
          items.map((windowItem) =>
            windowItem.id === id
              ? { ...windowItem, ...bounds, snapped: zone, maximized: zone === "max", restoreBounds: windowItem.restoreBounds ?? current }
              : windowItem,
          ),
        )
      const element = document.querySelector<HTMLElement>(`[data-window-id="${id}"]`)
      if (!element || prefersReducedMotion()) {
        commit()
        return
      }
      gsap.killTweensOf(element)
      gsap.to(element, {
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        x: 0,
        y: 0,
        scale: 1,
        duration: MOTION.dur.base,
        ease: MOTION.ease.inOut,
        onComplete: commit,
      })
    },
    [windows],
  )

  const startDrag = useCallback((event: React.PointerEvent, windowItem: WindowState) => {
    if ((event.target as HTMLElement).closest("button,a")) return
    let initialX = windowItem.x
    let initialY = windowItem.y

    // Pop a maximized/snapped window back to a floating size, centered under the cursor.
    if (windowItem.maximized || windowItem.snapped) {
      const restore = windowItem.restoreBounds ?? { x: 120, y: 90, width: 760, height: 560 }
      const width = restore.width
      const height = restore.height
      initialX = Math.min(Math.max(12, event.clientX - width / 2), Math.max(12, window.innerWidth - width - 12))
      initialY = 24
      setWindows((items) =>
        items.map((item) =>
          item.id === windowItem.id
            ? { ...item, x: initialX, y: initialY, width, height, maximized: false, snapped: undefined, restoreBounds: undefined }
            : item,
        ),
      )
    }

    setDragState({ id: windowItem.id, startX: event.clientX, startY: event.clientY, initialX, initialY })
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  }, [])

  const onDrag = useCallback(
    (event: React.PointerEvent) => {
      if (!dragState) return
      const nextX = Math.min(Math.max(12, dragState.initialX + event.clientX - dragState.startX), Math.max(12, window.innerWidth - 280))
      const nextY = Math.min(Math.max(12, dragState.initialY + event.clientY - dragState.startY), Math.max(12, window.innerHeight - 180))
      setWindows((items) => items.map((windowItem) => (windowItem.id === dragState.id ? { ...windowItem, x: nextX, y: nextY } : windowItem)))

      const zone = detectSnapZone(event.clientX, event.clientY)
      if (zone !== snapZoneRef.current) {
        snapZoneRef.current = zone
        setSnapPreview(zone ? { zone, bounds: snapBoundsFor(zone) } : null)
      }
    },
    [dragState],
  )

  const stopDrag = useCallback(() => {
    if (dragState && snapZoneRef.current) {
      commitSnap(dragState.id, snapZoneRef.current, snapBoundsFor(snapZoneRef.current))
    }
    snapZoneRef.current = null
    setSnapPreview(null)
    setDragState(null)
  }, [dragState, commitSnap])

  const startResize = useCallback(
    (event: React.PointerEvent, windowItem: WindowState, dir: ResizeDir) => {
      event.stopPropagation()
      bringToFront(windowItem.id)
      setResizeState({
        id: windowItem.id,
        dir,
        startX: event.clientX,
        startY: event.clientY,
        startBounds: { x: windowItem.x, y: windowItem.y, width: windowItem.width, height: windowItem.height },
      })
      ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    },
    [bringToFront],
  )

  const onResize = useCallback(
    (event: React.PointerEvent) => {
      if (!resizeState) return
      const { dir, startBounds: b } = resizeState
      const dx = event.clientX - resizeState.startX
      const dy = event.clientY - resizeState.startY
      let x = b.x
      let y = b.y
      let width = b.width
      let height = b.height

      if (dir.includes("e")) width = b.width + dx
      if (dir.includes("s")) height = b.height + dy
      if (dir.includes("w")) {
        width = b.width - dx
        x = b.x + dx
      }
      if (dir.includes("n")) {
        height = b.height - dy
        y = b.y + dy
      }

      if (width < WINDOW_MIN_WIDTH) {
        if (dir.includes("w")) x = b.x + b.width - WINDOW_MIN_WIDTH
        width = WINDOW_MIN_WIDTH
      }
      if (height < WINDOW_MIN_HEIGHT) {
        if (dir.includes("n")) y = b.y + b.height - WINDOW_MIN_HEIGHT
        height = WINDOW_MIN_HEIGHT
      }

      x = Math.max(8, x)
      y = Math.max(44, y)
      width = Math.min(width, window.innerWidth - x - 8)
      height = Math.min(height, window.innerHeight - y - 8)

      setWindows((items) =>
        items.map((windowItem) =>
          windowItem.id === resizeState.id ? { ...windowItem, x, y, width, height, maximized: false, snapped: undefined } : windowItem,
        ),
      )
    },
    [resizeState],
  )

  const stopResize = useCallback(() => setResizeState(null), [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Spotlight: Cmd/Ctrl+Space from anywhere (modifier chord never types a literal space).
      if ((event.metaKey || event.ctrlKey) && event.code === "Space") {
        if (isCoarsePointer()) return
        event.preventDefault()
        if (spotlightOpen) closeSpotlight()
        else openSpotlight()
        return
      }
      if (event.key === "Escape") {
        if (spotlightOpen) {
          closeSpotlight()
          return
        }
        if (contextMenu) {
          setContextMenu(null)
          return
        }
        if (showMobileRecents) {
          setShowMobileRecents(false)
          return
        }
        const active = [...windows].filter((item) => !item.minimized).sort((a, b) => b.z - a.z)[0]
        if (active) {
          minimizeWindow(active.id)
        } else if (mobileApp) {
          setMobileApp(null)
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [spotlightOpen, contextMenu, showMobileRecents, windows, mobileApp, minimizeWindow, openSpotlight, closeSpotlight])

  const activeWindow = useMemo(() => [...windows].filter((item) => !item.minimized).sort((a, b) => b.z - a.z)[0], [windows])
  const openedAppIds = windows.map((item) => item.id)
  const dateLabel = time.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })
  const timeLabel = time.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })

  return (
    <main className="portfolio-os-shell min-h-screen overflow-hidden bg-[#07090f] text-white">
      <a href="#portfolio-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black">
        Skip to portfolio content
      </a>

      {!booted ? <BootScreen onComplete={completeBoot} /> : null}

      {!unlocked ? <LockScreen dateLabel={dateLabel} timeLabel={timeLabel} onUnlock={unlock} /> : null}

      <section aria-label="Desktop portfolio operating system" className={cn("desktop-os hidden min-h-screen md:block", !unlocked && "pointer-events-none")}>
        <Wallpaper parallax />
        <DesktopMenuBar
          timeLabel={timeLabel}
          dateLabel={dateLabel}
          onSearch={(trigger) => openSpotlight(trigger)}
          onMenu={() => openApp("settings")}
        />
        <div className="relative z-10 h-screen px-8 pb-24 pt-16" onContextMenu={handleDesktopContextMenu}>
          <div className="desktop-icon-grid" role="list" aria-label="Portfolio applications">
            {desktopApps.map((appId) => (
              <AppIconButton key={appId} id={appId} isOpen={openedAppIds.includes(appId)} onOpen={(originRect) => openApp(appId, { originRect })} />
            ))}
          </div>
          {!windows.some((windowItem) => !windowItem.minimized) ? <SystemWidget onOpen={openApp} /> : null}
          {windows
            .filter((windowItem) => !windowItem.minimized)
            .map((windowItem) => (
              <DesktopWindow
                key={windowItem.id}
                windowItem={windowItem}
                isActive={activeWindow?.id === windowItem.id}
                onBringToFront={() => bringToFront(windowItem.id)}
                onClose={() => closeWindow(windowItem.id)}
                onMinimize={() => minimizeWindow(windowItem.id)}
                onMaximize={() => maximizeWindow(windowItem.id)}
                onDragStart={startDrag}
                onDrag={onDrag}
                onDragEnd={stopDrag}
                onResizeStart={startResize}
                onResize={onResize}
                onResizeEnd={stopResize}
                firstButtonRef={activeWindow?.id === windowItem.id ? firstWindowButton : undefined}
                launchOrigin={launchOrigins.current[windowItem.id]}
                onLaunchAnimationComplete={() => {
                  delete launchOrigins.current[windowItem.id]
                }}
              >
                <AppContent id={windowItem.id} selectedProject={selectedProject} setSelectedProject={setSelectedProject} openApp={openApp} />
              </DesktopWindow>
            ))}
          {snapPreview ? (
            <div
              className="snap-preview"
              aria-hidden="true"
              style={{ left: snapPreview.bounds.x, top: snapPreview.bounds.y, width: snapPreview.bounds.width, height: snapPreview.bounds.height }}
            />
          ) : null}
        </div>
        <DesktopDock
          windows={windows}
          onOpen={(id, originRect) => openApp(id, { originRect })}
          onRestore={(id, originRect) => {
            launchOrigins.current[id] = originRect
            bringToFront(id)
          }}
        />
      </section>

      <section aria-label="Mobile portfolio operating system" className={cn("mobile-os relative min-h-screen md:hidden", !unlocked && "pointer-events-none")}>
        <Wallpaper />
        <MobileStatusBar timeLabel={timeLabel} />
        <div className="relative z-10 min-h-screen pb-20 pt-12">
          {!mobileApp && !showMobileRecents ? <MobileHome openedAppIds={openedAppIds} onOpen={(id, originRect) => openApp(id, { mobile: true, originRect })} /> : null}
          {mobileApp && !showMobileRecents ? (
            <MobileAppView id={mobileApp} onBack={() => {
              const previous = mobileHistory[mobileHistory.length - 1]
              setMobileHistory((history) => history.slice(0, -1))
              closeMobileAppToHome(previous ?? null)
            }} launchOrigin={launchOrigins.current[mobileApp]} onLaunchAnimationComplete={() => {
              delete launchOrigins.current[mobileApp]
            }}>
              <AppContent id={mobileApp} selectedProject={selectedProject} setSelectedProject={setSelectedProject} openApp={(id, options) => openApp(id, { ...options, mobile: true })} />
            </MobileAppView>
          ) : null}
          {showMobileRecents ? (
            <MobileRecents
              windows={windows}
              activeId={mobileApp}
              onSelect={(id) => {
                setMobileApp(id)
                setShowMobileRecents(false)
                bringToFront(id)
              }}
              onDismiss={closeWindow}
            />
          ) : null}
        </div>
        <MobileNav
          onBack={() => {
            if (showMobileRecents) {
              setShowMobileRecents(false)
              return
            }
            const previous = mobileHistory[mobileHistory.length - 1]
            setMobileHistory((history) => history.slice(0, -1))
            closeMobileAppToHome(previous ?? null)
          }}
          onHome={() => {
            closeMobileAppToHome(null)
            setShowMobileRecents(false)
          }}
          onRecents={() => setShowMobileRecents((value) => !value)}
        />
      </section>

      {spotlightOpen ? (
        <Spotlight
          onLaunch={(id) => {
            setSpotlightOpen(false)
            openApp(id)
          }}
          onClose={closeSpotlight}
        />
      ) : null}

      {contextMenu ? (
        <DesktopContextMenu
          position={contextMenu}
          onClose={() => setContextMenu(null)}
          items={[
            { label: "New Terminal", icon: Terminal, onSelect: () => openApp("terminal") },
            { label: "Open Spotlight", icon: Search, onSelect: () => openSpotlight(null) },
            { label: "About This MushOS", icon: Monitor, onSelect: () => openApp("settings") },
            { label: "Change Accent", icon: Sparkles, onSelect: cycleAccent, keepOpen: true },
            { label: "Clean Up Icons", icon: PanelsTopLeft, onSelect: cleanUpIcons },
          ]}
        />
      ) : null}

      <SeoContent />
    </main>
  )
}

const BOOT_LINES: Array<{ text: string; ok?: boolean }> = [
  { text: "MushOS bootloader v1.0 — initializing", ok: false },
  { text: "Mounted /dev/portfolio", ok: true },
  { text: "Started display compositor", ok: true },
  { text: "Loaded GSAP motion engine", ok: true },
  { text: "Calibrated glass + blur pipeline", ok: true },
  { text: "Restored user session", ok: true },
  { text: "Starting MushOS desktop", ok: false },
]

function BootScreen({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) {
      onComplete()
      return
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ onComplete })
      timeline
        .from(".boot-logo", { scale: 0.82, opacity: 0, filter: "blur(12px)", duration: MOTION.dur.base, ease: MOTION.ease.out })
        .from(".boot-log-line", { opacity: 0, x: -12, stagger: 0.12, duration: 0.22, ease: MOTION.ease.out }, "-=0.08")
        .fromTo(".boot-bar-fill", { scaleX: 0 }, { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 0.18)
        .to(".boot-logo", { scale: 1.05, duration: 0.28, ease: MOTION.ease.out }, "-=0.24")
        .to(root, { opacity: 0, scale: 1.04, filter: "blur(16px)", duration: MOTION.dur.base, ease: MOTION.ease.inOut }, "+=0.12")
    }, root)

    return () => context.revert()
  }, [onComplete])

  return (
    <div ref={rootRef} className="boot-screen" role="status" aria-label="Starting MushOS">
      <Wallpaper />
      <div className="boot-inner">
        <div className="boot-logo">
          <span className="boot-mark">M</span>
          <span className="boot-wordmark">MushOS</span>
        </div>
        <div className="boot-log" aria-hidden="true">
          {BOOT_LINES.map((line) => (
            <div key={line.text} className="boot-log-line">
              {line.ok ? <span className="boot-ok">[&nbsp;&nbsp;OK&nbsp;&nbsp;]</span> : <span className="boot-dot">::</span>} {line.text}
            </div>
          ))}
        </div>
        <div className="boot-bar" aria-hidden="true">
          <span className="boot-bar-fill" />
        </div>
      </div>
    </div>
  )
}

function LockScreen({ dateLabel, timeLabel, onUnlock }: { dateLabel: string; timeLabel: string; onUnlock: () => void }) {
  const touchStart = useRef<number | null>(null)
  const lockRef = useRef<HTMLElement>(null)

  const animateUnlock = useCallback(() => {
    if (!lockRef.current || prefersReducedMotion()) {
      onUnlock()
      return
    }

    gsap.timeline({ onComplete: onUnlock })
      .to(lockRef.current.querySelector(".unlock-button"), {
        scale: 0.94,
        duration: 0.08,
        ease: "power1.out",
      })
      .to(lockRef.current, {
        opacity: 0,
        scale: 1.04,
        filter: "blur(18px)",
        duration: 0.42,
        ease: "power3.inOut",
      })
  }, [onUnlock])

  return (
    <section
      ref={lockRef}
      className="lock-screen fixed inset-0 z-[900] grid place-items-center overflow-hidden px-5 text-center"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientY
      }}
      onTouchMove={(event) => {
        if (touchStart.current && touchStart.current - event.touches[0].clientY > 58) animateUnlock()
      }}
      aria-label="Portfolio lock screen"
    >
      <Wallpaper />
      <div className="relative z-10 flex min-h-[82vh] w-full max-w-5xl flex-col items-center justify-between py-8">
        <div className="glass-pill flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/74">
          <Wifi className="h-4 w-4" />
          MushOS
          <BatteryFull className="h-4 w-4" />
        </div>
        <div className="space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-white/68">{profile.name}</p>
          <h1 className="lock-time font-semibold leading-none tracking-normal text-white">{timeLabel}</h1>
          <p className="text-lg text-white/78">{dateLabel}</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <button className="unlock-button focus-ring group" onClick={animateUnlock} aria-label="Unlock portfolio operating system">
            <span>Enter</span>
            <span className="unlock-button-light" />
          </button>
          <p className="text-sm text-white/62 md:hidden">Swipe up to unlock</p>
        </div>
      </div>
    </section>
  )
}

function Wallpaper({ parallax = false }: { parallax?: boolean }) {
  const meshLayerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!parallax || prefersReducedMotion() || isCoarsePointer()) return
    const meshLayer = meshLayerRef.current
    const grid = gridRef.current
    if (!meshLayer || !grid) return

    const meshX = gsap.quickTo(meshLayer, "x", { duration: 0.9, ease: MOTION.ease.out })
    const meshY = gsap.quickTo(meshLayer, "y", { duration: 0.9, ease: MOTION.ease.out })
    const gridX = gsap.quickTo(grid, "x", { duration: 1.2, ease: MOTION.ease.out })
    const gridY = gsap.quickTo(grid, "y", { duration: 1.2, ease: MOTION.ease.out })

    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5
      const ny = event.clientY / window.innerHeight - 0.5
      meshX(nx * -30)
      meshY(ny * -30)
      gridX(nx * -14)
      gridY(ny * -14)
    }

    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [parallax])

  return (
    <div className="wallpaper absolute inset-0 overflow-hidden" aria-hidden="true">
      <div ref={meshLayerRef} className="wallpaper-layer">
        <div className="wallpaper-mesh" />
      </div>
      <div ref={gridRef} className="wallpaper-grid" />
      <div className="wallpaper-sheen" />
    </div>
  )
}

function DesktopMenuBar({
  timeLabel,
  dateLabel,
  onSearch,
  onMenu,
}: {
  timeLabel: string
  dateLabel: string
  onSearch: (trigger: HTMLElement) => void
  onMenu: () => void
}) {
  return (
    <div className="glass-menubar fixed left-4 right-4 top-4 z-30 flex h-10 items-center justify-between px-4 text-sm text-white/78">
      <div className="flex items-center gap-3">
        <button className="menubar-brand focus-ring" onClick={onMenu} aria-label="About This MushOS">
          <Monitor className="h-4 w-4 text-white" />
          <span className="font-semibold text-white">MushOS</span>
        </button>
        <span className="hidden text-white/54 lg:inline">Adegbite Joshua</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="menubar-search focus-ring"
          onClick={(event) => onSearch(event.currentTarget)}
          aria-label="Open Spotlight search"
        >
          <Search className="h-4 w-4" />
          <kbd className="menubar-kbd">⌘ Space</kbd>
        </button>
        <Wifi className="h-4 w-4" />
        <BatteryFull className="h-4 w-4" />
        <span>{dateLabel}</span>
        <span className="font-medium text-white">{timeLabel}</span>
      </div>
    </div>
  )
}

function AppIconButton({ id, isOpen, onOpen }: { id: AppId; isOpen: boolean; onOpen: (originRect: DOMRect) => void }) {
  const Icon = appIcons[id]
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleOpen = () => {
    if (buttonRef.current && !prefersReducedMotion()) {
      const tile = buttonRef.current.querySelector(".app-icon-tile")
      gsap.timeline()
        .to(buttonRef.current, { y: -4, scale: 0.96, duration: 0.08, ease: "power1.out" })
        .to(tile, { scale: 1.12, rotate: 1.5, duration: 0.18, ease: "back.out(3)" }, 0.05)
        .to(buttonRef.current, { y: 0, scale: 1, duration: 0.22, ease: "elastic.out(1, 0.55)" }, 0.12)
        .to(tile, { scale: 1, rotate: 0, duration: 0.22, ease: "power2.out" }, 0.18)
    }
    if (buttonRef.current) {
      onOpen(buttonRef.current.getBoundingClientRect())
      return
    }
    onOpen(new DOMRect(window.innerWidth / 2, window.innerHeight / 2, 1, 1))
  }

  return (
    <button ref={buttonRef} className="app-icon focus-ring" onClick={handleOpen} role="listitem" aria-label={`Open ${appNames[id]} app`}>
      <span className="app-icon-tile" style={{ background: appGradients[id] }}>
        <Icon className="h-8 w-8 text-white drop-shadow" strokeWidth={1.8} />
      </span>
      <span className="app-icon-label">{appNames[id]}</span>
      {isOpen ? <span className="app-running-dot" aria-hidden="true" /> : null}
    </button>
  )
}

function SystemWidget({ onOpen }: { onOpen: (id: AppId) => void }) {
  return (
    <aside className="desktop-widget glass-panel absolute right-8 top-20 hidden w-[310px] p-4 xl:block" aria-label="Portfolio status">
      <div className="mb-4 flex items-center gap-3">
        <Image src={profile.avatar} alt="" width={44} height={44} className="h-11 w-11 rounded-2xl object-cover" />
        <div>
          <p className="font-semibold text-white">{profile.name}</p>
          <p className="text-sm text-white/58">{profile.title}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {systemStats.map((stat) => (
          <div key={stat.label} className="rounded-md bg-white/[0.07] p-3">
            <p className="text-[0.68rem] uppercase tracking-[0.16em] text-white/45">{stat.label}</p>
            <p className="mt-1 text-sm text-white/85">{stat.value}</p>
          </div>
        ))}
      </div>
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#10141d] transition hover:bg-white/90 focus-ring" onClick={() => onOpen("contact")}>
        <Mail className="h-4 w-4" />
        Start a conversation
      </button>
    </aside>
  )
}

function DesktopWindow({
  windowItem,
  isActive,
  children,
  onBringToFront,
  onClose,
  onMinimize,
  onMaximize,
  onDragStart,
  onDrag,
  onDragEnd,
  onResizeStart,
  onResize,
  onResizeEnd,
  firstButtonRef,
  launchOrigin,
  onLaunchAnimationComplete,
}: {
  windowItem: WindowState
  isActive: boolean
  children: React.ReactNode
  onBringToFront: () => void
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onDragStart: (event: React.PointerEvent, windowItem: WindowState) => void
  onDrag: (event: React.PointerEvent) => void
  onDragEnd: () => void
  onResizeStart: (event: React.PointerEvent, windowItem: WindowState, dir: ResizeDir) => void
  onResize: (event: React.PointerEvent) => void
  onResizeEnd: () => void
  firstButtonRef?: React.RefObject<HTMLButtonElement | null>
  launchOrigin?: DOMRect
  onLaunchAnimationComplete: () => void
}) {
  const Icon = appIcons[windowItem.id]
  const windowRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const element = windowRef.current
    if (!element || prefersReducedMotion()) return

    const titlebar = element.querySelector(".window-titlebar")
    const content = element.querySelector(".window-content")
    const finalRect = element.getBoundingClientRect()
    const origin = launchOrigin
    const sourceX = origin ? origin.left + origin.width / 2 - (finalRect.left + finalRect.width / 2) : 0
    const sourceY = origin ? origin.top + origin.height / 2 - (finalRect.top + finalRect.height / 2) : 0
    const sourceScale = origin
      ? Math.max(0.08, Math.min(0.18, Math.max(origin.width / finalRect.width, origin.height / finalRect.height)))
      : 1
    const timeline = gsap.timeline()
    timeline
      .fromTo(
        element,
        {
          x: sourceX,
          y: sourceY,
          scale: sourceScale,
          filter: origin ? "blur(18px)" : "blur(0px)",
          clipPath: origin ? "inset(42% 42% 42% 42% round 8px)" : "inset(0% 0% 0% 0% round 8px)",
          transformOrigin: "50% 50%",
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0% round 8px)",
          duration: 0.58,
          ease: "power4.out",
          onComplete: onLaunchAnimationComplete,
        },
      )
      .fromTo(titlebar, { y: -8 }, { y: 0, duration: 0.26, ease: "power2.out" }, 0.16)
      .fromTo(content, { y: 14 }, { y: 0, duration: 0.34, ease: "power2.out" }, 0.2)

    return () => {
      timeline.kill()
    }
  }, [launchOrigin, windowItem.id])

  useLayoutEffect(() => {
    const element = windowRef.current
    if (!element || !isActive || prefersReducedMotion()) return
    gsap.fromTo(element, { scale: 0.995 }, { scale: 1, duration: 0.18, ease: "power2.out" })
  }, [isActive])

  return (
    <article
      ref={windowRef}
      data-window-id={windowItem.id}
      className={cn("os-window glass-window", isActive && "is-active")}
      style={{ left: windowItem.x, top: windowItem.y, width: windowItem.width, height: windowItem.height, zIndex: windowItem.z }}
      onPointerDown={onBringToFront}
      aria-label={`${appNames[windowItem.id]} application window`}
    >
      <header className="window-titlebar" onPointerDown={(event) => onDragStart(event, windowItem)} onPointerMove={onDrag} onPointerUp={onDragEnd} onPointerCancel={onDragEnd}>
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-md shadow-inner" style={{ background: appGradients[windowItem.id] }}>
            <Icon className="h-4 w-4 text-white" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-white">{appNames[windowItem.id]}</h2>
            <p className="text-[0.72rem] text-white/45">{profile.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button ref={firstButtonRef} className="window-control bg-[#ffc766] text-[#4d3100] focus-ring" onClick={onMinimize} aria-label={`Minimize ${appNames[windowItem.id]}`}>
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            className="window-control bg-[#63d471] text-[#103814] focus-ring"
            onClick={onMaximize}
            aria-label={`${windowItem.maximized ? "Restore" : "Maximize"} ${appNames[windowItem.id]}`}
            title={windowItem.maximized ? "Restore" : "Maximize"}
          >
            {windowItem.maximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
          <button className="window-control bg-[#ff6b6b] text-[#4f1010] focus-ring" onClick={onClose} aria-label={`Close ${appNames[windowItem.id]}`}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>
      <div className="window-content">{children}</div>
      {!windowItem.maximized ? (
        <div className="window-resize" aria-hidden="true">
          {(["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const).map((dir) => (
            <span
              key={dir}
              className={`resize-handle resize-${dir}`}
              onPointerDown={(event) => onResizeStart(event, windowItem, dir)}
              onPointerMove={onResize}
              onPointerUp={onResizeEnd}
              onPointerCancel={onResizeEnd}
            />
          ))}
        </div>
      ) : null}
    </article>
  )
}

function DesktopDock({
  windows,
  onOpen,
  onRestore,
}: {
  windows: WindowState[]
  onOpen: (id: AppId, originRect: DOMRect) => void
  onRestore: (id: AppId, originRect: DOMRect) => void
}) {
  const navRef = useRef<HTMLElement>(null)
  const magnifyRef = useRef<Array<{ center: number; scale: ReturnType<typeof gsap.quickTo>; y: ReturnType<typeof gsap.quickTo> }>>([])

  const buildMagnifiers = useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    const tiles = Array.from(nav.querySelectorAll<HTMLElement>(".dock-tile"))
    magnifyRef.current = tiles.map((tile) => {
      const rect = tile.getBoundingClientRect()
      return {
        center: rect.left + rect.width / 2,
        scale: gsap.quickTo(tile, "scale", { duration: 0.2, ease: "power3.out" }),
        y: gsap.quickTo(tile, "y", { duration: 0.2, ease: "power3.out" }),
      }
    })
  }, [])

  const handleMagnify = (event: React.PointerEvent) => {
    if (prefersReducedMotion() || isCoarsePointer()) return
    if (!magnifyRef.current.length) buildMagnifiers()
    const pointerX = event.clientX
    const range = 130
    const max = 1.5
    for (const item of magnifyRef.current) {
      const distance = Math.abs(pointerX - item.center)
      const linear = Math.max(0, 1 - distance / range)
      const influence = linear * linear * (3 - 2 * linear) // smoothstep falloff
      item.scale(1 + (max - 1) * influence)
      item.y(-18 * influence)
    }
  }

  const resetMagnify = () => {
    for (const item of magnifyRef.current) {
      item.scale(1)
      item.y(0)
    }
  }

  const animateDockPress = (id: AppId, action: () => void) => {
    const button = document.querySelector<HTMLElement>(`[data-dock-id="${id}"]`)
    if (button && !prefersReducedMotion()) {
      gsap.timeline()
        .to(button, { y: -8, duration: 0.14, ease: MOTION.ease.out })
        .to(button, { y: 0, duration: 0.28, ease: "elastic.out(1, 0.55)" })
    }
    action()
  }

  return (
    <nav
      ref={navRef}
      className="desktop-dock glass-dock fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 px-3 py-2"
      aria-label="Desktop dock"
      onPointerEnter={buildMagnifiers}
      onPointerMove={handleMagnify}
      onPointerLeave={resetMagnify}
    >
      {internalApps.map((id) => {
        const Icon = appIcons[id]
        const state = windows.find((item) => item.id === id)
        return (
          <button
            key={id}
            data-dock-id={id}
            className={cn("dock-button focus-ring", state && "is-open", state?.minimized && "is-minimized")}
            onClick={(event) =>
              animateDockPress(id, () => {
                const originRect = event.currentTarget.getBoundingClientRect()
                return state ? onRestore(id, originRect) : onOpen(id, originRect)
              })
            }
            aria-label={`${state ? "Switch to" : "Open"} ${appNames[id]}`}
          >
            <span className="dock-tile" style={{ background: appGradients[id] }}>
              <Icon className="h-5 w-5 text-white" />
            </span>
            <span className="dock-tooltip">{appNames[id]}</span>
          </button>
        )
      })}
    </nav>
  )
}

function MobileStatusBar({ timeLabel }: { timeLabel: string }) {
  return (
    <div className="fixed left-0 right-0 top-0 z-40 flex h-9 items-center justify-between px-5 text-xs font-semibold text-white/86">
      <span>{timeLabel}</span>
      <span className="flex items-center gap-2">
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-3.5 w-3.5" />
      </span>
    </div>
  )
}

function MobileHome({ openedAppIds, onOpen }: { openedAppIds: AppId[]; onOpen: (id: AppId, originRect: DOMRect) => void }) {
  const homeRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!homeRef.current || prefersReducedMotion()) return
    const items = homeRef.current.querySelectorAll(".app-icon")
    const timeline = gsap.timeline()
    timeline.fromTo(homeRef.current.querySelector(".glass-panel"), { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, ease: "power2.out" })
    timeline.fromTo(items, { y: 18, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, stagger: 0.025, duration: 0.34, ease: "back.out(1.9)" }, 0.06)
    return () => {
      timeline.kill()
    }
  }, [])

  return (
    <div ref={homeRef} className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-sm flex-col justify-between px-5">
      <div className="glass-panel mt-4 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-white/48">MushOS</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">{profile.name}</h1>
        <p className="mt-1 text-sm leading-6 text-white/65">{profile.summary}</p>
      </div>
      <div className="mobile-app-grid" role="list" aria-label="Mobile portfolio apps">
        {desktopApps.map((id) => (
          <AppIconButton key={id} id={id} isOpen={openedAppIds.includes(id)} onOpen={(originRect) => onOpen(id, originRect)} />
        ))}
      </div>
    </div>
  )
}

function MobileAppView({
  id,
  children,
  onBack,
  launchOrigin,
  onLaunchAnimationComplete,
}: {
  id: AppId
  children: React.ReactNode
  onBack: () => void
  launchOrigin?: DOMRect
  onLaunchAnimationComplete: () => void
}) {
  const Icon = appIcons[id]
  const appRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const element = appRef.current
    if (!element || prefersReducedMotion()) return

    const header = element.querySelector(".mobile-app-header")
    const content = element.querySelector(".mobile-app-content")
    const finalRect = element.getBoundingClientRect()
    const origin = launchOrigin
    const sourceX = origin ? origin.left + origin.width / 2 - (finalRect.left + finalRect.width / 2) : 0
    const sourceY = origin ? origin.top + origin.height / 2 - (finalRect.top + finalRect.height / 2) : 0
    const sourceScale = origin
      ? Math.max(0.12, Math.min(0.26, Math.max(origin.width / finalRect.width, origin.height / finalRect.height)))
      : 1
    const timeline = gsap.timeline()
    timeline
      .fromTo(
        element,
        {
          x: sourceX,
          y: sourceY,
          scale: sourceScale,
          filter: origin ? "blur(16px)" : "blur(0px)",
          clipPath: origin ? "inset(46% 38% 46% 38% round 22px)" : "inset(0% 0% 0% 0% round 0px)",
          transformOrigin: "50% 50%",
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          duration: 0.46,
          ease: "power4.out",
          onComplete: onLaunchAnimationComplete,
        },
      )
      .fromTo(header, { y: -8 }, { y: 0, duration: 0.22, ease: "power2.out" }, 0.08)
      .fromTo(content, { y: 14 }, { y: 0, duration: 0.28, ease: "power2.out" }, 0.14)

    return () => {
      timeline.kill()
    }
  }, [id, launchOrigin])

  return (
    <article ref={appRef} className="mobile-app-view" aria-label={`${appNames[id]} mobile app`}>
      <header className="mobile-app-header">
        <button className="mobile-header-button focus-ring" onClick={onBack} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: appGradients[id] }}>
            <Icon className="h-4 w-4 text-white" />
          </span>
          <h2 className="font-semibold text-white">{appNames[id]}</h2>
        </div>
        <span className="w-9" aria-hidden="true" />
      </header>
      <div className="mobile-app-content">{children}</div>
    </article>
  )
}

function MobileNav({ onBack, onHome, onRecents }: { onBack: () => void; onHome: () => void; onRecents: () => void }) {
  return (
    <nav className="mobile-nav glass-dock fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-5 px-6 py-2" aria-label="Mobile navigation">
      <button className="mobile-nav-button focus-ring" onClick={onBack} aria-label="Back">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button className="mobile-nav-button focus-ring" onClick={onHome} aria-label="Home and minimize current app">
        <Home className="h-5 w-5" />
      </button>
      <button className="mobile-nav-button focus-ring" onClick={onRecents} aria-label="Recent apps">
        <PanelsTopLeft className="h-5 w-5" />
      </button>
    </nav>
  )
}

function MobileRecents({ windows, activeId, onSelect, onDismiss }: { windows: WindowState[]; activeId: AppId | null; onSelect: (id: AppId) => void; onDismiss: (id: AppId) => void }) {
  return (
    <div className="mx-auto w-full max-w-sm px-4 pt-6">
      <h2 className="mb-4 px-2 text-lg font-semibold text-white">Recent Apps</h2>
      <div className="space-y-3">
        {windows.length ? windows.map((item) => {
          const Icon = appIcons[item.id]
          return (
            <div key={item.id} className={cn("recent-card glass-panel p-4", activeId === item.id && "ring-1 ring-white/40")}>
              <button className="flex w-full items-center gap-3 text-left focus-ring" onClick={() => onSelect(item.id)}>
                <span className="flex h-11 w-11 items-center justify-center rounded-md" style={{ background: appGradients[item.id] }}>
                  <Icon className="h-5 w-5 text-white" />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-white">{appNames[item.id]}</span>
                  <span className="text-sm text-white/55">{item.minimized ? "Minimized" : "Open in background"}</span>
                </span>
              </button>
              <button className="mt-3 rounded-md bg-white/10 px-3 py-1.5 text-xs text-white/75 transition hover:bg-white/16 focus-ring" onClick={() => onDismiss(item.id)} aria-label={`Dismiss ${appNames[item.id]}`}>
                Dismiss
              </button>
            </div>
          )
        }) : (
          <div className="glass-panel p-6 text-center text-sm text-white/62">No applications are open yet.</div>
        )}
      </div>
    </div>
  )
}

function AppContent({
  id,
  selectedProject,
  setSelectedProject,
  openApp,
}: {
  id: AppId
  selectedProject: string
  setSelectedProject: (slug: string) => void
  openApp: (id: AppId, options?: OpenOptions) => void
}) {
  if (id === "about") return <AboutApp openApp={openApp} />
  if (id === "projects") return <ProjectsApp selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
  if (id === "experience") return <ExperienceApp />
  if (id === "skills") return <SkillsApp />
  if (id === "contact") return <ContactApp />
  if (id === "resume") return <ResumeApp />
  if (id === "terminal") return <TerminalApp openApp={openApp} />
  return <SettingsApp openApp={openApp} />
}

function AboutApp({ openApp }: { openApp: (id: AppId, options?: OpenOptions) => void }) {
  return (
    <div className="content-grid">
      <section className="panel-solid p-5">
        <div className="flex flex-col gap-5 sm:flex-row">
          <Image src={profile.avatar} alt="Joshua Adegbite" width={180} height={180} className="h-36 w-36 rounded-md object-cover shadow-2xl" priority />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">{profile.title}</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">{profile.name}</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/68">{profile.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="action-button focus-ring" onClick={() => openApp("contact")}>
                <Mail className="h-4 w-4" />
                Contact
              </button>
              <a className="action-button focus-ring" href={profile.resume} download>
                <Download className="h-4 w-4" />
                Resume
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="panel-muted p-5">
        <h3 className="section-title">Profile Notes</h3>
        <div className="mt-4 space-y-4 text-sm leading-7 text-white/70">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section className="panel-muted p-5">
        <h3 className="section-title">Signal</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {profile.descriptors.map((item) => (
            <div key={item} className="rounded-md border border-white/8 bg-white/[0.055] px-3 py-2 text-sm text-white/72">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ProjectsApp({ selectedProject, setSelectedProject }: { selectedProject: string; setSelectedProject: (slug: string) => void }) {
  const selected = portfolioProjects.find((project) => formatProjectSlug(project.name) === selectedProject) ?? portfolioProjects[0]
  return (
    <div className="projects-layout">
      <aside className="project-sidebar" aria-label="Project list">
        {portfolioProjects.map((project) => {
          const slug = formatProjectSlug(project.name)
          return (
            <button
              key={project.name}
              className={cn("project-list-item focus-ring", selected?.name === project.name && "is-selected")}
              onClick={() => {
                setSelectedProject(slug)
                const url = new URL(window.location.href)
                url.searchParams.set("app", "projects")
                url.searchParams.set("project", slug)
                window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`)
              }}
            >
              <span>{project.name.split(" - ")[0]}</span>
              <small>{project.tags.slice(0, 3).map((tag) => tag.name).join(" / ")}</small>
            </button>
          )
        })}
      </aside>
      {selected ? (
        <section className="project-detail panel-solid">
          <div className="project-image-frame">
            <Image src={selected.imageUrl} alt={`${selected.name} screenshot`} width={880} height={520} className="h-full w-full object-cover" />
          </div>
          <div className="p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Featured build</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{selected.name}</h3>
            <p className="mt-3 text-sm leading-6 text-white/68">{selected.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <span key={`${selected.name}-${tag.name}`} className="skill-chip">
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={selected.web_url} target="_blank" rel="noopener noreferrer" className="action-button focus-ring">
                <ExternalLink className="h-4 w-4" />
                Live app
              </a>
              <a href={selected.source_code_link} target="_blank" rel="noopener noreferrer" className="action-button secondary focus-ring">
                <Github className="h-4 w-4" />
                Source
              </a>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}

function ExperienceApp() {
  return (
    <div className="timeline">
      {experiences.map((item, index) => (
        <article key={`${item.company}-${item.title}`} className="timeline-item">
          <span className="timeline-dot" />
          <div className="panel-solid p-5">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">{item.period}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-white/58">{item.company}</p>
              </div>
              <span className="rounded-md bg-white/10 px-3 py-1 text-xs text-white/68">0{index + 1}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/68">{item.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/66">
              {item.achievements.map((achievement) => (
                <li key={achievement} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--os-accent)" }} />
                  {achievement}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.technologies.map((tech) => (
                <span key={`${item.company}-${tech}`} className="skill-chip">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function SkillsApp() {
  return (
    <div className="content-grid">
      {skillGroups.map((group) => (
        <section key={group.title} className="panel-solid p-5">
          <h3 className="section-title">{group.title}</h3>
          <p className="mt-2 text-sm text-white/58">{group.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <span key={`${group.title}-${skill}`} className="skill-chip prominent">
                {skill}
              </span>
            ))}
          </div>
        </section>
      ))}
      <section className="panel-muted p-5">
        <h3 className="section-title">Engineering Bias</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {["Performance first", "Accessible UI", "Production reliability"].map((item) => (
            <div key={item} className="rounded-md bg-white/[0.055] p-4 text-sm text-white/72">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ContactApp() {
  return (
    <div className="contact-layout">
      <section className="panel-solid p-5">
        <h3 className="section-title">Message Joshua</h3>
        <p className="mt-2 text-sm leading-6 text-white/62">Have a project in mind or want to discuss an opportunity? Send a note from this mail console.</p>
        <div className="mt-5 space-y-3 text-sm">
          <a className="contact-link focus-ring" href={profile.links.email}>
            <Mail className="h-4 w-4" />
            {profile.email}
          </a>
          <a className="contact-link focus-ring" href={profile.links.github} target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4" />
            github.com/Adegbite-Joshua
          </a>
          <a className="contact-link focus-ring" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-4 w-4" />
            linkedin.com/in/adegbite-joshua-8a45a6257
          </a>
          <a className="contact-link focus-ring" href={profile.links.twitter} target="_blank" rel="noopener noreferrer">
            <Twitter className="h-4 w-4" />
            @JoshuaAdegbite7
          </a>
        </div>
      </section>
      <section className="panel-muted p-5">
        <ContactForm />
      </section>
    </div>
  )
}

function ResumeApp() {
  return (
    <div className="content-grid">
      <section className="panel-solid p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-white/45">Document viewer</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Joshua Adegbite Resume</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/66">A concise PDF version of my work history, technical stack, and project experience is available for download.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="action-button focus-ring">
            <ExternalLink className="h-4 w-4" />
            Open PDF
          </a>
          <a href={profile.resume} download className="action-button secondary focus-ring">
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>
      </section>
      <section className="resume-preview panel-muted">
        <FileText className="h-16 w-16 text-white/70" />
        <p className="mt-4 text-sm text-white/58">Resume document ready</p>
      </section>
    </div>
  )
}

function buildTerminalIntro(): TerminalEntry[] {
  return [
    { type: "system", text: "MushOS 1.0.4 LTS (portfolio-kernel x86_64)" },
    { type: "system", text: `Last login: ${new Date().toDateString()} on tty1` },
    { type: "system", text: "Type 'help' for the list of available commands." },
    { type: "prompt", command: "whoami" },
    { type: "output", text: "joshua-adegbite" },
    { type: "prompt", command: "neofetch" },
    { type: "neofetch" },
  ]
}

function longestCommonPrefix(values: string[]): string {
  if (!values.length) return ""
  let prefix = values[0]
  for (const value of values) {
    while (!value.startsWith(prefix)) prefix = prefix.slice(0, -1)
  }
  return prefix
}

function resolveAccent(value: string): string | null {
  const normalized = value.trim().toLowerCase()
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(normalized)) return normalized
  const named: Record<string, string> = {
    cyan: "#83eee2",
    teal: "#83eee2",
    blue: "#9cc8ff",
    sky: "#9cc8ff",
    purple: "#e2a8ff",
    violet: "#e2a8ff",
    orange: "#ffb86b",
    amber: "#ffb86b",
    green: "#79e0b5",
    mint: "#79e0b5",
    pink: "#ff8aa6",
    rose: "#ff8aa6",
    reset: "#83eee2",
    default: "#83eee2",
  }
  return named[normalized] ?? null
}

function TerminalApp({ openApp }: { openApp: (id: AppId, options?: OpenOptions) => void }) {
  const [entries, setEntries] = useState<TerminalEntry[]>([])
  const [command, setCommand] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [booting, setBooting] = useState(true)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight })
  }, [entries])

  // Typewriter boot: reveal the intro sequence, typing each command out character by character.
  useEffect(() => {
    if (prefersReducedMotion()) {
      setEntries(buildTerminalIntro())
      setBooting(false)
      return
    }
    const intro = buildTerminalIntro()
    const timers: number[] = []
    let cancelled = false
    let index = 0

    const schedule = (fn: () => void, delay: number) => {
      timers.push(window.setTimeout(() => !cancelled && fn(), delay))
    }

    const next = () => {
      if (cancelled) return
      if (index >= intro.length) {
        setBooting(false)
        window.setTimeout(() => inputRef.current?.focus(), 0)
        return
      }
      const item = intro[index]
      index += 1
      if (item.type === "prompt") {
        const full = item.command
        setEntries((prev) => [...prev, { type: "prompt", command: "" }])
        let charIndex = 0
        const typeChar = () => {
          if (cancelled) return
          charIndex += 1
          const partial = full.slice(0, charIndex)
          setEntries((prev) => {
            const copy = prev.slice()
            const last = copy[copy.length - 1]
            if (last && last.type === "prompt") copy[copy.length - 1] = { type: "prompt", command: partial }
            return copy
          })
          if (charIndex < full.length) schedule(typeChar, 52)
          else schedule(next, 260)
        }
        schedule(typeChar, 160)
      } else {
        setEntries((prev) => [...prev, item])
        schedule(next, item.type === "neofetch" ? 180 : 220)
      }
    }

    schedule(next, 340)
    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const runCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim()
    const normalized = trimmed.toLowerCase()
    const nextEntries: TerminalEntry[] = [{ type: "prompt", command: rawCommand }]

    if (!normalized) {
      setEntries((current) => [...current, ...nextEntries])
      return
    }

    if (normalized === "clear") {
      setEntries([])
      return
    }

    if (normalized === "whoami") {
      nextEntries.push({ type: "output", text: "joshua-adegbite" })
    } else if (normalized === "neofetch" || normalized === "sysinfo") {
      nextEntries.push({ type: "neofetch" })
    } else if (normalized === "cat about.txt" || normalized === "about") {
      nextEntries.push({ type: "output", text: `${profile.name} - ${profile.title}` })
      profile.about.forEach((paragraph) => nextEntries.push({ type: "output", text: paragraph }))
    } else if (normalized === "skills" || normalized === "ls skills/") {
      nextEntries.push({ type: "skills" })
    } else if (normalized === "projects" || normalized === "ls projects/") {
      nextEntries.push({ type: "output", text: "Featured projects:" })
      portfolioProjects.forEach((project, index) => {
        nextEntries.push({ type: "output", text: `${index + 1}. ${project.name}` })
      })
    } else if (normalized === "experience") {
      nextEntries.push({ type: "output", text: "Professional experience:" })
      experiences.forEach((experience) => {
        nextEntries.push({ type: "output", text: `${experience.title} @ ${experience.company} (${experience.period})` })
      })
    } else if (normalized === "contact") {
      nextEntries.push({ type: "output", text: `Email: ${profile.email}` })
      nextEntries.push({ type: "output", text: `GitHub: ${profile.links.github}` })
      nextEntries.push({ type: "output", text: `LinkedIn: ${profile.links.linkedin}` })
    } else if (normalized === "resume") {
      openApp("resume")
      nextEntries.push({ type: "output", text: "Opening resume document..." })
    } else if (normalized === "date") {
      nextEntries.push({ type: "output", text: new Date().toString() })
    } else if (normalized === "pwd") {
      nextEntries.push({ type: "output", text: "/home/joshua-adegbite" })
    } else if (normalized === "history") {
      if (!history.length) {
        nextEntries.push({ type: "output", text: "No commands in history yet." })
      } else {
        history.forEach((item, index) => nextEntries.push({ type: "output", text: `${String(index + 1).padStart(4)}  ${item}` }))
      }
    } else if (normalized.startsWith("echo")) {
      const text = trimmed.slice(4).trim().replace(/^["']|["']$/g, "")
      nextEntries.push({ type: "output", text })
    } else if (normalized.startsWith("theme") || normalized.startsWith("accent")) {
      const value = trimmed.slice(normalized.startsWith("theme") ? 5 : 6).trim()
      if (!value) {
        nextEntries.push({ type: "error", text: "usage: theme <color>  (e.g. theme #ff8aa6 or theme cyan)" })
      } else {
        const resolved = resolveAccent(value)
        if (resolved) {
          applyAccent(resolved)
          nextEntries.push({ type: "success", text: `Accent set to ${resolved}.` })
        } else {
          nextEntries.push({ type: "error", text: `unknown color: ${value}` })
        }
      }
    } else if (normalized.startsWith("open ")) {
      const requestedApp = normalized.replace("open ", "").trim()
      if (["about", "projects", "experience", "skills", "contact", "resume", "settings"].includes(requestedApp)) {
        openApp(requestedApp as AppId)
        nextEntries.push({ type: "output", text: `Opening ${requestedApp}...` })
      } else {
        nextEntries.push({ type: "error", text: `app not found: ${requestedApp}` })
      }
    } else if (normalized === "sudo" || normalized.startsWith("sudo ")) {
      nextEntries.push({ type: "error", text: "joshua-adegbite is not in the sudoers file. This incident will be reported." })
    } else if (normalized === "help") {
      nextEntries.push({ type: "output", text: "Available commands:" })
      TERMINAL_COMMANDS.forEach((item) => {
        nextEntries.push({ type: "output", text: `  ${(item.usage ?? item.name).padEnd(16)}${item.description}` })
      })
    } else if (normalized === "ls") {
      nextEntries.push({ type: "output", text: "about.txt  skills/  projects/  experience.log  contact.vcf  resume.pdf" })
    } else {
      nextEntries.push({ type: "error", text: `command not found: ${trimmed}. Type 'help' for options.` })
    }

    setEntries((current) => [...current, ...nextEntries])
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = command
    if (value.trim()) setHistory((prev) => [...prev, value.trim()])
    setHistoryIndex(-1)
    runCommand(value)
    setCommand("")
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      if (!history.length) return
      event.preventDefault()
      const index = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(index)
      setCommand(history[index])
    } else if (event.key === "ArrowDown") {
      if (historyIndex < 0) return
      event.preventDefault()
      const index = historyIndex + 1
      if (index >= history.length) {
        setHistoryIndex(-1)
        setCommand("")
      } else {
        setHistoryIndex(index)
        setCommand(history[index])
      }
    } else if (event.key === "Tab") {
      event.preventDefault()
      const token = command.trim().toLowerCase()
      if (!token || token.includes(" ")) return
      const matches = TERMINAL_COMMANDS.map((item) => item.name).filter((name) => name.startsWith(token))
      if (matches.length === 1) {
        setCommand(matches[0] + " ")
      } else if (matches.length > 1) {
        const prefix = longestCommonPrefix(matches)
        if (prefix.length > token.length) setCommand(prefix)
        else setEntries((prev) => [...prev, { type: "prompt", command }, { type: "output", text: matches.join("   ") }])
      }
    }
  }

  return (
    <section className="terminal-app" onClick={() => inputRef.current?.focus()} aria-label="Interactive portfolio terminal">
      <div className="terminal-chrome" aria-hidden="true">
        <span className="terminal-dot bg-[#ff5f57]" />
        <span className="terminal-dot bg-[#ffbd2e]" />
        <span className="terminal-dot bg-[#28c840]" />
        <span className="terminal-title">joshua-adegbite@mush-os: ~</span>
      </div>
      <div ref={scrollerRef} className="terminal-screen">
        {entries.map((entry, index) => {
          if (entry.type === "prompt") {
            return (
              <div key={`${entry.type}-${index}`} className="terminal-line terminal-prompt-line">
                <TerminalPrompt />
                <span className="terminal-command">{entry.command}</span>
              </div>
            )
          }
          if (entry.type === "skills") {
            return <TerminalSkills key={`${entry.type}-${index}`} />
          }
          if (entry.type === "neofetch") {
            return <TerminalNeofetch key={`${entry.type}-${index}`} />
          }
          return (
            <div
              key={`${entry.type}-${index}`}
              className={cn(
                "terminal-line",
                entry.type === "system" && "terminal-system",
                entry.type === "error" && "terminal-error",
                entry.type === "success" && "terminal-success",
              )}
            >
              {entry.text}
            </div>
          )
        })}
        <form onSubmit={handleSubmit} className={cn("terminal-line terminal-prompt-line terminal-active-line", booting && "terminal-hidden")}>
          <TerminalPrompt />
          <span className="terminal-live">
            <span className="terminal-command">{command}</span>
            {!booting ? <span className="terminal-cursor" aria-hidden="true" /> : null}
          </span>
          <input
            ref={inputRef}
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input-overlay"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Terminal command"
            disabled={booting}
          />
        </form>
      </div>
    </section>
  )
}

function TerminalPrompt() {
  return (
    <span className="terminal-prompt" aria-hidden="true">
      <span className="terminal-user">joshua-adegbite@mush-os</span>
      <span className="terminal-path">:~</span>
      <span className="terminal-dollar">$</span>
    </span>
  )
}

function TerminalNeofetch() {
  const counts = skillGroups.map((group) => `${group.title} ${group.skills.length}`).join("   ")
  const info: Array<[string, string]> = [
    ["OS", "MushOS 1.0.4 LTS x86_64"],
    ["Host", "Portfolio Workstation"],
    ["Kernel", "portfolio-kernel 6.1"],
    ["Role", profile.title],
    ["Location", profile.location],
    ["Uptime", "5+ years in production"],
    ["Shell", "mush-sh 1.0"],
    ["Stack", "React · Next.js · Node.js · Laravel"],
    ["Packages", counts],
    ["Status", systemStats.find((stat) => stat.label === "Network")?.value ?? "Available for work"],
  ]
  return (
    <div className="terminal-neofetch">
      <pre className="terminal-neofetch-logo" aria-hidden="true">{`███╗   ███╗
████╗ ████║
██╔████╔██║
██║╚██╔╝██║
██║ ╚═╝ ██║
╚═╝     ╚═╝`}</pre>
      <div className="terminal-neofetch-info">
        <div className="terminal-neofetch-head">joshua-adegbite@mush-os</div>
        <div className="terminal-neofetch-rule">-----------------------</div>
        {info.map(([key, value]) => (
          <div key={key} className="terminal-neofetch-row">
            <span className="terminal-neofetch-key">{key}</span>: {value}
          </div>
        ))}
        <div className="terminal-neofetch-swatches" aria-hidden="true">
          {ACCENT_PALETTE.map((color) => (
            <span key={color} style={{ background: color }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TerminalSkills() {
  return (
    <div className="terminal-skills">
      {skillGroups.map((group) => (
        <div key={group.title} className="terminal-skill-column">
          <div className="terminal-skill-title">{group.title}/</div>
          {group.skills.slice(0, 6).map((skill, index) => (
            <div key={skill} className="terminal-tree-line">
              {index === group.skills.slice(0, 6).length - 1 ? "└──" : "├──"} {skill}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function SettingsApp({ openApp }: { openApp: (id: AppId, options?: OpenOptions) => void }) {
  return (
    <div className="content-grid">
      <section className="panel-solid p-5">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5" style={{ color: "var(--os-accent)" }} />
          <h3 className="section-title">System Information</h3>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {systemStats.map((stat) => (
            <div key={stat.label} className="rounded-md bg-white/[0.055] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">{stat.label}</p>
              <p className="mt-2 text-sm text-white/78">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="panel-muted p-5">
        <h3 className="section-title">Quick Launch</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {internalApps.filter((id) => id !== "settings").map((id) => {
            const Icon = appIcons[id]
            return (
              <button key={id} className="quick-launch focus-ring" onClick={() => openApp(id)}>
                <Icon className="h-4 w-4" />
                {appNames[id]}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function Spotlight({ onLaunch, onClose }: { onLaunch: (id: AppId) => void; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return desktopApps
    return desktopApps.filter((id) => appNames[id].toLowerCase().includes(normalized) || id.includes(normalized))
  }, [query])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    inputRef.current?.focus()
    if (prefersReducedMotion() || !overlayRef.current || !panelRef.current) return
    const timeline = gsap.timeline()
    timeline
      .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: MOTION.dur.fast, ease: MOTION.ease.out })
      .fromTo(
        panelRef.current,
        { y: -16, scale: 0.97, opacity: 0, filter: "blur(12px)" },
        { y: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: MOTION.dur.base, ease: MOTION.ease.out },
        0,
      )
    return () => {
      timeline.kill()
    }
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => Math.min(results.length - 1, index + 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => Math.max(0, index - 1))
    } else if (event.key === "Enter") {
      event.preventDefault()
      const id = results[activeIndex]
      if (id) onLaunch(id)
    } else if (event.key === "Escape") {
      event.preventDefault()
      event.stopPropagation()
      onClose()
    }
  }

  return (
    <div
      ref={overlayRef}
      className="spotlight-overlay"
      onPointerDown={(event) => {
        if (event.target === overlayRef.current) onClose()
      }}
    >
      <div ref={panelRef} className="spotlight-panel" role="dialog" aria-modal="true" aria-label="Spotlight search">
        <div className="spotlight-field">
          <Search className="h-5 w-5 text-white/55" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            className="spotlight-input"
            placeholder="Search apps and sections…"
            aria-label="Search apps and sections"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <kbd className="spotlight-kbd">esc</kbd>
        </div>
        {results.length ? (
          <ul className="spotlight-results" role="listbox" aria-label="Search results">
            {results.map((id, index) => {
              const Icon = appIcons[id]
              return (
                <li key={id} role="option" aria-selected={index === activeIndex}>
                  <button
                    type="button"
                    className={cn("spotlight-result focus-ring", index === activeIndex && "is-active")}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => onLaunch(id)}
                  >
                    <span className="spotlight-result-icon" style={{ background: appGradients[id] }}>
                      <Icon className="h-4 w-4 text-white" />
                    </span>
                    <span className="spotlight-result-label">{appNames[id]}</span>
                    <span className="spotlight-result-hint">{index === activeIndex ? "↵ open" : ""}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="spotlight-empty">No results for “{query.trim()}”.</div>
        )}
      </div>
    </div>
  )
}

type ContextMenuItem = { label: string; icon: typeof Monitor; onSelect: () => void; keepOpen?: boolean }

function DesktopContextMenu({
  position,
  items,
  onClose,
}: {
  position: { x: number; y: number }
  items: ContextMenuItem[]
  onClose: () => void
}) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    menu.querySelector<HTMLButtonElement>("button")?.focus()
    if (!prefersReducedMotion()) {
      gsap.fromTo(
        menu,
        { opacity: 0, scale: 0.92, y: -6 },
        { opacity: 1, scale: 1, y: 0, duration: MOTION.dur.fast, ease: MOTION.ease.out, transformOrigin: "top left" },
      )
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!menu.contains(event.target as Node)) onClose()
    }
    window.addEventListener("pointerdown", onPointerDown)
    return () => window.removeEventListener("pointerdown", onPointerDown)
  }, [onClose])

  // Keep the menu on-screen near the pointer.
  const left = Math.min(position.x, (typeof window !== "undefined" ? window.innerWidth : 1280) - 232)
  const top = Math.min(position.y, (typeof window !== "undefined" ? window.innerHeight : 800) - items.length * 42 - 24)

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === "ArrowDown") {
      event.preventDefault()
      buttons[(current + 1) % buttons.length]?.focus()
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      buttons[(current - 1 + buttons.length) % buttons.length]?.focus()
    } else if (event.key === "Escape") {
      event.preventDefault()
      event.stopPropagation()
      onClose()
    }
  }

  return (
    <div
      ref={menuRef}
      className="context-menu"
      role="menu"
      aria-label="Desktop actions"
      style={{ left, top }}
      onKeyDown={handleKeyDown}
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            className="context-menu-item focus-ring"
            onClick={() => {
              item.onSelect()
              if (!item.keepOpen) onClose()
            }}
          >
            <Icon className="h-4 w-4 text-white/70" />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

function SeoContent() {
  return (
    <section id="portfolio-content" className="sr-only" aria-label="Complete portfolio content">
      <h1>{profile.name} Portfolio</h1>
      <p>{profile.summary}</p>
      <h2>About</h2>
      {profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <h2>Projects</h2>
      {portfolioProjects.map((project) => (
        <article key={project.name}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <a href={project.web_url}>Live project</a>
          <a href={project.source_code_link}>Source code</a>
        </article>
      ))}
      <h2>Experience</h2>
      {experiences.map((experience) => (
        <article key={`${experience.company}-${experience.title}`}>
          <h3>{experience.title}</h3>
          <p>{experience.company}</p>
          <p>{experience.period}</p>
          <p>{experience.description}</p>
        </article>
      ))}
      <h2>Skills</h2>
      {skillGroups.map((group) => <p key={group.title}>{group.title}: {group.skills.join(", ")}</p>)}
      <h2>Contact</h2>
      <a href={profile.links.email}>{profile.email}</a>
      <a href={profile.links.github}>GitHub</a>
      <a href={profile.links.linkedin}>LinkedIn</a>
      <a href={profile.links.twitter}>X</a>
    </section>
  )
}
