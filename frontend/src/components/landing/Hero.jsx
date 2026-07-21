import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-44 pb-28 px-6 bg-dot-pattern bg-white">
      {/* Background radial gradient accent (glow) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-navy/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center animate-fade-in relative z-10">
        {/* Animated Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy/5 border border-navy/10 text-navy font-semibold text-xs mb-8 hover:bg-navy/10 transition-colors cursor-default"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          AI-Powered Certificate Processing
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold tracking-tight text-navy leading-tight md:leading-none"
        >
          Certificates, decoded.
        </motion.h1>

        {/* Hero Description */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-slate max-w-2xl mx-auto font-normal leading-relaxed text-slate"
        >
          Extract structured information from certificates and official documents in seconds. Scrybe combines OCR, computer vision, and intelligent field recognition to transform static files into clean, searchable data.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/scanner"
            className="w-full sm:w-auto bg-navy text-white text-base font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-navy/20 hover:bg-navy/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Start Extracting →
          </Link>
          <a
            href="https://github.com/MAFA-KHAN/Scrybe"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto border border-hairline hover:border-navy/30 text-navy font-semibold px-8 py-3.5 rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            View Source
          </a>
        </motion.div>

        {/* Stats Strip */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left"
        >
          <div className="p-6 card-premium bg-gradient-to-b from-navy/5 to-transparent">
            <p className="text-3xl font-bold text-navy">&lt; 30 sec</p>
            <p className="text-xs text-slate mt-2 uppercase tracking-wider font-semibold">Average Processing Time</p>
          </div>
          <div className="p-6 card-premium bg-gradient-to-b from-navy/5 to-transparent">
            <p className="text-3xl font-bold text-navy">95%+</p>
            <p className="text-xs text-slate mt-2 uppercase tracking-wider font-semibold">Extraction Accuracy</p>
          </div>
          <div className="p-6 card-premium bg-gradient-to-b from-navy/5 to-transparent">
            <p className="text-3xl font-bold text-navy">7+</p>
            <p className="text-xs text-slate mt-2 uppercase tracking-wider font-semibold">Structured Data Fields</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

