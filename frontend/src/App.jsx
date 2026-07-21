import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Scanner from './pages/Scanner.jsx'
import BackgroundElements from './components/BackgroundElements.jsx'

export default function App() {
  return (
    <>
      <BackgroundElements />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/scanner" element={<Scanner />} />
      </Routes>
    </>
  )
}
