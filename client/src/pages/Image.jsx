import { useNavigate } from 'react-router-dom';
import Dropzone from "./components/Dropzone.jsx";
import '../App.css'; // Ensure this includes styles for dropzone if needed
import Footer from './components/Footer.jsx';

function Image() {
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
            <h1 className='image-title'>Image Translation</h1>
            <div className='buttons'>
                <div className='home-button'>
                    <button onClick={() => navigate('/')}>Home</button>
                </div>
                <div className='text-button'>
                    <button onClick={() => navigate('/text')}>Text</button>
                </div>
                <div className='speech-button'>
                    <button onClick={() => navigate('/speech')}>Speech</button>
                </div>
            </div>

            <Dropzone className="drop-image" />
            <Footer />
        </>
    );
}

export default Image;
