import React from 'react'
import ReactDOM from 'react-dom/client'
import Chatbot from './components/Chatbot'
import News_click from './components/News_click'
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import './index.css'
import './Nav.css'
import Home from '../src/components/Home'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <nav className="nav">
          <Link to="/" className="link">Home</Link>
          <span className="separator">|</span>
          <Link to="/chatBot" className="link">ChatBot</Link>
          <span className="separator">|</span>
          <Link to="/newsClick" className="link">News_click</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatBot" element={<Chatbot />} />
          <Route path="/newsClick" element={<News_click/>} />
        </Routes>
    
    
  </Router>
)