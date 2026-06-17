import { StrictMode, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.tsx'

gsap.registerPlugin(ScrollTrigger)

// Lando Norris inspired browser console Easter egg signature for Nandi Vardhan
console.log(`%c
██████╗ ██╗  ██████╗  ██████╗ ██╗ ██████╗  ██╗ 
██╔══██╗██║ ██╔══██╗ ██╔══██╗██║ ██╔══██╗ ██║ 
██║  ██║██║ ███████║ ██║  ██║██║ ██║  ██║ ██║ 
██║  ██║██║ ██╔══██║ ██║  ██║██║ ██║  ██║ ██║ 
██║  ╚████║ ██║  ██║ ██║  ╚████║ ██████╔╝ ██║ 
╚═╝   ╚═══╝ ╚═╝  ╚═╝ ╚═╝   ╚═══╝ ╚═════╝  ╚═╝ 
%c
██╗   ██╗  ██████╗  ██████╗  ██████╗  ██╗  ██╗  ██████╗  ██████╗ ██╗ 
██║   ██║ ██╔══██╗ ██╔══██╗ ██╔══██╗ ██║  ██║ ██╔══██╗ ██╔══██╗██║ 
██║   ██║ ███████║ ██████╔╝ ██║  ██║ ███████║ ███████║ ██║  ██║██║ 
╚██╗ ██╔╝ ██╔══██║ ██╔══██╗ ██║  ██║ ██╔══██║ ██╔══██║ ██║  ██║██║ 
 ╚████╔╝  ██║  ██║ ██║  ██║ ██████╔╝ ██║  ██║ ██║  ██║ ██║  ╚████║ 
  ╚═══╝   ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝   ╚═══╝ 

%c%c`,"color: #d2ff00; font: 400 1em monospace;","","background-color: #d2ff00; color: black; font: 400 1em monospace; padding: 0.5em 0; font-weight: bold;","")

/**
 * SmoothScrollProvider
 * Initializes Lenis for buttery-smooth momentum scrolling and syncs it
 * with GSAP's ticker so every ScrollTrigger / scrub animation stays in
 * lock-step with the smoothed scroll position.
 */
function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(100)
    }

    const lenis = new Lenis({
      lerp: 0.08,           // Lando-style buttery smooth
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 1.5,  // Slightly faster on trackpad
    })
    lenisRef.current = lenis

    // Sync Lenis scroll position → GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from GSAP's RAF so they share the same frame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // Prevent GSAP from running its own lag-smoothing on top of Lenis
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(lenis.raf as any)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </StrictMode>,
)
