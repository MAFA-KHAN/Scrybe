import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FolderOpen, FileText, FileImage, File } from 'lucide-react'
import Mascot from '../Mascot'

const LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'ara', name: 'Arabic' },
  { code: 'urd', name: 'Urdu' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
]

const TYPE_ICONS = {
  pdf: FileText,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  tiff: File,
}

const TYPE_COLORS = {
  pdf: 'bg-red-50 text-red-500 border-red-200',
  png: 'bg-blue-50 text-blue-500 border-blue-200',
  jpg: 'bg-amber-50 text-amber-500 border-amber-200',
  jpeg: 'bg-amber-50 text-amber-500 border-amber-200',
  tiff: 'bg-purple-50 text-purple-500 border-purple-200',
}

export default function UploadState({ onFileSelected, error, selectedLang, onLangChange, onLoadSample, sampleCerts = [] }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFileSelected(file)
  }

  return (
    <div className="max-w-3xl mx-auto pt-16 px-6 animate-slide-up bg-white text-navy">
      
      {/* Mascot Sitting on Folder Area */}
      <div className="flex justify-center mb-6 relative z-10">
        <Mascot state="waiting" className="z-10" />
      </div>

      {/* Drag & Drop Zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        animate={{
          scale: dragging ? 1.02 : 1,
          borderColor: dragging ? 'rgba(59, 130, 246, 0.8)' : 'rgba(11, 37, 69, 0.1)',
          boxShadow: dragging ? '0 0 30px rgba(59, 130, 246, 0.3)' : '0 4px 20px rgba(11, 37, 69, 0.05)',
        }}
        transition={{ duration: 0.2 }}
        className="relative bg-white border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-colors overflow-hidden group border-hairline/60"
      >
        {/* Glow behind when dragging */}
        <AnimatePresence>
          {dragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-50/50"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            animate={{ 
              y: dragging ? -10 : 0,
              scale: dragging ? 1.1 : 1 
            }}
            className="w-16 h-16 rounded-2xl bg-navy/5 text-blue-500 flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-50 transition-colors"
          >
            {dragging ? <FolderOpen size={32} /> : <UploadCloud size={32} />}
          </motion.div>
          
          <h3 className="text-navy font-extrabold text-xl mb-2 tracking-tight">
            Drop your document here
          </h3>
          <p className="text-sm text-slate mb-8 font-medium">or click to browse your local files</p>
          
          <div className="flex justify-center gap-2 flex-wrap">
            {['PDF', 'PNG', 'JPG', 'TIFF'].map(ext => (
              <span key={ext} className="text-[10px] font-bold px-3 py-1 rounded-md bg-gray-100 text-slate uppercase tracking-wider">
                {ext}
              </span>
            ))}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.tiff,.pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFileSelected(e.target.files[0])}
        />
      </motion.div>

      {/* Language Selector */}
      <div className="mt-8 mb-6 flex items-center justify-between p-4 rounded-xl border border-hairline/60 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div>
          <label className="text-sm font-bold text-navy">Document Language</label>
          <p className="text-xs text-slate mt-0.5 font-medium">Select target Tesseract OCR language pack.</p>
        </div>
        <select
          value={selectedLang}
          onChange={(e) => onLangChange(e.target.value)}
          className="text-sm font-bold text-navy bg-gray-50 border border-hairline rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sample Certificates Gallery */}
      {sampleCerts.length > 0 && (
        <div className="mt-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <h4 className="text-sm font-bold text-navy uppercase tracking-wider">Sample Certificates</h4>
            <span className="text-[10px] font-bold text-slate bg-gray-100 px-2 py-0.5 rounded-full">{sampleCerts.length} available</span>
          </div>
          <p className="text-xs text-slate mb-4 font-medium">Pick any sample below to instantly test the AI scanner pipeline.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sampleCerts.map((cert, i) => {
              const IconComponent = TYPE_ICONS[cert.type] || File
              const colorClass = TYPE_COLORS[cert.type] || 'bg-gray-50 text-gray-500 border-gray-200'
              
              return (
                <motion.button
                  key={cert.filename}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => onLoadSample(cert.filename)}
                  className="group relative flex items-center gap-4 p-4 rounded-2xl border border-hairline/60 bg-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-200 text-left"
                >
                  {/* File Type Icon */}
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${colorClass} group-hover:scale-110 transition-transform`}>
                    <IconComponent size={22} />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy truncate group-hover:text-blue-600 transition-colors">
                      {cert.label}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-slate uppercase tracking-wider">
                        {cert.type}
                      </span>
                      <span className="text-[10px] text-slate font-medium truncate">{cert.filename}</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-slate/30 group-hover:text-blue-500 transition-colors shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-500 text-center font-bold text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
