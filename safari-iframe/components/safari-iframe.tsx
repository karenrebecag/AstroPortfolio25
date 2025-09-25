"use client"

import type React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight, RotateCcw, Share, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface SafariIframeProps {
  src: string
  title?: string
  className?: string
  width?: string | number
  height?: string | number
  showControls?: boolean
}

export function SafariIframe({
  src,
  title = "Safari",
  className,
  width = "100%",
  height = 600,
  showControls = true,
}: SafariIframeProps) {
  const [currentUrl, setCurrentUrl] = useState(src)
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleUrlChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement
      setCurrentUrl(target.value)
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 1000)
    }
  }

  return (
    <div
      className={cn("bg-safari-window border border-safari-border rounded-xl shadow-2xl overflow-hidden", className)}
      style={{ width, height }}
    >
      {/* Window Controls */}
      <div className="flex items-center justify-between bg-safari-toolbar px-4 py-3 border-b border-safari-border">
        <div className="flex items-center gap-2">
          {/* Traffic Light Buttons */}
          <div className="flex items-center gap-2">
            <button className="w-3 h-3 bg-safari-button-red rounded-full hover:brightness-110 transition-all" />
            <button className="w-3 h-3 bg-safari-button-yellow rounded-full hover:brightness-110 transition-all" />
            <button className="w-3 h-3 bg-safari-button-green rounded-full hover:brightness-110 transition-all" />
          </div>
        </div>

        {showControls && (
          <>
            {/* Navigation Controls */}
            <div className="flex items-center gap-1 ml-4">
              <button className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
                <ChevronLeft className="w-4 h-4 text-safari-text-muted" />
              </button>
              <button className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
                <ChevronRight className="w-4 h-4 text-safari-text-muted" />
              </button>
              <button
                onClick={handleRefresh}
                className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors ml-1"
              >
                <RotateCcw
                  className={cn("w-4 h-4 text-safari-text-muted transition-transform", isLoading && "animate-spin")}
                />
              </button>
            </div>

            {/* Address Bar */}
            <div className="flex-1 mx-4">
              <div className="relative">
                <input
                  type="text"
                  defaultValue={src}
                  onKeyDown={handleUrlChange}
                  className="w-full px-4 py-1.5 bg-safari-address-bar border border-safari-border rounded-lg text-sm text-safari-text placeholder:text-safari-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="Search or enter website name"
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 border-2 border-safari-text-muted border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <button className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
                <Share className="w-4 h-4 text-safari-text-muted" />
              </button>
              <button className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
                <Plus className="w-4 h-4 text-safari-text-muted" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Content Area */}
      <div className="relative w-full h-full bg-white">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10">
            <div className="flex items-center gap-3 text-safari-text-muted">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}
        <iframe
          src={currentUrl}
          title={title}
          className="w-full h-full border-0"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        />
      </div>
    </div>
  )
}
