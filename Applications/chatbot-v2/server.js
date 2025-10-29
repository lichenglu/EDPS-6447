const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Proxy endpoint for OpenAI API
app.post('/api/chat', async (req, res) => {
    try {
        const { message, apiKey, model = 'gpt-4o', systemPrompt, maxTokens = 150, temperature = 0.7 } = req.body;

        if (!message || !apiKey) {
            return res.status(400).json({ error: 'Message and API key are required' });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt || 'You are a helpful, friendly, and knowledgeable AI assistant. You provide accurate, concise, and engaging responses. Always be polite and try to help users with their questions to the best of your ability. Keep responses conversational and not too lengthy unless the user specifically asks for detailed information.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: maxTokens,
                temperature: temperature,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenAI API Error:', errorData);
            return res.status(response.status).json({ 
                error: `OpenAI API error: ${response.status}`,
                details: errorData 
            });
        }

        const data = await response.json();
        res.json({ 
            message: data.choices[0].message.content.trim(),
            usage: data.usage 
        });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Chatbot server running on http://localhost:${PORT}`);
    console.log(`📱 Open your browser and navigate to http://localhost:${PORT}`);
});
