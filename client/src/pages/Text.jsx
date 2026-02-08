import { useState, useEffect } from 'react'
import TextTranslate from "./components/TextTranslate.jsx";
import '../App.css'
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Footer from './components/Footer.jsx';

function Text() {
    const navigate = useNavigate();
    const flags = [
        '🇺🇸', '🇬🇧', '🇨🇦', '🇯🇵', '🇧🇷', '🇦🇺', '🇫🇷', '🇮🇹', '🇪🇸', '🇩🇪',
        '🇲🇽', '🇰🇷', '🇨🇳', '🇮🇳', '🇲🇦', '🇷🇺', '🇿🇦', '🇳🇿', '🇳🇱', '🇸🇪',
        '🇳🇴', '🇩🇰', '🇨🇭', '🇨🇴', '🇵🇪', '🇵🇹', '🇦🇷', '🇵🇰', '🇹🇷', '🇲🇲'
    ];
    return (
        <>
            <div className="flag-container">
                {flags.map((flag, index) => (
                    <div key={index} className="flag" style={{ left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 5 + 4}s`, animationDelay: `${Math.random() * 3}s` }}>{flag}</div>
                ))}
            </div>
            <h1>Text Translation</h1>
            <div className='buttons'>
                <div className='home-button'>
                    <button onClick={() => navigate('/')}>Home</button>
                </div>
                <div className='image-button'>
                    <button onClick={() => navigate('/image')}>Image</button>
                </div>
                <div className='speech-button'>
                    <button onClick={() => navigate('/speech')}>Speech</button>
                </div>
            </div>

            <div>
                <TextTranslate />
                <Footer />
            </div>
        </>
    )
}

export default Text;