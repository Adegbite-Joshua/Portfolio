import Link from "next/link"
import { AlertCircle, Home } from "lucide-react"

export default function NotFound() {
  return (
    <main className="portfolio-os-shell relative grid min-h-screen place-items-center overflow-hidden bg-[#07090f] px-5 text-white">
      <div className="wallpaper absolute inset-0">
        <div className="wallpaper-mesh" />
        <div className="wallpaper-grid" />
        <div className="wallpaper-sheen" />
      </div>
      <section className="glass-panel relative z-10 w-full max-w-md p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-white text-[#10141d]">
          <AlertCircle className="h-7 w-7" />
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.26em] text-white/48">MushOS Alert</p>
        <h1 className="mt-2 text-4xl font-semibold">404</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">
          This application route is unavailable. Return to the portfolio operating system to continue exploring.
        </p>
        <Link href="/" className="action-button focus-ring mt-6">
          <Home className="h-4 w-4" />
          Return Home
        </Link>
      </section>
    </main>
  )
}
