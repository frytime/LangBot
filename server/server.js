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
    }
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
