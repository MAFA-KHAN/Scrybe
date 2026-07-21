import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UploadState from '../components/scanner/UploadState.jsx'
import ProcessingState from '../components/scanner/ProcessingState.jsx'
import ReviewState from '../components/scanner/ReviewState.jsx'
import ResultsState from '../components/scanner/ResultsState.jsx'
import ErrorBanner from '../components/scanner/ErrorBanner.jsx'
import Nav from '../components/landing/Nav.jsx'
import Contact from '../components/landing/Contact.jsx'

const API_BASE = '/api'

export default function Scanner() {
  const [phase, setPhase] = useState('upload') // 'upload' | 'processing' | 'review' | 'results'
  const [error, setError] = useState(null)
  const [selectedLang, setSelectedLang] = useState('eng')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [result, setResult] = useState(null)
  const [confirmedFields, setConfirmedFields] = useState(null)
  const [stats, setStats] = useState({ count: 0, avgConfidence: 0 })
  const [auditTrail, setAuditTrail] = useState([])
  const [sampleCerts, setSampleCerts] = useState([])

  // Load audit trail on mount
  useEffect(() => {
    fetchAuditTrail()
    fetchSampleCerts()
  }, [])

  const fetchSampleCerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/sample-certificates`)
      if (res.ok) {
        const data = await res.json()
        setSampleCerts(data)
      }
    } catch (err) {
      console.error('Failed to fetch sample certificates:', err)
    }
  }

  const fetchAuditTrail = async () => {
    try {
      const res = await fetch(`${API_BASE}/audit`)
      if (res.ok) {
        const data = await res.json()
        setAuditTrail(data)
      }
    } catch (err) {
      console.error('Failed to fetch audit trail:', err)
    }
  }

  const handleFileSelected = async (file) => {
    setError(null)
    setFileType(file.type)
    setPreviewUrl(file.type.startsWith('image/') || file.type === 'application/pdf' ? URL.createObjectURL(file) : null)
    setPhase('processing')

    const formData = new FormData()
    formData.append('file', file)

    try {
      // Pass selected language as a query parameter
      const res = await fetch(`${API_BASE}/extract?lang=${selectedLang}`, { 
        method: 'POST', 
        body: formData 
      })
      const contentType = res.headers.get('content-type') || ''
      let data = null

      if (contentType.includes('application/json')) {
        data = await res.json()
        if (!res.ok) throw new Error(data.message || data.error || 'Something went wrong.')
      } else {
        const text = await res.text()
        if (!res.ok) throw new Error(text || 'Something went wrong.')
      }

      setResult(data)
      setPhase('review')
      fetchAuditTrail()
    } catch (err) {
      setError(err.message)
      setPhase('upload')
    }
  }

  const handleLoadSample = async (filename) => {
    try {
      setError(null)
      setPhase('processing')
      const res = await fetch(`${API_BASE}/sample-certificates/${filename}`)
      if (!res.ok) throw new Error('Could not load sample certificate from backend.')
      
      const blob = await res.blob()
      // Determine mime type from extension
      const ext = filename.split('.').pop().toLowerCase()
      const mimeMap = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', pdf: 'application/pdf', tiff: 'image/tiff' }
      const mime = mimeMap[ext] || 'application/octet-stream'
      const file = new File([blob], filename, { type: mime })
      handleFileSelected(file)
    } catch (err) {
      setError(err.message)
      setPhase('upload')
    }
  }

  const handleConfirm = async (fields) => {
    try {
      const res = await fetch(`${API_BASE}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: result.id, fields }),
      })
      if (!res.ok) throw new Error('Could not save your corrections. Try again.')

      setConfirmedFields(fields)
      
      // Calculate session statistics
      const confidences = Object.values(result.confidence || {}).filter((c) => c > 0)
      const avg = confidences.length
        ? Math.round((confidences.reduce((a, b) => a + b, 0) / confidences.length) * 100)
        : 0
      
      setStats((s) => ({
        count: s.count + 1,
        avgConfidence: s.count === 0 ? avg : Math.round((s.avgConfidence + avg) / 2)
      }))
      
      setPhase('results')
      fetchAuditTrail()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleExport = (docId) => {
    window.open(`${API_BASE}/export/${docId}`, '_blank')
  }

  const handleNewScan = () => {
    setResult(null)
    setConfirmedFields(null)
    setPreviewUrl(null)
    setPhase('upload')
  }

  return (
    <div className="min-h-screen bg-white text-navy flex flex-col justify-between pt-20">
      <div>
        <Nav />

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        <main className="flex-grow">
          {phase === 'upload' && (
            <UploadState 
              onFileSelected={handleFileSelected} 
              error={null} 
              selectedLang={selectedLang}
              onLangChange={setSelectedLang}
              onLoadSample={handleLoadSample}
              sampleCerts={sampleCerts}
            />
          )}

          {phase === 'processing' && <ProcessingState />}

          {phase === 'review' && result && (
            <ReviewState 
              result={result} 
              previewUrl={previewUrl} 
              fileType={fileType}
              onConfirm={handleConfirm} 
              onCancel={handleNewScan}
            />
          )}

          {phase === 'results' && confirmedFields && (
            <ResultsState
              docId={result.id}
              fields={confirmedFields}
              stats={stats}
              onExport={handleExport}
              onNewScan={handleNewScan}
            />
          )}
        </main>
      </div>

      {/* Audit Trail Section */}
      {phase !== 'processing' && (
        <div className="max-w-5xl w-full mx-auto px-6 py-16 border-t border-hairline/60 mt-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Session Audit Trail</h3>
              <p className="text-xs text-slate mt-1 font-medium">In-memory session history of processed documents</p>
            </div>
            {auditTrail.length === 0 && (
              <span className="text-xs text-slate italic">
                No document uploaded yet. Upload a certificate to begin intelligent extraction.
              </span>
            )}
          </div>
          
          {auditTrail.length > 0 ? (
            <div className="overflow-x-auto border border-hairline/60 rounded-xl bg-gray-50/20">
              <table className="min-w-full divide-y divide-hairline/60 text-left text-sm">
                <thead className="bg-gray-50 text-slate font-semibold">
                  <tr>
                    <th className="px-6 py-4">File Name</th>
                    <th className="px-6 py-4">OCR Length</th>
                    <th className="px-6 py-4">QR Code</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline/60 text-navy/80 font-medium">
                  {auditTrail.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 truncate max-w-[240px] font-bold">{doc.filename}</td>
                      <td className="px-6 py-4 font-mono text-slate">{doc.raw_text_length} chars</td>
                      <td className="px-6 py-4">
                        {doc.qr_data ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-success/10 text-success border border-success/20">
                            Detected
                          </span>
                        ) : (
                          <span className="text-slate/40">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 uppercase text-xs font-bold tracking-wider text-slate/70">{doc.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 rounded-2xl border border-hairline bg-gray-50/50 text-slate/50 text-sm font-semibold">
              No document uploaded yet. Upload a certificate to begin intelligent extraction.
            </div>
          )}
        </div>
      )}

      <Contact />
    </div>
  )
}


