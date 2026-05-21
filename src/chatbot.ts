import * as fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { ChunkRecord } from './kb_builder';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

let knowledgeBase: ChunkRecord[] = [];

export function loadKnowledgeBase(path: string) {
    if (fs.existsSync(path)) {
        knowledgeBase = JSON.parse(fs.readFileSync(path, 'utf8'));
        console.log(`Loaded ${knowledgeBase.length} records from knowledge base.`);
    } else {
        console.warn(`Knowledge base not found at ${path}. Chatbot will only use its baseline knowledge.`);
    }
}

async function getReleventContext(query: string, topK: number = 3): Promise<string> {
    if (knowledgeBase.length === 0) return '';
    
    const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const result = await embeddingModel.embedContent(query);
    const queryEmbedding = result.embedding.values;
    
    if (!queryEmbedding) return '';
    
    const scoredChunks = knowledgeBase.map(chunk => ({
        text: chunk.text,
        score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }));
    
    scoredChunks.sort((a, b) => b.score - a.score);
    
    return scoredChunks.slice(0, topK).map(c => c.text).join('\n\n');
}

export async function askChatbot(query: string): Promise<string> {
    const context = await getReleventContext(query);
    
    const prompt = `You are a helpful AI assistant for a company. 
Use the provided context to answer questions about the company accurately. 
If the user says a general greeting or asks a basic conversational question (like "hello"), reply politely. 
For company-specific questions that are NOT in the context, you can say "I'm sorry, I don't have information on that, please contact support." But for general or conversational questions, answer them naturally.

Context:
${context}

User Question: ${query}

Answer:`;

    const chatModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const response = await chatModel.generateContent(prompt);
    
    return response.response.text() || "I'm sorry, I couldn't generate an answer.";
}
