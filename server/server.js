<<<<<<< HEAD
require('dotenv').config();
const express = require("express");
const axios = require('axios');
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const DeepL_API_KEY = 'INSERT-YOUR-API-KEY-HERE';
const DEEPL_ENDPOINT = 'https://api-free.deepl.com/v2/translate';



app.post('/translate', async (req, res) => {
    const { text, target_lang } = req.body;

    if (!text || !target_lang) {
        return res.status(400).json({ error: 'Text and target language are required' });
    }

    try {
        const response = await axios.post(DEEPL_ENDPOINT, null, {
            params: {
                auth_key: DeepL_API_KEY,
                text: text,
                target_lang: target_lang
            }
        });

        if (response.status !== 200) {
            throw new Error(`DeepL API responded with status ${response.status}`);
        }

        res.json(response.data);
    } catch (error) {
        console.error('Error translating text:', error.message || error);
        res.status(500).json({ error: 'Translation failed, please try again later.' });
=======
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(bodyParser.json());

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_ENDPOINT = "https://api-free.deepl.com/v2/translate";

app.post("/translate", async (req, res) => {
    let { text, target_lang, source_lang } = req.body;

    if (!text || !target_lang) {
        return res.status(400).json({ error: "Text and target language are required" });
    }

    target_lang = target_lang.toUpperCase();
    if (source_lang) source_lang = source_lang.toUpperCase();

    try {
        const form = new URLSearchParams();
        form.append("text", text);
        form.append("target_lang", target_lang);
        if (source_lang) form.append("source_lang", source_lang);

        const response = await axios.post(
            DEEPL_ENDPOINT,
            form.toString(),
            {
                headers: {
                    Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: "Translation failed",
            details: error.response?.data || error.message,
        });
>>>>>>> 59c7c64 (Update translation UI and interchange buttons)
    }
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
