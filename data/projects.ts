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
      name: "Hope Academy - School Management System",
      description:
        "A comprehensive school management system that facilitates interactions between students, teachers, and administrators.",
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
    // Add more projects as needed
  ]
  
  