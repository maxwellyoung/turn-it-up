"use client"

import type React from "react"
import { useState, useEffect } from "react"

const CommandLine: React.FC = () => {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string[]>([])

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(input)
      setInput("")
    }
  }

  const processCommand = (cmd: string) => {
    setOutput((prev) => [...prev, `> ${cmd}`])

    switch (cmd.toLowerCase()) {
      case "help":
        setOutput((prev) => [...prev, "Available commands: help, about, clear"])
        break
      case "about":
        setOutput((prev) => [...prev, "TURN IT UP - A sonic exploration by Maxwell Young and Thom Haha"])
        break
      case "clear":
        setOutput([])
        break
      default:
        setOutput((prev) => [...prev, 'Unknown command. Type "help" for available commands.'])
    }
  }

  useEffect(() => {
    setOutput(['Welcome to the TURN IT UP terminal. Type "help" for available commands.'])
  }, [])

  return (
    <div className="max-w-2xl mx-auto my-12 bg-black border border-green-500 rounded-lg p-4 font-mono text-sm">
      <div className="mb-4">
        {output.map((line, index) => (
          <div key={index} className="text-green-500">
            {line}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <span className="text-green-500 mr-2">{">"}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInput}
          className="flex-1 bg-transparent text-green-500 outline-none"
          autoFocus
        />
      </div>
    </div>
  )
}

export default CommandLine

