import { useState } from "react";
import axios from "axios";
import { FaClipboard } from "react-icons/fa";

function TextTranslate() {
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [fromLang, setFromLang] = useState("EN");
    const [toLang, setToLang] = useState("ES");
    const [isLoading, setIsLoading] = useState(false);
    const [copyMessage, setCopyMessage] = useState(false);

    const handleSwap = () => {
        setFromLang((prevFrom) => {
            setToLang(prevFrom);
            return toLang;
        });

        setInputText((prev) => {
            setTranslatedText(prev);
            return translatedText;
        });

        setCopyMessage(false);
    };

    const handleTranslation = async () => {
        if (!inputText.trim()) return;

        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/translate", {
                text: inputText,
                source_lang: fromLang,
                target_lang: toLang,
            });
            setTranslatedText(response.data.translations[0].text);
        } catch (error) {
            console.error("Error translating:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (translatedText) {
            navigator.clipboard
                .writeText(translatedText)
                .then(() => {
                    setCopyMessage(true);
                    setTimeout(() => setCopyMessage(false), 2000);
                })
                .catch((err) => {
                    console.error("Failed to copy:", err);
                });
        }
    };

    return (
        <div className="app-container">
            <div className="left-container">
                <div className="input-box">
                    <textarea
                        type="text"
                        className="input-text"
                        placeholder="Input text to translate"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>
            </div>

            <div className="middle-container">
                <div className="text-selectors">
                    <select
                        className="from-select-text"
                        value={fromLang}
                        onChange={(e) => setFromLang(e.target.value)}
                    >
                        <option value="EN">English</option>
                        <option value="DE">German</option>
                        <option value="FR">French</option>
                        <option value="ES">Spanish</option>
                        <option value="IT">Italian</option>
                        <option value="NL">Dutch</option>
                        <option value="RU">Russian</option>
                        <option value="ZH">Chinese (Simplified/Traditional)</option>
                        <option value="AR">Arabic</option>
                        <option value="PT">Portuguese</option>
                        <option value="JA">Japanese</option>
                        <option value="TR">Turkish</option>
                    </select>

                    <button
                        type="button"
                        className="swap-button"
                        onClick={handleSwap}
                        title="Swap languages"
                        disabled={isLoading}
                        style={{ margin: "12px" }}
                    >
                        ⇄
                    </button>

                    <select
                        className="to-select-text"
                        value={toLang}
                        onChange={(e) => setToLang(e.target.value)}
                    >
                        <option value="EN">English</option>
                        <option value="DE">German</option>
                        <option value="FR">French</option>
                        <option value="ES">Spanish</option>
                        <option value="IT">Italian</option>
                        <option value="NL">Dutch</option>
                        <option value="RU">Russian</option>
                        <option value="ZH">Chinese (Simplified/Traditional)</option>
                        <option value="AR">Arabic</option>
                        <option value="PT">Portuguese</option>
                        <option value="JA">Japanese</option>
                        <option value="TR">Turkish</option>
                    </select>
                </div>

                <button className="extract-button-text" onClick={handleTranslation} disabled={isLoading}>
                    {isLoading ? "Translating..." : "Extract & Translate"}
                </button>
            </div>

            <div className="right-container">
                <div className="text-box-translate">
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

export default TextTranslate;
