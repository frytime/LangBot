import { useState, useEffect, useRef } from "react";
import axios from "axios";

function SpeechTranslate() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const [isRecording, setIsRecording] = useState(false);
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [fromLang, setFromLang] = useState("EN");
    const [toLang, setToLang] = useState("FR");

    const recognitionRef = useRef(null);

    const languageDictionary = {
        EN: "English",
        DE: "German",
        FR: "French",
        ES: "Spanish",
        IT: "Italian",
        NL: "Dutch",
        RU: "Russian",
        ZH: "Chinese",
        AR: "Arabic",
        PT: "Portuguese",
        JA: "Japanese",
        TR: "Turkish",
    };

    const speechLocaleMap = {
        EN: "en-US",
        DE: "de-DE",
        FR: "fr-FR",
        ES: "es-ES",
        IT: "it-IT",
        NL: "nl-NL",
        RU: "ru-RU",
        ZH: "zh-CN",
        AR: "ar-SA",
        PT: "pt-PT",
        JA: "ja-JP",
        TR: "tr-TR",
    };

    const handleFromLangChange = (e) => setFromLang(e.target.value);
    const handleToLangChange = (e) => setToLang(e.target.value);

    const handleSwap = () => {
        setFromLang((prevFrom) => {
            setToLang(prevFrom);
            return toLang;
        });
        setText("");
        setTranslatedText("");
    };

    const translateText = async (input, source, target) => {
        try {
            const response = await axios.post("http://localhost:8080/translate", {
                text: input,
                source_lang: source,
                target_lang: target,
            });

            const translated = response.data?.translations?.[0]?.text ?? "";
            setTranslatedText(translated);
            speakTranslatedText(translated, target);
        } catch (error) {
            console.error("Error translating text:", error.response?.data || error.message);
        }
    };

    const speakTranslatedText = (t, langCode) => {
        if (!t) return;

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(t);

        const locale = speechLocaleMap[langCode] || langCode;
        utterance.lang = locale;

        const voices = synth.getVoices();
        const targetVoice =
            voices.find((v) => v.lang === locale) ||
            voices.find((v) => v.lang?.startsWith(locale.split("-")[0]));

        if (targetVoice) utterance.voice = targetVoice;

        synth.cancel();
        synth.speak(utterance);
    };

    const handleOnRecord = () => {
        const rec = recognitionRef.current;
        if (!rec) return;

        if (!isRecording) {
            setText("");
            setTranslatedText("");
            rec.lang = speechLocaleMap[fromLang] || "en-US";
            rec.start();
            setIsRecording(true);
        } else {
            rec.stop();
            setIsRecording(false);
        }
    };

    useEffect(() => {
        if (!SpeechRecognition) {
            console.error("SpeechRecognition not supported in this browser.");
            return;
        }

        const rec = new SpeechRecognition();
        rec.interimResults = false;
        rec.continuous = false;

        rec.onstart = () => { };

        rec.onend = () => {
            setIsRecording(false);
        };

        rec.onerror = (e) => {
            console.error("Speech recognition error:", e.error);
            setIsRecording(false);
        };

        rec.onresult = (event) => {
            const transcript = event.results?.[0]?.[0]?.transcript ?? "";
            setText(transcript);
            if (transcript.trim()) translateText(transcript, fromLang, toLang);
        };

        recognitionRef.current = rec;

        return () => {
            try {
                rec.abort();
            } catch { }
            recognitionRef.current = null;
        };
    }, [SpeechRecognition, fromLang, toLang]);

    useEffect(() => {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }, []);

    return (
        <div className="app-container">
            <div className="middle-container">
                <div style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "center" }}>
                    <select className="speech-select" value={fromLang} onChange={handleFromLangChange}>
                        {Object.entries(languageDictionary).map(([code, name]) => (
                            <option key={code} value={code}>
                                {name}
                            </option>
                        ))}
                    </select>

                    <button type="button" onClick={handleSwap} style={{ padding: "10px 14px" }}>
                        ⇄
                    </button>

                    <select className="speech-select" value={toLang} onChange={handleToLangChange}>
                        {Object.entries(languageDictionary).map(([code, name]) => (
                            <option key={code} value={code}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="seperate"></div>

                <button onClick={handleOnRecord}>
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </button>

                <p>Spoken Text: {text}</p>
                <p>Translated Text: {translatedText}</p>
            </div>
        </div>
    );
}

export default SpeechTranslate;
