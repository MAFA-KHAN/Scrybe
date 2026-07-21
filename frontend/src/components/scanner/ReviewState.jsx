import { useState } from 'react'
import { motion } from 'framer-motion'
import ConfidenceDot from './ConfidenceDot.jsx'

const FIELD_LABELS = {
  candidate_name: 'Recipient Name',
  certificate_title: 'Certificate / Course Title',
  organization_name: 'Issuing Organization',
  issue_date: 'Date of Issuance',
  certificate_number: 'Certificate ID / Serial',
  grade_score: 'Grade / Score Obtained',
  duration: 'Course Duration',
}

export default function ReviewState({ result, previewUrl, fileType, onConfirm, onCancel }) {
  const [fields, setFields] = useState(result.fields || {})
  const [showRawText, setShowRawText] = useState(false)

  const handleUpdate = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="max-w-5xl mx-auto pt-16 px-6 pb-20 bg-white text-navy animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 border-b border-hairline/60 pb-4"
      >
        <div>
          <h2 className="text-2xl font-extrabold text-navy">Review Extracted Data</h2>
          <p className="text-sm text-slate mt-0.5 font-medium">Validate AI extraction output and correct any discrepancies.</p>
        </div>
        <button 
          onClick={onCancel}
          className="text-sm font-bold text-slate hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-550 px-4 py-2 rounded-lg border border-hairline/60"
        >
          ✕ Cancel scan
        </button>
      </motion.div>

      {/* QR Detection Alert Banner */}
      {result.qr_data && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 p-4 rounded-xl border border-success/30 bg-success/5 flex items-start gap-3 shadow-sm"
        >
          <div className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm shadow-success/40">
            ✓
          </div>
          <div>
            <span className="text-sm font-bold text-success">Embedded QR / Barcode Data Detected</span>
            <p className="text-xs text-navy/80 mt-1 font-mono break-all bg-white border border-success/10 p-2 rounded shadow-inner">
              {result.qr_data}
            </p>
          </div>
        </motion.div>
      )}

      {/* Layout Grid */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Side: Preview */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <span className="text-xs font-bold text-slate uppercase tracking-wide">Document Preview</span>
          {previewUrl ? (
            <div className="rounded-2xl border border-hairline/60 bg-gray-50/50 p-4 flex items-center justify-center h-full min-h-[500px] shadow-sm relative overflow-hidden group">
              {fileType === 'application/pdf' ? (
                <object
                  data={previewUrl}
                  type="application/pdf"
                  className="rounded-xl w-full h-[500px]"
                >
                  <p>PDF preview is not supported by your browser.</p>
                </object>
              ) : (
                <img
                  src={previewUrl}
                  alt="Certificate preview"
                  className="rounded-xl object-contain max-h-[500px] w-full shadow-sm transition-transform duration-500 group-hover:scale-[1.02]"
                />
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-hairline/60 bg-gray-50/20 h-64 flex items-center justify-center text-sm text-slate font-medium">
              No preview available (PDF file format)
            </div>
          )}
        </motion.div>

        {/* Right Side: Form */}
        <div className="space-y-5">
          <span className="text-xs font-bold text-slate uppercase tracking-wide">Extracted Fields</span>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3 bg-white p-6 rounded-3xl border border-hairline/60 shadow-xl shadow-navy/5"
          >
            {Object.entries(FIELD_LABELS).map(([key, label]) => {
              const score = result.confidence?.[key] ?? 0.0
              return (
                <motion.div variants={itemVariants} key={key} className="space-y-1.5 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-navy">{label}</label>
                    <div className="flex items-center gap-2">
                      {score > 0 && <span className="text-slate font-semibold bg-gray-100 px-2 py-0.5 rounded-full">{Math.round(score * 100)}%</span>}
                      <ConfidenceDot score={score} />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={fields[key] ?? ''}
                    onChange={(e) => handleUpdate(key, e.target.value)}
                    placeholder="Not detected"
                    className="w-full bg-white border border-hairline hover:border-blue-500/40 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-navy focus:outline-none transition-all shadow-sm"
                  />
                </motion.div>
              )
            })}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => onConfirm(fields)}
            className="w-full bg-navy text-white text-base font-extrabold py-4 rounded-2xl shadow-lg shadow-navy/30 hover:bg-blue-600 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 transition-all duration-300 flex justify-center items-center gap-2 group"
          >
            Confirm Extracted Data
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </motion.button>
        </div>
      </div>

      {/* Raw Text Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 border-t border-hairline/60 pt-6"
      >
        <button
          onClick={() => setShowRawText(!showRawText)}
          className="flex items-center gap-2 text-sm font-bold text-navy hover:text-blue-600 focus:outline-none transition-colors"
        >
          <span className={`transform transition-transform ${showRawText ? 'rotate-90' : ''}`}>►</span>
          <span>View Raw AI Text Output ({result.raw_text?.length || 0} characters)</span>
        </button>
        
        {showRawText && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-5 rounded-2xl border border-hairline/60 bg-gray-50 font-mono text-xs text-navy/80 whitespace-pre-wrap leading-relaxed shadow-inner max-h-[300px] overflow-y-auto"
          >
            {result.raw_text || '(No raw text extracted)'}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
