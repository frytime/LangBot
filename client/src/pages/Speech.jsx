import { useState, useEffect } from 'react'
import Footer from './components/Footer.jsx';
import SpeechTranslate from './components/SpeechTranslate.jsx';
import '../App.css';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


function Audio() {
    const navigate = useNavigate();
    return (
        <>
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