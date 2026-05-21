import * as fs from 'fs';
const pdfParse = require('pdf-parse');
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export interface ChunkRecord {
    id: string;
    text: string;
    embedding: number[];
}

export async function buildKnowledgeBase(pdfPath: string, outputPath: string) {
    console.log(`Reading PDF from ${pdfPath}...`);
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    
    const text = pdfData.text;
    const rawChunks = text.split(/\n\s*\n/).map((c: string) => c.trim()).filter((c: string) => c.length > 20);
    
    console.log(`Found ${rawChunks.length} chunks. Generating embeddings...`);
    
    const records: ChunkRecord[] = [];
    const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    
    for (let i = 0; i < rawChunks.length; i++) {
        const chunk = rawChunks[i];
        const result = await embeddingModel.embedContent(chunk);
        const embedding = result.embedding;
        
        if (embedding && embedding.values.length > 0) {
            records.push({
                id: `chunk_${i}`,
                text: chunk,
                embedding: embedding.values
            });
        }
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(records, null, 2));
    console.log(`Knowledge base saved to ${outputPath} with ${records.length} records.`);
}

if (require.main === module) {
    const pdf = process.argv[2] || 'company_profile.pdf';
    const out = process.argv[3] || 'knowledge_base.json';
    buildKnowledgeBase(pdf, out).catch(console.error);
}
