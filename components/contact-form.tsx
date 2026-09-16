"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import emailjs from '@emailjs/browser';
import { toast } from "sonner"


export function ContactForm() {
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
      const templateId = 'template_hq5013g'
      const serviceId = 'service_1kutxo3'
      const publicKey = 'cOM-bZ8-SyZERmUqo'

      const responseTemplateId = 'template_wwp12vd'
      const responseServiceId = 'service_7xmouhq'
      const responsePublicKey = 'cOM-bZ8-SyZERmUqo'



      const templateParams = {
        senderName: formData.name,
        senderEmail: formData.email,
        toName: 'Joshua Adegbite ' + formData.subject,
        message: formData.message
      }

      const responseTemplateParams = {
        senderName: formData.name,
        senderEmail: formData.email,
        toName: 'Joshua Adegbite',
        message: formData.message
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)
      await emailjs.send(responseServiceId, responseTemplateId, responseTemplateParams, responsePublicKey)

      toast.success('Message sent successfully!');
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error('Error sending message!');
      console.error('Error submitting form:', error);
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2 group">
          <label htmlFor="name" className="text-sm font-medium text-white/80 transition-colors group-focus-within:text-white">
            Name
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            value={formData.name}
            onChange={handleChange}
            className="border-white/10 bg-white/[0.07] text-white placeholder:text-white/36 focus:border-white/40"
          />
        </div>
        <div className="space-y-2 group">
          <label htmlFor="email" className="text-sm font-medium text-white/80 transition-colors group-focus-within:text-white">
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
            className="border-white/10 bg-white/[0.07] text-white placeholder:text-white/36 focus:border-white/40"
          />
        </div>
      </div>
      <div className="space-y-2 group">
        <label htmlFor="subject" className="text-sm font-medium text-white/80 transition-colors group-focus-within:text-white">
          Subject
        </label>
        <Input
          id="subject"
          name="subject"
          placeholder="Subject of your message"
          required
          value={formData.subject}
          onChange={handleChange}
          className="border-white/10 bg-white/[0.07] text-white placeholder:text-white/36 focus:border-white/40"
        />
      </div>
      <div className="space-y-2 group">
        <label htmlFor="message" className="text-sm font-medium text-white/80 transition-colors group-focus-within:text-white">
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
          className="resize-none border-white/10 bg-white/[0.07] text-white placeholder:text-white/36 focus:border-white/40"
        />
      </div>
      <Button type="submit" className="relative w-full overflow-hidden rounded-md bg-white text-[#10141d] hover:bg-white/90" disabled={isSubmitting}>
        <span className="relative z-10">{isSubmitting ? "Sending..." : "Send Message"}</span>
        {!isSubmitting && (
          <Send className="relative z-10 ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        )}
      </Button>
    </form>
  )
}
