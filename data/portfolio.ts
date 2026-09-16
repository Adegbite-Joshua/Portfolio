import { projects } from "./projects"

export const profile = {
  name: "Joshua Adegbite",
  title: "Full-stack Software Engineer",
  shortTitle: "Full-stack developer",
  email: "adegbitejoshua07@gmail.com",
  location: "Nigeria",
  resume: "/Joshua Adegbite Resume.pdf",
  avatar: "/image.jpeg",
  summary:
    "I build responsive, scalable web applications with modern technologies and a focus on performance, reliability, and user experience.",
  about: [
    "I'm a passionate full-stack developer with over 5 years of experience building web applications. My journey in software development started with curiosity about how websites work, which led me deep into frontend and backend technologies.",
    "I specialize in creating robust web applications using modern JavaScript frameworks and backend technologies. While I primarily focus on web development, I also understand native app development concepts.",
    "As a freelancer, I've worked with diverse clients across industries, helping them bring ideas to life through practical, polished technology.",
  ],
  descriptors: [
    "Code optimization specialist",
    "UI/UX craftsman",
    "Performance-driven engineer",
    "AI-powered solutions builder",
    "Clean code advocate",
    "Future-focused technologist",
  ],
  links: {
    github: "https://github.com/Adegbite-Joshua",
    linkedin: "https://www.linkedin.com/in/adegbite-joshua-8a45a6257",
    twitter: "https://x.com/JoshuaAdegbite7",
    email: "mailto:adegbitejoshua07@gmail.com",
  },
}

export const skillGroups = [
  {
    title: "Frontend",
    summary: "Interfaces that feel fast, resilient, and carefully composed.",
    skills: ["React", "Next.js", "Angular", "TypeScript", "JavaScript", "Blade", "Tailwind CSS", "Redux", "jQuery", "HTML/CSS"],
  },
  {
    title: "Backend",
    summary: "APIs and services with attention to scale, auth, and data shape.",
    skills: ["Node.js", "Express", "Laravel", "Python", "Flask", "MongoDB", "MySQL", "REST APIs", "Firebase"],
  },
  {
    title: "Systems & Tools",
    summary: "The supporting stack that keeps products useful in production.",
    skills: [
      "Git",
      "PWA",
      "AI & ML Integration",
      "SQL/NoSQL",
      "React Native",
      "Sass",
      "Figma",
      "UX/UI",
      "WebSockets",
      "Socket.io",
      "Stripe",
      "Paystack",
      "OAuth",
      "JWT",
    ],
  },
]

export const experiences = [
  {
    title: "Chief Technology Officer (CTO)",
    company: "Tela",
    period: "May 2025 - Present",
    description:
      "Lead all engineering efforts, overseeing deployment and production lifecycle for web/mobile applications, backend services, and AI model implementations.",
    achievements: [
      "Developed and maintained an admin overview platform to monitor transactions and system activities.",
      "Refactored and optimized backend code, eliminating critical errors and reducing API response time by 25%.",
      "Implemented database indexing and caching, improving query performance and reducing load time by 20%.",
      "Introduced API performance metrics and monitoring for faster debugging and improved reliability.",
    ],
    technologies: [
      "Backend Services",
      "API Optimization",
      "Database Indexing",
      "Caching",
      "Performance Monitoring",
      "Web Applications",
      "Mobile Applications",
      "AI Model Implementations",
    ],
  },
  {
    title: "Freelance Full Stack Developer",
    company: "Self-employed",
    period: "2024 - Present",
    description: "Developed full-stack web applications for clients across different product categories.",
    achievements: [
      "Built real-time communication platforms with WebRTC.",
      "Created interactive learning management systems.",
      "Developed hotel booking platforms with payment integration.",
      "Implemented responsive designs across multiple projects.",
    ],
    technologies: ["Next.js", "React", "Angular", "Node.js", "Laravel", "MongoDB", "MySQL", "Paystack", "Stripe"],
  },
  {
    title: "Frontend Developer",
    company: "Crawdwall Company",
    period: "Dec 2024 - Mar 2025",
    description: "Developed responsive and interactive user interfaces for web applications using modern frontend frameworks.",
    achievements: [
      "Implemented component-based architecture improving code reusability.",
      "Optimized web performance through efficient rendering techniques.",
      "Collaborated with UX designers to build WCAG-compliant interfaces.",
      "Reduced bundle sizes through code splitting and lazy loading.",
    ],
    technologies: ["React", "Tailwind CSS", "TypeScript", "Framer Motion"],
  },
  {
    title: "Backend Developer",
    company: "LIACT",
    period: "June 2024 - August 2024",
    description: "Developed and maintained backend services for web applications.",
    achievements: [
      "Built RESTful APIs with Node.js and Express.",
      "Implemented secure authentication with JWT.",
      "Optimized database queries for improved performance.",
      "Designed role-based access control system.",
    ],
    technologies: ["Node.js", "Express", "MongoDB", "JWT", "REST API"],
  },
  {
    title: "Software Engineering Student",
    company: "Soft Quest Incorporated",
    period: "2024",
    description: "Completed an intensive software engineering training program.",
    achievements: [
      "Mastered full-stack development fundamentals.",
      "Developed multiple projects using modern web technologies.",
      "Gained experience with agile development methodologies.",
    ],
    technologies: ["JavaScript", "HTML/CSS", "Node.js", "React", "MongoDB"],
  },
]

export const portfolioProjects = projects

export const systemStats = [
  { label: "Primary Mode", value: "Full-stack web" },
  { label: "Runtime", value: "Performance + UX" },
  { label: "Network", value: "Available for work" },
  { label: "Resume", value: "PDF ready" },
]
