export default function Contact() {
  return (
    <footer id="contact" className="bg-[#0B2545] text-white py-20 px-6 border-t border-[#E4E2DA]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Contact details */}
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Get in Touch</h2>
          <p className="text-white/80 text-sm leading-relaxed max-w-md">
            Questions, feedback, or collaboration opportunities? Feel free to reach out or explore the project's source code. Contributions and feature suggestions are always welcome.
          </p>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-white/60">Email:</span>
              <a href="mailto:mahamfatimakhan19@gmail.com" className="text-blue-300 hover:text-blue-200 font-bold transition-colors">
                mahamfatimakhan19@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/60">GitHub:</span>
              <a 
                href="https://github.com/MAFA-KHAN/Scrybe" 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-300 hover:text-blue-200 font-bold transition-colors"
              >
                github.com/MAFA-KHAN/Scrybe
              </a>
            </div>
          </div>
          
          <p className="text-xs text-white/50 max-w-sm">
            Interested in contributing? Open an issue or submit a pull request through the GitHub repository.
          </p>
        </div>

        {/* Right Side: Footer Branding */}
        <div className="md:text-right space-y-4 md:self-end">
          <h3 className="text-2xl font-black text-white tracking-tight">Scrybe</h3>
          <p className="text-xs text-white/60 max-w-xs md:ml-auto leading-relaxed">
            Intelligent document processing powered by OCR and computer vision.
          </p>
          <p className="text-sm font-extrabold text-white/90">
            Powered by MAFA
          </p>
          <p className="text-xs text-white/40 pt-6 border-t border-white/10">
            © 2026 Scrybe. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
