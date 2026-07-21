const STEPS = [
  {
    number: '1',
    title: 'Upload Document',
    description: 'Upload certificates in PDF, JPG, PNG, or TIFF format. Scrybe validates the file, generates a preview, and prepares it for intelligent processing.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    number: '2',
    title: 'Analyze Content',
    description: 'OCR and computer vision enhance document quality, detect layout structure, and accurately extract textual information from every page.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    number: '3',
    title: 'Review & Export',
    description: 'Review extracted fields, inspect confidence scores, copy structured data, or export results for integration into your workflow.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ),
  },
]

export default function Workflow() {
  return (
    <section id="workflow" className="py-28 px-6 bg-white border-t border-hairline/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold text-navy tracking-tight">Intelligent Document Pipeline</h2>
          <p className="text-sm text-slate mt-2">Every document passes through an optimized processing pipeline that enhances quality, extracts text, identifies structured fields, and prepares results for review.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div 
              key={step.number} 
              className="relative p-8 card-premium hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="absolute top-6 right-8 text-6xl font-black text-navy/5 group-hover:text-navy/10 transition-colors pointer-events-none select-none">
                0{step.number}
              </div>
              <div className="w-12 h-12 rounded-xl bg-navy/5 text-navy flex items-center justify-center mb-6 group-hover:bg-navy group-hover:text-white transition-all duration-300">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-navy mb-3">{step.title}</h3>
              <p className="text-sm text-slate leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

