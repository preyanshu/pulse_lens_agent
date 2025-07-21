// server.js

import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';
import bodyParser from 'body-parser';

// Load env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI client for IOPNet
const openai = new OpenAI({
  apiKey: process.env.IOP_NET_KEY, // your IOPNet key
  baseURL: 'https://api.intelligence.io.solutions/api/v1', // IOPNet endpoint
});

app.post('/generate-report', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8', // Your IOPNet model
      messages: [
        { role: 'system', content: 'You are a health insight generator.' },
        { role: 'user', content: prompt },
      ],
    });

    const output = completion.choices[0].message.content;
    res.json({ report: output });
  } catch (error) {
    console.error('IOPNet model error:', error.message);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

app.listen(port, () => {
  console.log(`PulseLensAgent server running on http://localhost:${port}`);
});
