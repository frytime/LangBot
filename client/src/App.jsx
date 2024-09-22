import { useState, useEffect } from 'react'
import Footer from './pages/components/Footer.jsx'
import './App.css'
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Speech from "./pages/Speech.jsx";
import Chat from "./pages/Chat.jsx";
import Image from "./pages/Image.jsx";
import Text from "./pages/Text.jsx";



function App() {
  const [count, setCount] = useState(0)
  const [array, setArray] = useState([]);
  const flags = [
    '🇺🇸', '🇬🇧', '🇨🇦', '🇯🇵', '🇧🇷', '🇦🇺', '🇫🇷', '🇮🇹', '🇪🇸', '🇩🇪',
    '🇲🇽', '🇰🇷', '🇨🇳', '🇮🇳', '🇲🇦', '🇷🇺', '🇿🇦', '🇳🇿', '🇳🇱', '🇸🇪',
    '🇳🇴', '🇩🇰', '🇨🇭', '🇨🇴', '🇵🇪', '🇵🇹', '🇦🇷', '🇵🇰', '🇹🇷', '🇲🇲'
  ];
  const navigate = useNavigate();
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits);
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
  }, []);



  return (
    <>
      <div className="flag-container">
        {flags.map((flag, index) => (
          <div key={index} className="flag" style={{ left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 5 + 4}s`, animationDelay: `${Math.random() * 3}s` }}>{flag}</div>
        ))}
      </div>
      <div className="app">
        <h1>LangBot</h1>
        <div className="buttons">
          <button onClick={() => { navigate('/image') }}>Image</button>
          <button onClick={() => { navigate('/text') }}>Text</button>
          <button onClick={() => { navigate('/speech') }}>Speech</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

function MainApp() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/image" element={<Image />} />
          <Route path="/speech" element={<Speech />} />
          <Route path="/text" element={<Text />} />
        </Routes>

      </Router>
    </div>
  )
}

export default MainApp;
