import PDFDocument from 'pdfkit';
import * as fs from 'fs';

const doc = new PDFDocument();

doc.pipe(fs.createWriteStream('company_profile.pdf'));

doc.fontSize(25).text('Solutif Media - Company Profile and FAQ', { align: 'center' });
doc.moveDown();

doc.fontSize(16).text('About Us');
doc.fontSize(12).text('Solutif Media is a leading AI and Digital Transformation agency. We specialize in building intelligent chatbots, web applications, and providing cutting-edge AI solutions to help businesses automate their operations and scale effectively.');
doc.moveDown();

doc.fontSize(16).text('Frequently Asked Questions (FAQ)');
doc.moveDown();

doc.fontSize(14).text('Q: What services do you offer?');
doc.fontSize(12).text('A: We offer AI chatbot development, custom web application development, cloud deployment, and digital transformation consulting.');
doc.moveDown();

doc.fontSize(14).text('Q: How much does a custom AI chatbot cost?');
doc.fontSize(12).text('A: The cost of a custom AI chatbot starts from $5,000 depending on the complexity, integrations required, and the specific use case.');
doc.moveDown();

doc.fontSize(14).text('Q: What technology do you use for your chatbots?');
doc.fontSize(12).text('A: We utilize state-of-the-art Large Language Models like Google Gemini and OpenAI GPT-4, combined with custom RAG (Retrieval-Augmented Generation) architectures using vector databases to ensure the chatbot answers questions based on your specific company data.');
doc.moveDown();

doc.fontSize(14).text('Q: How long does it take to deploy a chatbot?');
doc.fontSize(12).text('A: A standard AI chatbot trained on your company profile and FAQs can be deployed within 2 to 4 weeks.');
doc.moveDown();

doc.fontSize(14).text('Q: Can the chatbot be integrated into my existing website?');
doc.fontSize(12).text('A: Yes! We provide a simple JavaScript snippet that can be embedded into any website platform (WordPress, Shopify, custom HTML, React, etc.) within minutes.');
doc.moveDown();

doc.fontSize(14).text('Q: Do you offer ongoing support and maintenance?');
doc.fontSize(12).text('A: Absolutely. We offer monthly retainer packages for continuous monitoring, model retraining, and system updates to ensure your AI solutions perform optimally.');

doc.end();

console.log('Sample PDF created at company_profile.pdf');
