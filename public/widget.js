(function() {
    // Inject CSS for the widget
    const style = document.createElement('style');
    style.innerHTML = `
        #ai-chatbot-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            z-index: 9999;
            transition: transform 0.3s ease;
            transform: translateY(120%);
        }
        #ai-chatbot-widget.open {
            transform: translateY(0);
        }
        #ai-chatbot-header {
            background: #007bff;
            color: #fff;
            padding: 15px;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #ai-chatbot-close {
            cursor: pointer;
            font-size: 20px;
        }
        #ai-chatbot-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #f9f9f9;
        }
        .ai-message, .user-message {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 8px;
            max-width: 80%;
            line-height: 1.4;
            font-size: 14px;
        }
        .ai-message {
            background: #e9ecef;
            color: #333;
            align-self: flex-start;
            border-bottom-left-radius: 0;
        }
        .user-message {
            background: #007bff;
            color: #fff;
            align-self: flex-end;
            margin-left: auto;
            border-bottom-right-radius: 0;
        }
        #ai-chatbot-input-container {
            display: flex;
            padding: 10px;
            border-top: 1px solid #ddd;
            background: #fff;
        }
        #ai-chatbot-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 20px;
            outline: none;
        }
        #ai-chatbot-send {
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            margin-left: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #ai-chatbot-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #007bff;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            z-index: 9998;
            font-size: 24px;
        }
    `;
    document.head.appendChild(style);

    // Create Toggle Button
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'ai-chatbot-toggle';
    toggleBtn.innerHTML = '💬';
    document.body.appendChild(toggleBtn);

    // Create Widget Container
    const widget = document.createElement('div');
    widget.id = 'ai-chatbot-widget';
    widget.innerHTML = `
        <div id="ai-chatbot-header">
            <span>Company AI Assistant</span>
            <span id="ai-chatbot-close">&times;</span>
        </div>
        <div id="ai-chatbot-messages">
            <div class="ai-message">Hello! How can I help you today?</div>
        </div>
        <div id="ai-chatbot-input-container">
            <input type="text" id="ai-chatbot-input" placeholder="Type your message..." />
            <button id="ai-chatbot-send">➤</button>
        </div>
    `;
    document.body.appendChild(widget);

    // Logic
    const messagesContainer = document.getElementById('ai-chatbot-messages');
    const input = document.getElementById('ai-chatbot-input');
    const sendBtn = document.getElementById('ai-chatbot-send');
    const closeBtn = document.getElementById('ai-chatbot-close');

    toggleBtn.addEventListener('click', () => {
        widget.classList.add('open');
        toggleBtn.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        widget.classList.remove('open');
        setTimeout(() => toggleBtn.style.display = 'flex', 300);
    });

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        // API Call
        // NOTE: Replace API_URL with your actual backend URL when deploying
        // Currently points to the same host if hosted together, or configure for external domains.
        const API_URL = window.AI_CHATBOT_API_URL || 'http://localhost:3000/api/chat';
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            if (data.answer) {
                addMessage(data.answer, 'ai');
            } else {
                addMessage("Sorry, I encountered an error.", 'ai');
            }
        } catch (error) {
            console.error(error);
            addMessage("Failed to connect to the server.", 'ai');
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
})();
