import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Nav from '../components/landing/Nav.jsx'
import Hero from '../components/landing/Hero.jsx'
import Workflow from '../components/landing/Workflow.jsx'
import About from '../components/landing/About.jsx'
import Contact from '../components/landing/Contact.jsx'

export default function Landing() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      // Small delay to let the DOM render before scrolling
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location])

  return (
    <div>
      <Nav />
      <Hero />
      <Workflow />
      <About />
      <Contact />
    </div>
  )
}
