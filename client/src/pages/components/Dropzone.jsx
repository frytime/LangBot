import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { FaClipboard } from 'react-icons/fa';  // Import clipboard icon

function Dropzone({ className }) {
    const [image, setImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('eng');
    const [targetLanguage, setTargetLanguage] = useState('EN');
    const [copyMessage, setCopyMessage] = useState(false);  // Boolean for showing the copy icon feedback

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
        tr: "Turkish"
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
        TR: "Turkish"
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const fileUrl = URL.createObjectURL(file);
            setImage(fileUrl);

            return () => URL.revokeObjectURL(fileUrl);
        }
    }, []);

    // Extract text from image using Tesseract
    const extractText = () => {
        if (image) {
            setIsLoading(true);
            Tesseract.recognize(
                image,
                selectedLanguage,
                {
                    logger: (m) => console.log(m),
                }
            )
                .then(({ data: { text } }) => {
                    setExtractedText(text);
                    setIsLoading(false);
                    translateText(text);
                })
                .catch((err) => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    };

    // Translate extracted text using backend API
    const translateText = async (text) => {
        try {
            const response = await axios.post('http://localhost:8080/translate', {
                text: text,
                target_lang: targetLanguage
            });
            setTranslatedText(response.data.translations[0].text);
        } catch (error) {
            console.error('Error translating text:', error);
        }
    };

    // Copy translated text to clipboard
    const copyToClipboard = () => {
        if (translatedText) {
            navigator.clipboard.writeText(translatedText).then(() => {
                setCopyMessage(true);
                setTimeout(() => setCopyMessage(false), 2000);  // Hide the icon feedback after 2 seconds
            }).catch((err) => {
                console.error('Failed to copy:', err);
            });
        }
    };

    // Dropzone handlers
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        maxFiles: 1,
        accept: {
            'image/*': []
        },
        onDrop,
        onDropRejected: (fileRejections) => {
            console.log('File Rejected:', fileRejections);
        }
    });

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
    };

    const handleTargetLanguageChange = (e) => {
        setTargetLanguage(e.target.value);
    };

    return (
        <div className='app-container'>
            <div className='left-container'>
                <div
                    {...getRootProps({ className: `drop-image ${className}` })}>
                    <input {...getInputProps()} />
                    <p>Drag and drop some files here, or click to select files</p>
                </div>
                {image && (
                    <div className='rendered-image'>
                        <img
                            src={image}
                            alt="Uploaded"
                        />
                    </div>
                )}
            </div>

            <div className='middle-container'>
                <select
                    className='from-select'
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                >
                    {Object.entries(languageDictionary).map(([code, name]) => (
                        <option key={code} value={code}>
                            {name}
                        </option>
                    ))}
                </select>

                <h2>To</h2>
                <select
                    className='to-select'
                    value={targetLanguage}
                    onChange={handleTargetLanguageChange}
                >
                    {Object.entries(targetLanguageDictionary).map(([code, name]) => (
                        <option key={code} value={code}>
                            {name}
                        </option>
                    ))}
                </select>

                <button
                    className='extract-button'
                    onClick={extractText}
                    disabled={isLoading}
                >
                    {isLoading ? 'Extracting...' : 'Extract & Translate'}
                </button>
            </div>

            <div className='right-container'>
                <div className='text-box'>
                    <h3>Translated Text:</h3>
                    <div className='translated-text-box'>
                        <p>{translatedText || 'Translated text will appear here.'}</p>
                        {translatedText && (
                            <FaClipboard
                                className={`clipboard-icon ${copyMessage ? 'copied' : ''}`}
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
