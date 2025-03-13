export const quotes = [
  {
    quote: "Code is poetry in motion—where logic meets creativity to transform imagination into digital reality.",
    author: "Anonymous",
  },
  {
    quote:
      "In the symphony of technology, developers are the composers, crafting harmonies of innovation with every line of code.",
    author: "Anonymous",
  },
  {
    quote: "The most powerful tool in the universe is not a supercomputer, but a creative mind armed with code.",
    author: "Anonymous",
  },
  {
    quote:
      "Technology bridges worlds, but code is the architect that designs those bridges between dreams and reality.",
    author: "Anonymous",
  },
  {
    quote: "Every function, every loop, every conditional statement is a brushstroke on the canvas of possibility.",
    author: "Anonymous",
  },
  {
    quote: "The beauty of code lies not just in what it does, but in the infinite potential of what it could do.",
    author: "Anonymous",
  },
  {
    quote: "In a world of constraints, code is the ultimate freedom—limited only by our imagination and persistence.",
    author: "Anonymous",
  },
  {
    quote: "Behind every great digital experience is a developer who dared to think differently and code boldly.",
    author: "Anonymous",
  },
]

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

