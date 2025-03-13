"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Send } from "lucide-react"

export function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    try {
      // In a real application, you would send this data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2 group">
          <label htmlFor="name" className="text-sm font-medium group-focus-within:text-primary transition-colors">
            Name
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            value={formData.name}
            onChange={handleChange}
            className="border-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2 group">
          <label htmlFor="email" className="text-sm font-medium group-focus-within:text-primary transition-colors">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your email"
            required
            value={formData.email}
            onChange={handleChange}
            className="border-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>
      <div className="space-y-2 group">
        <label htmlFor="subject" className="text-sm font-medium group-focus-within:text-primary transition-colors">
          Subject
        </label>
        <Input
          id="subject"
          name="subject"
          placeholder="Subject of your message"
          required
          value={formData.subject}
          onChange={handleChange}
          className="border-primary/20 focus:border-primary transition-colors"
        />
      </div>
      <div className="space-y-2 group">
        <label htmlFor="message" className="text-sm font-medium group-focus-within:text-primary transition-colors">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          className="border-primary/20 focus:border-primary transition-colors resize-none"
        />
      </div>
      <Button type="submit" className="w-full relative overflow-hidden group" disabled={isSubmitting}>
        <span className="relative z-10">{isSubmitting ? "Sending..." : "Send Message"}</span>
        <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        {!isSubmitting && (
          <Send className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
        )}
      </Button>
    </form>
  )
}

