import React, { useState, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'

export default function Mascot({ state = 'idle', confidence = null, className = '' }) {
  const eyeRef = useRef(null)
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 })
  const controls = useAnimation()

  // Handle Eye Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!eyeRef.current) return
      
      const rect = eyeRef.current.getBoundingClientRect()
      const eyeCenterX = rect.left + rect.width / 2
      const eyeCenterY = rect.top + rect.height / 2
      
      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX)
      
      // Calculate distance to limit how far pupil moves
      const distance = Math.min(
        Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 20, 
        4 // max offset
      )

      setPupilOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Handle Animations based on state
  useEffect(() => {
    if (state === 'idle') {
      controls.start({
        y: [0, -5, 0],
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
      })
    } else if (state === 'waiting') {
      controls.start({
        y: [0, 2, 0],
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      })
    } else if (state === 'processing') {
      // Examining document animation
      controls.start({
        rotate: [-5, 5, -5],
        y: [0, -2, 0],
        transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
      })
    } else if (state === 'success') {
      controls.start({
        y: [-20, 0],
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, ease: 'easeOut' }
      })
    } else if (state === 'fail') {
      controls.start({
        x: [-5, 5, -5, 5, 0],
        transition: { duration: 0.4 }
      })
    }
  }, [state, controls])

  // Determine expression based on confidence
  let expression = '😎' // Default success
  if (confidence !== null) {
    if (confidence >= 90) expression = '😎'
    else if (confidence >= 75) expression = '🙂'
    else if (confidence >= 50) expression = '🤔'
    else expression = '😅'
  }
  
  if (state === 'fail') expression = '😕'
  if (state === 'processing') expression = '🔍'

  return (
    <motion.div 
      className={`relative inline-block ${className}`}
      animate={controls}
    >
      {/* SVG Mascot (Cute Pie) */}
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow */}
        <ellipse cx="60" cy="115" rx="30" ry="5" fill="rgba(11, 37, 69, 0.1)"/>
        
        {/* Body (Suit) */}
        <path d="M40 70 C40 50, 80 50, 80 70 L85 110 C85 115, 75 115, 75 110 L70 90 L50 90 L45 110 C45 115, 35 115, 35 110 Z" fill="#0B2545" stroke="#041224" strokeWidth="4" strokeLinejoin="round"/>
        
        {/* Head */}
        <circle cx="60" cy="50" r="35" fill="white" stroke="#041224" strokeWidth="4"/>
        
        {/* Right Eye (Normal) */}
        <circle cx="75" cy="45" r="8" fill="white" stroke="#041224" strokeWidth="3"/>
        {/* Right Pupil */}
        <circle cx={75 + pupilOffset.x} cy={45 + pupilOffset.y} r="4" fill="#041224"/>
        
        {/* Left Eye Area (Behind Magnifier) */}
        <g ref={eyeRef}>
          {/* Group for tracking */}
        </g>
        
        {/* Magnifying Glass (Always visible) */}
        <g className="magnifier">
          {/* Handle */}
          <path d="M30 85 L45 70" stroke="#0B2545" strokeWidth="8" strokeLinecap="round"/>
          <path d="M28 87 L35 80" stroke="#041224" strokeWidth="8" strokeLinecap="round"/>
          {/* Ring */}
          <circle cx="50" cy="45" r="20" fill="#EBF4FF" fillOpacity="0.8" stroke="#041224" strokeWidth="6"/>
          <circle cx="50" cy="45" r="14" fill="none" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.5"/>
          {/* Big Left Eye (Magnified) */}
          <circle cx={50 + pupilOffset.x * 1.5} cy={45 + pupilOffset.y * 1.5} r="8" fill="#041224"/>
          {/* Eye Highlight */}
          <circle cx={47 + pupilOffset.x * 1.5} cy={42 + pupilOffset.y * 1.5} r="2" fill="white"/>
        </g>

        {/* Hand holding paper (Always visible in other hand) */}
        <g>
          <path d="M70 75 L95 65 L90 95 L65 105 Z" fill="white" stroke="#041224" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M75 80 L85 77 M73 85 L83 82 M71 90 L81 87" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round"/>
          <circle cx="70" cy="85" r="6" fill="white" stroke="#041224" strokeWidth="3"/>
        </g>
        
        {/* Expression Badge (Optional overlay for emojis) */}
        {['success', 'fail', 'results'].includes(state) && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-2 -right-2 text-2xl bg-white rounded-full shadow-sm w-8 h-8 flex items-center justify-center border border-hairline/50"
          >
            {expression}
          </motion.div>
        )}
      </svg>

      {/* Confetti Effect on Success */}
      {state === 'success' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-sm"
              style={{
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][i % 4],
                left: '50%',
                top: '50%'
              }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ 
                x: (Math.random() - 0.5) * 100, 
                y: (Math.random() - 0.5) * 100 - 50,
                opacity: 0,
                rotate: Math.random() * 360
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
