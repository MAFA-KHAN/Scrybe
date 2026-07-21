import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, sectionId) => {
    e.preventDefault()
    if (isHome) {
      // Already on landing page – smooth-scroll to section
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      // On another page – navigate home with hash
      navigate('/#' + sectionId)
    }
  }

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-hairline/80 shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-white font-bold text-sm shadow-md shadow-navy/20 group-hover:scale-105 transition-transform duration-200">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-navy">Scrybe</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate">
          <a href="#workflow" onClick={(e) => handleNavClick(e, 'workflow')} className="hover:text-navy hover:scale-102 transition-all duration-200 cursor-pointer">Workflow</a>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-navy hover:scale-102 transition-all duration-200 cursor-pointer">About</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-navy hover:scale-102 transition-all duration-200 cursor-pointer">Contact</a>
        </nav>

        <Link
          to="/scanner"
          className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-navy/15 hover:bg-navy/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          Launch scanner
        </Link>
      </div>
    </header>
  )
}
