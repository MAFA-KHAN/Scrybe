export default function About() {
  return (
    <section id="about" className="py-28 px-6 bg-white border-t border-hairline/60">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-navy tracking-tight mb-6">Built for Modern Document Intelligence</h2>
          <p className="text-slate leading-relaxed mb-5 font-normal">
            Scrybe is a document intelligence platform designed to automate the extraction of structured information from certificates and other official documents. By combining OCR with computer vision, it transforms static files into searchable, machine-readable data.
          </p>
          <p className="text-slate leading-relaxed mb-6 font-normal">
            Whether processing academic credentials, professional certifications, or training records, Scrybe minimizes manual data entry while improving accuracy, consistency, and processing speed through an intelligent extraction pipeline.
          </p>
          <div className="flex flex-wrap gap-2">
            {['FastAPI', 'React', 'OpenCV', 'Tesseract OCR', 'Tailwind CSS'].map((tech) => (
              <span key={tech} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy/5 text-navy border border-navy/10 hover:bg-navy/10 hover:text-navy transition-all cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="p-8 card-premium bg-gradient-to-b from-navy/5 to-transparent space-y-6">
          <h3 className="font-semibold text-navy">Processing Engine</h3>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-hairline/60">
              <span className="text-slate font-medium">OCR Engine</span>
              <span className="text-navy font-semibold">Tesseract OCR 5.x</span>
            </div>
            <div className="flex justify-between py-2 border-b border-hairline/60">
              <span className="text-slate font-medium">Image Processing</span>
              <span className="text-navy font-semibold">OpenCV Computer Vision</span>
            </div>
            <div className="flex justify-between py-2 border-b border-hairline/60">
              <span className="text-slate font-medium">Supported Formats</span>
              <span className="text-navy font-semibold">PDF • PNG • JPG • TIFF</span>
            </div>
            <div className="flex justify-between py-2 border-b border-hairline/60">
              <span className="text-slate font-medium">Field Detection</span>
              <span className="text-navy font-semibold">Rule-Based Structured Extraction</span>
            </div>
            <div className="flex justify-between py-2 border-b border-hairline/60">
              <span className="text-slate font-medium">Confidence Scores</span>
              <span className="text-navy font-semibold">Per-Field Confidence Analysis</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate font-medium">Export Formats</span>
              <span className="text-navy font-semibold">JSON • Excel • Clipboard</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

