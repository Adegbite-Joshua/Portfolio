import Link from "next/link"
import Image from "next/image"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ThemeToggle } from "@/components/theme-toggle"
import { CursorEffect } from "@/components/cursor-effect"
import { FallbackBackground } from "@/components/fallback-background"
import { VantaBackground } from "@/components/vanta-background"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      {/* Changed flex-col-reverse to flex-col and centered all items */}
      <CursorEffect />
      <FallbackBackground />
      <ThemeToggle />

      <ScrollReveal direction="left" className="w-full flex justify-center mb-8 z-10">
        {/* Added w-full and mb-8 for spacing */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/50 shadow-[0_0_25px_rgba(99,102,241,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10"></div>
          <Image
            src="/image.jpeg"
            alt="Joshua Adegbite - Software Engineer"
            fill
            className="object-cover"
            priority
          />
        </div>
      </ScrollReveal>

      <div className="w-full max-w-md mx-auto text-center">
        {/* Added max-width and margin auto for better text alignment */}
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}