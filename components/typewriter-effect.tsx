"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TypewriterEffectProps {
  words: {
    text: string
    className?: string
  }[]
  className?: string
  cursorClassName?: string
}

export const TypewriterEffect = ({ words, className, cursorClassName }: TypewriterEffectProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Current word being typed
      const currentWord = words[currentWordIndex].text

      // If deleting
      if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length - 1))
        setTypingSpeed(50) // Faster when deleting
      } else {
        // If typing
        setCurrentText(currentWord.substring(0, currentText.length + 1))
        setTypingSpeed(150) // Normal typing speed
      }

      // If word is complete
      if (!isDeleting && currentText === currentWord) {
        // Pause at the end of typing a word
        setTypingSpeed(2000)
        setIsDeleting(true)
      }
      // If word is deleted
      else if (isDeleting && currentText === "") {
        setIsDeleting(false)
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
        setTypingSpeed(500) // Pause before typing next word
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, currentWordIndex, isDeleting, typingSpeed, words])

  return (
    <div className={cn("flex items-center text-2xl md:text-4xl font-bold", className)}>
      <span className="mr-2 text-primary">{currentText}</span>
      <span className={cn("animate-blink", cursorClassName)}>|</span>
    </div>
  )
}

