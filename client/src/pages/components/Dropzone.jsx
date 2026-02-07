import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";
import { FaClipboard } from "react-icons/fa";

function Dropzone({ className }) {
    const [image, setImage] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("eng");
    const [targetLanguage, setTargetLanguage] = useState("FR");
    const [copyMessage, setCopyMessage] = useState(false);

    const languageDictionary = {
        eng: "English",
        rus: "Russian",
        chi_sim: "Chinese (Simplified)",
        chi_tra: "Chinese (Traditional)",
        spa: "Spanish",
        fra: "French",
        ara: "Arabic",
        por: "Portuguese",
        jpn: "Japanese",
        tr: "Turkish",
        deu: "German",
        ita: "Italian",
        nld: "Dutch",
    };

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
        TR: "Turkish",
    };

    const tesseractToDeepL = {
        eng: "EN",
        deu: "DE",
        fra: "FR",
        spa: "ES",
        ita: "IT",
        nld: "NL",
        rus: "RU",
        chi_sim: "ZH",
        chi_tra: "ZH",
        ara: "AR",
        por: "PT",
        jpn: "JA",
        tr: "TR",
    };

    const deepLToTesseract = {
        EN: "eng",
        DE: "deu",
        FR: "fra",
        ES: "spa",
        IT: "ita",
        NL: "nld",
        RU: "rus",
        ZH: "chi_sim",
        AR: "ara",
        PT: "por",
        JA: "jpn",
        TR: "tr",
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const fileUrl = URL.createObjectURL(file);
            setImage(fileUrl);

            setExtractedText("");
            setTranslatedText("");
            setCopyMessage(false);

            return () => URL.revokeObjectURL(fileUrl);
        }
    }, []);

    const extractText = () => {
        if (!image) return;

        setIsLoading(true);
        Tesseract.recognize(image, selectedLanguage, {
            logger: (m) => console.log(m),
        })
            .then(({ data: { text } }) => {
                setExtractedText(text);
                setIsLoading(false);
                translateText(text, selectedLanguage, targetLanguage);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    };

    const translateText = async (text, fromTessLang, toDeepLLang) => {
        try {
            const sourceLang = tesseractToDeepL[fromTessLang];
            const response = await axios.post("http://localhost:8080/translate", {
                text,
                source_lang: sourceLang,
                target_lang: toDeepLLang,
            });
            setTranslatedText(response.data.translations[0].text);
        } catch (error) {
            console.error("Error translating text:", error);
        }
    };

    const handleSwap = () => {
        const newSelected = deepLToTesseract[targetLanguage] || selectedLanguage;
        const newTarget = tesseractToDeepL[selectedLanguage] || targetLanguage;

        setSelectedLanguage(newSelected);
        setTargetLanguage(newTarget);

        setExtractedText((prev) => {
            setTranslatedText(prev);
            return translatedText;
        });

        setCopyMessage(false);
    };

    const copyToClipboard = () => {
        if (!translatedText) return;

        navigator.clipboard
            .writeText(translatedText)
            .then(() => {
                setCopyMessage(true);
                setTimeout(() => setCopyMessage(false), 2000);
            })
            .catch((err) => console.error("Failed to copy:", err));
    };

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: { "image/*": [] },
        onDrop,
        onDropRejected: (fileRejections) => {
            console.log("File Rejected:", fileRejections);
        },
    });

    const handleLanguageChange = (e) => setSelectedLanguage(e.target.value);
    const handleTargetLanguageChange = (e) => setTargetLanguage(e.target.value);

    return (
        <div className="app-container">
            <div className="left-container">
                <div {...getRootProps({ className: `drop-image ${className}` })}>
                    <input {...getInputProps()} />
                    <p>Drag and drop some files here, or click to select files</p>
                </div>

                {image && (
                    <div className="rendered-image">
                        <img src={image} alt="Uploaded" />
                    </div>
                )}
            </div>

            <div className="middle-container">
                <div className="text-selectors">
                    <select className="from-select" value={selectedLanguage} onChange={handleLanguageChange}>
                        {Object.entries(languageDictionary).map(([code, name]) => (
                            <option key={code} value={code}>
                                {name}
                            </option>
                        ))}
                    </select>

                    <button type="button" className="swap-button" onClick={handleSwap} disabled={isLoading}>
                        ⇄
                    </button>

                    <select className="to-select" value={targetLanguage} onChange={handleTargetLanguageChange}>
                        {Object.entries(targetLanguageDictionary).map(([code, name]) => (
                            <option key={code} value={code}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="extract-button" onClick={extractText} disabled={isLoading}>
                    {isLoading ? "Extracting..." : "Extract & Translate"}
                </button>
            </div>

            <div className="right-container">
                <div className="text-box">
                    <h3>Translated Text:</h3>
                    <div className="translated-text-box">
                        <p>{translatedText || "Translated text will appear here."}</p>
                        {translatedText && (
                            <FaClipboard
                                className={`clipboard-icon ${copyMessage ? "copied" : ""}`}
                                onClick={copyToClipboard}
                                title="Copy to clipboard"
                            />
                        )}
                    </div>
                    {copyMessage && <span className="copy-message">Copied!</span>}
                </div>
            </div>
        </div>
    );
}

export default Dropzone;
