import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import Mascot from '../Mascot'

const FIELD_LABELS = {
  candidate_name: 'Recipient Name',
  certificate_title: 'Certificate / Course Title',
  organization_name: 'Issuing Organization',
  issue_date: 'Date of Issuance',
  certificate_number: 'Certificate ID / Serial',
  grade_score: 'Grade / Score Obtained',
  duration: 'Course Duration',
}

export default function ResultsState({ docId, fields, stats, onExport, onNewScan }) {
  const [copied, setCopied] = useState(false)
  const [showCheck, setShowCheck] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowCheck(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const summaryText = Object.entries(FIELD_LABELS)
    .filter(([key]) => fields[key])
    .map(([key, label]) => `${label}: ${fields[key]}`)
    .join('\n')

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="max-w-2xl mx-auto pt-16 px-6 pb-20 bg-white text-navy">
      <div className="text-center mb-10 relative">
        
        {/* Expanding Checkmark Animation */}
        {showCheck && (
          <motion.div 
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1.5, 2], opacity: [1, 1, 0] }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-1/2 top-0 -translate-x-1/2 w-32 h-32 rounded-full bg-blue-500/20 border border-blue-500 pointer-events-none z-0"
          />
        )}

        <div className="flex justify-center mb-6 relative z-10">
          <Mascot state="success" />
        </div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold text-navy tracking-tight mt-2"
        >
          Extraction completed successfully.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-slate mt-2 font-medium"
        >
          Your document data has been parsed and structured successfully.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border border-hairline/60 rounded-3xl bg-white p-8 shadow-xl shadow-navy/5 mb-6"
      >
        <h3 className="text-xs font-bold text-slate uppercase tracking-wider mb-6 pb-2 border-b border-hairline/60">Parsed Parameters</h3>
        <dl className="divide-y divide-hairline/40 text-sm">
          {Object.entries(FIELD_LABELS).map(([key, label], i) => (
            <motion.div 
              key={key} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex justify-between py-4 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-lg"
            >
              <dt className="text-slate font-bold">{label}</dt>
              <dd className="text-navy font-extrabold text-right">{fields[key] || <span className="text-slate/30 italic font-normal">Not available</span>}</dd>
            </motion.div>
          ))}
        </dl>
      </motion.div>

      {/* Stats strip */}
      {stats && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-2 gap-4 border border-hairline/60 rounded-2xl bg-gradient-to-br from-gray-50 to-white p-6 mb-8 text-center shadow-inner"
        >
          <div>
            <p className="text-3xl font-black text-navy">
              <CountUp end={stats.count} duration={2.5} />
            </p>
            <p className="text-[10px] text-slate font-bold uppercase tracking-widest mt-1">Processed this session</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-black text-blue-600">
                <CountUp end={stats.avgConfidence} duration={2.5} />%
              </p>
              {stats.avgConfidence >= 90 ? <span className="text-2xl">😎</span> : 
               stats.avgConfidence >= 75 ? <span className="text-2xl">🙂</span> : 
               stats.avgConfidence >= 50 ? <span className="text-2xl">🤔</span> : <span className="text-2xl">😅</span>}
            </div>
            <p className="text-[10px] text-slate font-bold uppercase tracking-widest mt-1">Average Confidence</p>
          </div>
        </motion.div>
      )}

      {/* Button Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={copyToClipboard}
          className={`flex-1 border-2 font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
            copied 
              ? 'bg-green-55/10 border-green-500 text-green-600 scale-105 shadow-md shadow-green-500/20' 
              : 'border-hairline hover:border-navy/35 text-navy hover:-translate-y-1 hover:shadow-lg bg-white'
          }`}
        >
          {copied ? (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓ Copied Summary</motion.span>
          ) : (
            'Copy Summary'
          )}
        </button>
        <button
          onClick={() => onExport(docId)}
          className="flex-1 border-2 border-hairline hover:border-navy/35 text-navy font-bold py-4 rounded-2xl hover:-translate-y-1 hover:shadow-lg bg-white transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to Excel
        </button>
        <button
          onClick={onNewScan}
          className="flex-1 bg-navy text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-navy/30 hover:bg-blue-600 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
        >
          Scan New File
        </button>
      </motion.div>
    </div>
  )
}
