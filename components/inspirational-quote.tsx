import { cn } from "@/lib/utils"

interface InspirationalQuoteProps {
  quote: string
  author?: string
  className?: string
}

export function InspirationalQuote({ quote, author, className }: InspirationalQuoteProps) {
  return (
    <div className={cn("relative my-12 px-6 py-8", className)}>
      <div className="absolute top-0 left-0 text-6xl text-primary opacity-20">"</div>
      <blockquote className="relative z-10 text-xl md:text-2xl font-light italic text-center max-w-3xl mx-auto leading-relaxed">
        {quote}
      </blockquote>
      {author && <div className="mt-4 text-center text-sm text-muted-foreground">— {author}</div>}
      <div className="absolute bottom-0 right-0 text-6xl text-primary opacity-20">"</div>
    </div>
  )
}

