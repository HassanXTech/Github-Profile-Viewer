"use client"

import { Github } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="w-full max-w-[1320px] mx-auto px-5 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border pt-8">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Made with ❤️ by</span>
          <a
            href="https://github.com/HassanXTech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition-colors font-medium text-sm"
          >
            HassanXTech
          </a>
        </div>
        <a
          href="https://github.com/HassanXTech"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 rounded-lg transition-colors group"
        >
          <Github className="w-4 h-4 text-teal-400 group-hover:text-teal-300" />
          <span className="text-teal-400 group-hover:text-teal-300 text-sm font-medium">View on GitHub</span>
        </a>
      </div>
    </footer>
  )
}
