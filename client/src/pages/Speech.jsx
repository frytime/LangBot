import { useState, useEffect } from 'react'
import Footer from './components/Footer.jsx';
import SpeechTranslate from './components/SpeechTranslate.jsx';
import '../App.css';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


function Audio() {
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
            <h1>Speech Translation</h1>

            <div className='buttons'>
                <div className='home-button'>
                    <button onClick={() => navigate('/')}>Home</button>
                </div>
                <div className='text-button'>
                    <button onClick={() => navigate('/text')}>Text</button>
                </div>
                <div className='speech-button'>
                    <button onClick={() => navigate('/image')}>Image</button>
                </div>
            </div>
            <div>
                <SpeechTranslate />
            </div>

            <Footer />
        </>
    )
}

export default Audio;