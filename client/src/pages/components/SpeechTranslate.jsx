import { useState, useEffect } from 'react';
import axios from 'axios';

function SpeechTranslate() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const [isRecording, setIsRecording] = useState(false);
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [targetLanguage, setTargetLanguage] = useState('EN');

    const targetLanguageDictionary = {
        EN: "English",
        DE: "German",
        FR: "French",
        ES: "Spanish",
        IT: "Italian",
        NL: "Dutch",
        RU: "Russian",
        ZH: "Chinese (Simplified & Traditional)",
        AR: "Arabic",
        PT: "Portuguese",
        JA: "Japanese",
        TR: "Turkish"
    };

    const handleTargetLanguageChange = (event) => {
        setTargetLanguage(event.target.value);
    };

    const handleOnRecord = () => {
        if (!isRecording && recognition) {
            recognition.start();
            setIsRecording(true);
        } else if (isRecording && recognition) {
            recognition.stop();
            setIsRecording(false);
        }
    };

    const translateText = async (text, targetLang) => {
        try {
            const response = await axios.post('http://localhost:8080/translate', {
                text: text,
                target_lang: targetLang,
                source_lang: 'EN'
            });
            const translated = response.data.translations[0].text;
            setTranslatedText(translated);
            speakTranslatedText(translated, targetLang);
        } catch (error) {
            console.error('Error translating text:', error);
        }
    };

    const speakTranslatedText = (text, langCode) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();

        let voiceLang = langCode;
        if (langCode === 'ZH') {
            voiceLang = 'zh-CN';
        }

        const targetVoice = voices.find(voice => {
            return voice.lang.includes(voiceLang);
        });

        if (targetVoice) {
            utterance.voice = targetVoice;
        }

        synth.speak(utterance);
    };

    useEffect(() => {
        if (SpeechRecognition) {
            const newRecognition = new SpeechRecognition();
            newRecognition.onstart = () => {
                console.log('Recording started...');
            };

            newRecognition.onend = () => {
                setIsRecording(false);
            };

            newRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setText(transcript);
                translateText(transcript, targetLanguage);
            };

            setRecognition(newRecognition);
        }
    }, [SpeechRecognition, targetLanguage]);

    useEffect(() => {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }, []);

    return (
        <div className='app-container'>
            <div className='middle-container'>
                <select
                    className='speech-select'
                    value={targetLanguage}
                    onChange={handleTargetLanguageChange}
                >
                    {Object.entries(targetLanguageDictionary).map(([code, name]) => (
                        <option key={code} value={code}>
                            {name}
                        </option>
                    ))}
                </select>
                <div className='seperate'></div>
                <button onClick={handleOnRecord}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                <p>Spoken Text: {text}</p>
                <p>Translated Text: {translatedText}</p>
            </div>
        </div>
    );
}

export default SpeechTranslate;
