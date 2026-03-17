import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Reader from './pages/Reader'
import Saved from './pages/Saved'
import './App.css'

function App() {
  return (
    <BrowserRouter basename="/rashtriya-e-pustakalaya">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="reader" element={<Reader />} />
          <Route path="saved" element={<Saved />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
