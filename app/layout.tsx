import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://adegbite-joshua.dev"),
  title: {
    default: "Joshua Adegbite | Full-stack Software Engineer",
    template: "%s | Joshua Adegbite",
  },
  description:
    "Explore Joshua Adegbite's interactive portfolio OS: full-stack projects, experience, skills, resume, and contact information.",
  keywords: [
    "Joshua Adegbite",
    "full-stack developer",
    "software engineer",
    "React developer",
    "Next.js developer",
    "Node.js developer",
    "portfolio",
  ],
  authors: [{ name: "Joshua Adegbite" }],
  creator: "Joshua Adegbite",
  openGraph: {
    title: "Joshua Adegbite | Full-stack Software Engineer",
    description:
      "A premium interactive portfolio operating system featuring Joshua Adegbite's projects, experience, skills, and contact details.",
    type: "website",
    images: [{ url: "/image.jpeg", width: 1200, height: 630, alt: "Joshua Adegbite" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joshua Adegbite | Full-stack Software Engineer",
    description: "Explore Joshua Adegbite's interactive portfolio OS.",
    images: ["/image.jpeg"],
  },
  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Toaster position="top-left" />
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  )
}
