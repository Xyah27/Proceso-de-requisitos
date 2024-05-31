const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = '3000';
const MODEL_NAME = 'gemini-1.5-pro-latest';
const API_KEY = "AIzaSyD_pehb-s7_kUasnma9jpL8RBLJhC8ZV7I"

app.use(bodyParser.json());
app.use(cors());

app.post('/api/chat', async(req,res)=>{
    try {
        const userInput = req.body.userInput;
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({model:MODEL_NAME});
        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
        };
        const chatSession = model.startChat({
            generationConfig,
            history: [],
            });
          
        const result = await chatSession.sendMessage(userInput);
        console.log(result.response.text());
        if (result && result.response) {
            const responseText = result.response.text();

            if (responseText) {
                res.json({text:responseText})
            }else {
                res.status(500).json({error:'Respuesta vacia del modelo'});
            }
        }else{
            res.status(500).json({error:'Respuesta inesperada del modelo'});
        }

    } catch (error) {
        console.log(error);        
        res.status(500).json({error:'Error en el servidor'})
    }
})

app.listen(port, ()=>{
    console.log('Servidor escuchando en http://localhost:3000')
})
