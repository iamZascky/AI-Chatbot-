import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { askChatbot, loadKnowledgeBase } from './chatbot';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins so it can be embedded in any website
app.use(cors());
app.use(express.json());

// Serve the public folder for the widget demo
app.use(express.static(path.join(__dirname, '../public')));

// Load KB on startup
loadKnowledgeBase(path.join(__dirname, '../knowledge_base.json'));

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        console.log(`Received question: ${message}`);
        const answer = await askChatbot(message);
        
        res.json({ answer });
    } catch (error) {
        console.error('Error handling chat request:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

app.listen(port, () => {
    console.log(`Chatbot API server running at http://localhost:${port}`);
    console.log(`Test widget available at http://localhost:${port}/index.html`);
});
