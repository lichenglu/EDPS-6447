// AI Chatbot Application
class Chatbot {
    constructor() {
        // Configuration - Make these easily customizable
        this.config = {
            apiKey: "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", // Replace with your OpenAI API key
            model: 'gpt-4o',
            systemPrompt: `You are a helpful, friendly, and knowledgeable AI assistant. You provide accurate, concise, and engaging responses. Always be polite and try to help users with their questions to the best of your ability. Keep responses conversational and not too lengthy unless the user specifically asks for detailed information.`,
            maxTokens: 150,
            temperature: 0.7,
            maxMessageLength: 1000
        };

        // DOM Elements
        this.chatButton = document.getElementById('chatButton');
        this.chatContainer = document.getElementById('chatContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');

        // State
        this.isOpen = false;
        this.isProcessing = false;
        this.messageHistory = [];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMessageHistory();
        this.autoResizeTextarea();
    }

    setupEventListeners() {
        // Chat button toggle
        this.chatButton.addEventListener('click', () => this.toggleChat());

        // Send button
        this.sendButton.addEventListener('click', () => this.sendMessage());

        // Enter key to send message
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Input validation
        this.messageInput.addEventListener('input', () => {
            this.validateInput();
            this.autoResizeTextarea();
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.chatContainer.contains(e.target) && 
                !this.chatButton.contains(e.target)) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.openChat();
        } else {
            this.closeChat();
        }
    }

    openChat() {
        this.chatContainer.classList.add('active');
        this.chatButton.classList.add('active');
        this.messageInput.focus();
    }

    closeChat() {
        this.chatContainer.classList.remove('active');
        this.chatButton.classList.remove('active');
    }

    validateInput() {
        const message = this.messageInput.value.trim();
        const isValid = message.length > 0 && message.length <= this.config.maxMessageLength;
        
        this.sendButton.disabled = !isValid || this.isProcessing;
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message || this.isProcessing) return;

        // Clear input and disable
        this.messageInput.value = '';
        this.validateInput();
        this.autoResizeTextarea();
        this.isProcessing = true;
        this.sendButton.disabled = true;

        // Add user message
        this.addMessage(message, 'user');

        // Add thinking message
        const thinkingMessage = this.addMessage('Thinking...', 'bot', true);

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Remove thinking message and add actual response
            this.removeMessage(thinkingMessage);
            this.addMessage(response, 'bot');
            
            // Save to history
            this.saveMessageHistory();
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            
            // Remove thinking message and show error
            this.removeMessage(thinkingMessage);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot', false, true);
        } finally {
            this.isProcessing = false;
            this.validateInput();
            this.messageInput.focus();
        }
    }

    addMessage(content, type, isThinking = false, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        if (isThinking) {
            messageDiv.classList.add('thinking-message');
        }
        
        if (isError) {
            messageDiv.classList.add('error-message');
        }

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        const icon = document.createElement('span');
        icon.className = 'material-icons';
        icon.textContent = type === 'user' ? 'person' : 'smart_toy';
        avatar.appendChild(icon);

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const paragraph = document.createElement('p');
        paragraph.textContent = content;
        
        if (isThinking) {
            paragraph.classList.add('loading-dots');
        }
        
        messageContent.appendChild(paragraph);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        return messageDiv;
    }

    removeMessage(messageElement) {
        if (messageElement && messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }

    async getAIResponse(userMessage) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                apiKey: this.config.apiKey,
                model: this.config.model,
                systemPrompt: this.config.systemPrompt,
                maxTokens: this.config.maxTokens,
                temperature: this.config.temperature
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.message;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    saveMessageHistory() {
        const messages = Array.from(this.chatMessages.children).map(messageDiv => {
            const content = messageDiv.querySelector('.message-content p').textContent;
            const type = messageDiv.classList.contains('user-message') ? 'user' : 'bot';
            return { content, type, timestamp: Date.now() };
        });
        
        localStorage.setItem('chatbot-history', JSON.stringify(messages));
    }

    loadMessageHistory() {
        try {
            const history = localStorage.getItem('chatbot-history');
            if (history) {
                const messages = JSON.parse(history);
                
                // Clear existing messages except the initial greeting
                this.chatMessages.innerHTML = '';
                
                messages.forEach(msg => {
                    this.addMessage(msg.content, msg.type);
                });
            }
        } catch (error) {
            console.error('Error loading message history:', error);
        }
    }

    // Method to update configuration (for customization)
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    // Method to update system prompt
    updateSystemPrompt(newPrompt) {
        this.config.systemPrompt = newPrompt;
    }

    // Method to clear chat history
    clearHistory() {
        this.chatMessages.innerHTML = '';
        localStorage.removeItem('chatbot-history');
        this.addMessage('Hello! I\'m your AI assistant. How can I help you today?', 'bot');
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new Chatbot();
    
    // Example of how to customize the chatbot
    // You can modify these settings:
    
    // Update system prompt for different personalities
    // window.chatbot.updateSystemPrompt('You are a helpful coding assistant. Provide clear, concise code examples and explanations.');
    
    // Update configuration
    // window.chatbot.updateConfig({
    //     maxTokens: 200,
    //     temperature: 0.8
    // });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Chatbot;
}
