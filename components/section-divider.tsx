export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center py-8 ${className}`}>
      <div className="flex-grow border-t border-muted"></div>
      <div className="relative flex h-4 w-4 items-center justify-center">
        <div className="absolute h-2 w-2 rounded-full bg-primary"></div>
        <div className="h-4 w-4 animate-ping rounded-full bg-primary/30"></div>
      </div>
      <div className="flex-grow border-t border-muted"></div>
    </div>
  )
}

