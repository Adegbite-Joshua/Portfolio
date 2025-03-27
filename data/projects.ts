export interface ProjectProps {
  name: string
  description: string
  tags: {
    name: string
    color: string
  }[]
  source_code_link: string
  web_url: string
  imageUrl: string
}

export const projects: ProjectProps[] = [
  {
    name: "Buzz Chat - Real-Time Communication Platform",
    description:
      "A feature-rich messaging platform enabling real-time text chat, voice calls, and video conferencing with WebRTC technology. Supports instant messaging with Socket.IO for seamless communication, group chats, and peer-to-peer connections.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "tailwindcss",
        color: "green-text-gradient",
      },
      {
        name: "mongodb",
        color: "pink-text-gradient",
      },
      {
        name: "socket.io",
        color: "pink-text-gradient",
      },
      {
        name: "webrtc",
        color: "pink-text-gradient",
      },
    ],
    source_code_link: "https://github.com/Adegbite-Joshua/BuzzChat",
    web_url: "https://buzzchat-mo7j.onrender.com",
    imageUrl: "/buzzchat.jpeg",
  },
  {
    name: "Milki - Hotel Management System",
    description:
      "A comprehensive hotel booking platform that allows users to browse, book, and pay for rooms online. Features include room management, booking system, payment processing, and an admin dashboard for managing rooms, bookings, and hotel operations.",
    tags: [
      {
        name: "angular",
        color: "blue-text-gradient",
      },
      {
        name: "laravel",
        color: "green-text-gradient",
      },
      {
        name: "mysql",
        color: "pink-text-gradient",
      },
      {
        name: "paystack",
        color: "purple-text-gradient",
      },
      
    ],
    source_code_link: "https://github.com/Adegbite-Joshua/Angular-Project",
    web_url: "https://milki.vercel.app/",
    imageUrl: "/milki.jpeg",
  },
  {
    name: "Hope Academy - Comprehensive School Management Platform",
    description:
      "A digital platform connecting students, staff, and administrators with features for CBT exams, video classrooms, report sheets, fee/salary payments (via Paystack), CV assessment, and real-time chat/video calls. Streamlines school operations and enhances learning through integrated tools.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "mongodb",
        color: "pink-text-gradient",
      },
      {
        name: "paystack",
        color: "pink-text-gradient",
      },
      {
        name: "socket.io",
        color: "pink-text-gradient",
      },
      {
        name: "webrtc",
        color: "pink-text-gradient",
      },
      {
        name: "tailwindcss",
        color: "pink-text-gradient",
      },
    ],
    source_code_link: "https://github.com/Adegbite-Joshua/HopeAcademy",
    web_url: "https://hopeacademy.vercel.app/",
    imageUrl: "/hopeacademy.png",
  },
  {
    name: "Swift Chat - A Chatting Application",
    description: "A real-time chatting application that allows users to communicate seamlessly.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "firebase",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    source_code_link: "https://github.com/Adegbite-Joshua/Swift-Chat",
    web_url: "https://personal-chat-app-ac897.web.app/",
    imageUrl: "/swiftchat.png",
  },
  {
    name: "Finova Bank - A Fintech Web Application",
    description:
      "A fintech web application that provides banking services with a focus on user experience and security.",
    tags: [
      {
        name: "html",
        color: "blue-text-gradient",
      },
      {
        name: "bootstrap",
        color: "green-text-gradient",
      },
      {
        name: "javascript",
        color: "pink-text-gradient",
      },
    ],
    source_code_link: "https://github.com/Adegbite-Joshua/FinovaBank",
    web_url: "https://finovabank.vercel.app/",
    imageUrl: "/finovabank.png",
  },
]

