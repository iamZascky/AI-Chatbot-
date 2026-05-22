(function() {
    // Inject CSS for the widget
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;600&display=swap');
        
        #ai-chatbot-widget {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 380px;
            height: 550px;
            background: rgba(10, 13, 20, 0.8);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            box-shadow: 0 0 30px rgba(0, 240, 255, 0.15), 0 10px 30px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
            z-index: 9999;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
            transform: translateY(120%) scale(0.95);
            opacity: 0;
            color: #fff;
        }
        #ai-chatbot-widget.open {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        #ai-chatbot-header {
            background: rgba(5, 7, 9, 0.9);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header-title-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .header-dot {
            width: 6px;
            height: 6px;
            background: #00f0ff;
            border-radius: 50%;
            box-shadow: 0 0 8px #00f0ff;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }
        #ai-chatbot-header-text {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            letter-spacing: 2px;
            color: #00f0ff;
            font-weight: 700;
        }
        #ai-chatbot-close {
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 14px;
            transition: all 0.2s;
        }
        #ai-chatbot-close:hover {
            color: #fff;
            background: rgba(255, 255, 255, 0.1);
            border-color: #00f0ff;
        }
        #ai-chatbot-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: linear-gradient(180deg, rgba(5, 7, 9, 0) 0%, rgba(0, 240, 255, 0.02) 100%);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        #ai-chatbot-messages::-webkit-scrollbar {
            width: 6px;
        }
        #ai-chatbot-messages::-webkit-scrollbar-track {
            background: transparent;
        }
        #ai-chatbot-messages::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }
        .ai-message, .user-message {
            padding: 12px 16px;
            border-radius: 8px;
            max-width: 85%;
            line-height: 1.5;
            font-size: 13px;
            word-wrap: break-word;
        }
        .ai-message {
            background: rgba(255, 255, 255, 0.05);
            color: #d1d5db;
            align-self: flex-start;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-bottom-left-radius: 2px;
        }
        .user-message {
            background: rgba(0, 240, 255, 0.1);
            color: #fff;
            align-self: flex-end;
            border: 1px solid rgba(0, 240, 255, 0.3);
            border-bottom-right-radius: 2px;
            box-shadow: 0 0 10px rgba(0, 240, 255, 0.1);
        }
        #ai-chatbot-input-container {
            display: flex;
            padding: 16px;
            background: rgba(5, 7, 9, 0.95);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            gap: 10px;
        }
        #ai-chatbot-input {
            flex: 1;
            padding: 12px 16px;
            background: #050709;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            outline: none;
            color: #fff;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            transition: border-color 0.2s;
        }
        #ai-chatbot-input::placeholder {
            color: #4b5563;
        }
        #ai-chatbot-input:focus {
            border-color: rgba(0, 240, 255, 0.5);
            box-shadow: 0 0 10px rgba(0, 240, 255, 0.1) inset;
        }
        #ai-chatbot-send {
            background: #00f0ff;
            color: #050709;
            border: none;
            border-radius: 4px;
            width: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            font-family: 'JetBrains Mono', monospace;
            font-weight: bold;
        }
        #ai-chatbot-send:hover {
            background: #fff;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        }
        #ai-chatbot-toggle {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 56px;
            height: 56px;
            background: #0a0d14;
            color: #00f0ff;
            border: 1px solid rgba(0, 240, 255, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
            z-index: 9998;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #ai-chatbot-toggle:hover {
            transform: scale(1.1);
            border-color: #00f0ff;
            box-shadow: 0 0 30px rgba(0, 240, 255, 0.4);
            background: rgba(0, 240, 255, 0.1);
        }
        .toggle-icon {
            width: 24px;
            height: 24px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        
        .loading-dots {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            border-bottom-left-radius: 2px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            align-self: flex-start;
            width: fit-content;
        }
        .loading-dots div {
            width: 6px;
            height: 6px;
            background: #00f0ff;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out both;
        }
        .loading-dots div:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots div:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Create Toggle Button
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'ai-chatbot-toggle';
    toggleBtn.innerHTML = `
        <svg class="toggle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    `;
    document.body.appendChild(toggleBtn);

    // Create Widget Container
    const widget = document.createElement('div');
    widget.id = 'ai-chatbot-widget';
    widget.innerHTML = `
        <div id="ai-chatbot-header">
            <div class="header-title-container">
                <div class="header-dot"></div>
                <span id="ai-chatbot-header-text">AI_ASSISTANT // SYS_NODE</span>
            </div>
            <span id="ai-chatbot-close">✕</span>
        </div>
        <div id="ai-chatbot-messages">
            <div class="ai-message">SYSTEM_ONLINE: Awaiting your query...</div>
        </div>
        <div id="ai-chatbot-input-container">
            <input type="text" id="ai-chatbot-input" placeholder="ENTER_COMMAND..." autocomplete="off" />
            <button id="ai-chatbot-send">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>
    `;
    document.body.appendChild(widget);

    // Logic
    const messagesContainer = document.getElementById('ai-chatbot-messages');
    const input = document.getElementById('ai-chatbot-input');
    const sendBtn = document.getElementById('ai-chatbot-send');
    const closeBtn = document.getElementById('ai-chatbot-close');
    let isWaiting = false;

    toggleBtn.addEventListener('click', () => {
        widget.classList.add('open');
        toggleBtn.style.opacity = '0';
        toggleBtn.style.pointerEvents = 'none';
        setTimeout(() => input.focus(), 100);
    });

    closeBtn.addEventListener('click', () => {
        widget.classList.remove('open');
        setTimeout(() => {
            toggleBtn.style.opacity = '1';
            toggleBtn.style.pointerEvents = 'auto';
        }, 300);
    });

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
        
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\n/g, '<br>');
        
        msgDiv.innerHTML = formattedText;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-dots';
        loadingDiv.id = 'ai-chatbot-loading';
        loadingDiv.innerHTML = '<div></div><div></div><div></div>';
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeLoading() {
        const loadingDiv = document.getElementById('ai-chatbot-loading');
        if (loadingDiv) loadingDiv.remove();
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text || isWaiting) return;

        addMessage(text, 'user');
        input.value = '';
        isWaiting = true;
        
        addLoading();

        // API Call
        const API_URL = window.AI_CHATBOT_API_URL || 'http://localhost:3000/api/chat';
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            removeLoading();
            if (data.answer) {
                addMessage(data.answer, 'ai');
            } else {
                addMessage("ERR: COMMUNICATION_FAILED. Received invalid response payload.", 'ai');
            }
        } catch (error) {
            console.error(error);
            removeLoading();
            addMessage("CRITICAL_ERR: CONNECTION_LOST. Please try again later.", 'ai');
        } finally {
            isWaiting = false;
            input.focus();
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
})();
