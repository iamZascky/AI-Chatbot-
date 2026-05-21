# AI Chatbot Company Profile

A custom AI chatbot implementation built with Node.js, Express, and Google Gemini. This project demonstrates how to build a Retrieval-Augmented Generation (RAG) system to allow an AI assistant to answer questions based on a specific company profile and FAQ.

## Features

- **Custom Knowledge Base**: Automatically extracts text from PDF documents and builds a vector-based knowledge base.
- **RAG Architecture**: Uses Gemini embeddings to perform semantic search and retrieve relevant context for user queries.
- **RESTful API**: Includes an Express server that exposes a `/api/chat` endpoint for easy integration.
- **Web Widget Demo**: Serves a static front-end to interact with the chatbot directly from the browser.
- **Powered by Gemini**: Utilizes Google's state-of-the-art Generative AI models.

## Prerequisites

- Node.js (v14 or higher recommended)
- A Google Gemini API Key

## Installation

1. Clone the repository and navigate to the project directory.
2. Install the required dependencies:
   ```bash
   npm install
   ```

## Configuration & Setup

1. **Environment Variables**: Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

2. **Generate a Sample PDF**: (Optional) To test with the default Solutif Media company profile, run the PDF generation script:
   ```bash
   npx ts-node generate_pdf.ts
   ```

3. **Build the Knowledge Base**: Convert the PDF document into a vectorized JSON knowledge base:
   ```bash
   npx ts-node src/kb_builder.ts
   ```
   *Note: You can parse your own documents by passing custom arguments: `npx ts-node src/kb_builder.ts your_file.pdf output_kb.json`*

## Running the Server

Start the Express API server:
```bash
npx ts-node src/server.ts
```

The server will start and be accessible at `http://localhost:3000`.

## Usage

- **API Endpoint**: You can interact with the chatbot by sending a POST request to `/api/chat` with a JSON payload:
  ```json
  {
    "message": "What services do you offer?"
  }
  ```
- **Web Interface**: Open your browser and navigate to `http://localhost:3000/index.html` to chat with the bot using the built-in test widget.

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **AI/LLM**: Google Generative AI (`@google/generative-ai`)
- **PDF Processing**: `pdf-parse`, `pdfkit`
- **Other Utilities**: `dotenv`, `cors`

## License

ISC
