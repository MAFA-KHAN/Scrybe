import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Mascot from '../Mascot'

const STAGES = [
  'Preparing document...',
  'Enhancing image quality...',
  'Running OCR...',
  'Identifying structured fields...',
  'Finalizing results...'
]

export default function ProcessingState() {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStage(prev => {
        if (prev < STAGES.length - 1) return prev + 1
        return prev
      })
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-3xl mx-auto pt-16 px-6 animate-fade-in flex flex-col items-center bg-white text-navy">
      
      {/* AI Thinking Header */}
      <div className="flex items-center gap-5 mb-10 bg-white border border-hairline/60 p-5 rounded-2xl shadow-sm max-w-lg w-full">
        <Mascot state="processing" />
        <div className="text-left">
          <h2 className="text-xl font-extrabold text-navy flex items-center">
            🧠 AI is understanding document
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="ml-1 text-blue-500"
            >
              ...
            </motion.span>
          </h2>
          <p className="text-xs text-slate mt-1 font-medium">Please hold on while we extract the data</p>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-12 items-center justify-center">
        
        {/* Document Scanner UI */}
        <div className="relative w-64 h-80 bg-white border border-hairline/60 shadow-md rounded-2xl overflow-hidden shrink-0">
          {/* Skeleton Document Lines */}
          <div className="p-6 space-y-4 opacity-30">
            <div className="h-4 bg-slate rounded w-3/4"></div>
            <div className="h-4 bg-slate rounded w-1/2"></div>
            <div className="space-y-2 mt-8">
              <div className="h-2 bg-slate rounded"></div>
              <div className="h-2 bg-slate rounded"></div>
              <div className="h-2 bg-slate rounded w-5/6"></div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate border-dashed flex justify-between">
              <div className="w-12 h-12 rounded-full bg-slate"></div>
              <div className="w-20 h-4 bg-slate rounded mt-4"></div>
            </div>
          </div>

          {/* Scan Beam */}
          <div className="scan-line animate-scan-beam"></div>
          
          {/* Moving Magnifying Glass */}
          <motion.div
            className="absolute z-20 text-3xl opacity-80 pointer-events-none"
            animate={{
              x: [10, 150, 40, 180, 80, 10],
              y: [20, 50, 150, 120, 250, 20],
              scale: [1, 1.2, 1, 1.1, 1.3, 1]
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity
            }}
          >
            🔍
          </motion.div>
        </div>

        {/* Sequential Task List */}
        <div className="space-y-5 flex-1 min-w-[280px]">
          {STAGES.map((text, i) => {
            const isDone = i < stage
            const isActive = i === stage
            const isUpcoming = i > stage

            return (
              <motion.div 
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isUpcoming ? 0.2 : 1, 
                  x: isUpcoming ? -10 : 0,
                  scale: isActive ? 1.02 : 1
                }}
                className={`flex items-center gap-4 transition-colors duration-300 ${
                  isActive ? 'bg-blue-50/50 p-3 border border-blue-100 rounded-xl' : 'p-3 border border-transparent'
                }`}
              >
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-black transition-all duration-300 shadow-sm ${
                    isDone 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : isActive 
                        ? 'bg-white border-blue-500 text-blue-500 shadow-blue-500/10' 
                        : 'bg-white border-hairline/60 text-slate/40'
                  }`}
                >
                  {isDone && '✓'}
                  {isActive && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />}
                </div>
                <span 
                  className={`text-base font-bold transition-colors duration-300 ${
                    isDone 
                      ? 'text-slate/40 line-through' 
                      : isActive 
                        ? 'text-blue-600 font-extrabold' 
                        : 'text-slate/30'
                  }`}
                >
                  {text}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
