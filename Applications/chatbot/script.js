// API Configuration - In production, move this to environment variables
const API_KEY = ""; // Replace with your OpenAI API key
const OPENAI_MODEL = 'gpt-4o'
const INSTRUCTIONS = `Act as a great joker and make the user laugh. Even though the user is not in a good mood, make them laugh. Keep responses concise and engaging.`

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = async (chatElement, userMessage) => {
  const messageElement = chatElement.querySelector("p");
  
  try {
    // Show typing indicator
    showTypingIndicator(messageElement);
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: INSTRUCTIONS,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              messageElement.textContent = fullResponse;
              chatbox.scrollTo(0, chatbox.scrollHeight);
            }
          } catch (e) {
            // Skip malformed JSON
            continue;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating response:', error);
    messageElement.textContent = "Sorry, I'm having trouble connecting right now. Please try again!";
    messageElement.classList.add('error');
  }
};

const showTypingIndicator = (messageElement) => {
  let dots = '';
  const typingInterval = setInterval(() => {
    dots = dots.length >= 3 ? '' : dots + '.';
    messageElement.textContent = `Thinking${dots}`;
  }, 500);
  
  // Clear the interval when we start receiving actual content
  const originalTextContent = messageElement.textContent;
  const checkInterval = setInterval(() => {
    if (messageElement.textContent !== originalTextContent && 
        !messageElement.textContent.startsWith('Thinking')) {
      clearInterval(typingInterval);
      clearInterval(checkInterval);
    }
  }, 100);
};

const handleChat = async () => {
  userMessage = chatInput.value.trim();
  
  // Validate input
  const validation = validateInput(userMessage);
  if (!validation.valid) {
    // Show error message
    const errorLi = createChatLi(validation.error, "incoming");
    errorLi.querySelector("p").classList.add('error');
    chatbox.appendChild(errorLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    return;
  }

  // Disable input while processing
  chatInput.disabled = true;
  sendChatBtn.style.opacity = '0.5';
  sendChatBtn.style.pointerEvents = 'none';

  // Clear the input textarea and set its height to default
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the chatbox
  const userChatLi = createChatLi(userMessage, "outgoing");
  chatbox.appendChild(userChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Display "Thinking..." message while waiting for the response
  const incomingChatLi = createChatLi("Thinking...", "incoming");
  chatbox.appendChild(incomingChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);
  
  try {
    await generateResponse(incomingChatLi, userMessage);
    // Save message history after successful response
    saveMessageHistory();
  } finally {
    // Re-enable input after processing
    chatInput.disabled = false;
    sendChatBtn.style.opacity = '1';
    sendChatBtn.style.pointerEvents = 'auto';
    chatInput.focus();
  }
};

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // If Enter key is pressed without Shift key and the window
  // width is greater than 800px, handle the chat
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

// Add message history persistence
const saveMessageHistory = () => {
  const messages = Array.from(chatbox.children).map(li => ({
    className: li.className,
    content: li.querySelector('p').textContent,
    timestamp: new Date().toISOString()
  }));
  localStorage.setItem('chatbot-history', JSON.stringify(messages));
};

const loadMessageHistory = () => {
  const history = localStorage.getItem('chatbot-history');
  if (history) {
    try {
      const messages = JSON.parse(history);
      // Clear existing messages except the initial greeting
      chatbox.innerHTML = '';
      messages.forEach(msg => {
        const li = createChatLi(msg.content, msg.className);
        chatbox.appendChild(li);
      });
    } catch (e) {
      console.error('Error loading message history:', e);
    }
  }
};

// Add input validation
const validateInput = (input) => {
  if (!input || input.trim().length === 0) {
    return { valid: false, error: "Please enter a message" };
  }
  if (input.length > 1000) {
    return { valid: false, error: "Message too long (max 1000 characters)" };
  }
  return { valid: true };
};

// Initialize the chatbot
document.addEventListener('DOMContentLoaded', () => {
  // Load message history if available
  loadMessageHistory();
  
  // Focus on input when chatbot opens
  chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
    if (document.body.classList.contains("show-chatbot")) {
      setTimeout(() => chatInput.focus(), 300);
    }
  });
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
