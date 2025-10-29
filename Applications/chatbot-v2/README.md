# AI Chatbot Application

A modern, responsive chatbot application with OpenAI integration, following the specifications from the chatbot plan.

## Features

✅ **Circular Chat Button**: Purple chat bubble button at bottom right corner  
✅ **Chat Interface**: Clean chat box with input area at the bottom  
✅ **Message Layout**: User messages on right, bot responses on left with robot avatar  
✅ **OpenAI Integration**: Uses OpenAI API for intelligent responses  
✅ **Thinking Indicator**: Shows "Thinking..." message while waiting for OpenAI response  
✅ **Customizable Prompts**: Easy-to-modify AI personality and behavior  

## File Structure

```
chatbot-v2/
├── index.html          # Main HTML structure
├── style.css           # Styling with purple theme and responsive design
├── script.js           # JavaScript functionality and OpenAI integration
└── README.md           # This documentation
```

## Setup Instructions

1. **Get OpenAI API Key**: 
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create an account and generate an API key
   - Replace the `apiKey` in `script.js` with your actual key

2. **Open the Application**:
   - Simply open `index.html` in a web browser
   - The chatbot will be ready to use!

## Customization

The chatbot is highly customizable through the configuration object in `script.js`:

```javascript
// Update system prompt for different personalities
window.chatbot.updateSystemPrompt('You are a helpful coding assistant...');

// Update configuration
window.chatbot.updateConfig({
    maxTokens: 200,
    temperature: 0.8,
    model: 'gpt-4o'
});
```

## Key Features Implemented

### 1. Circular Chat Button
- Purple gradient design with chat bubble icon
- Smooth animations and hover effects
- Rotates to close icon when chat is open

### 2. Chat Interface
- Modern, clean design with rounded corners
- Responsive layout that works on mobile and desktop
- Smooth slide-in animations

### 3. Message System
- User messages appear on the right side
- Bot messages appear on the left with robot avatar
- Smooth animations for new messages
- Auto-scroll to latest messages

### 4. OpenAI Integration
- Real-time API communication
- Error handling for network issues
- Configurable model and parameters

### 5. Thinking Indicator
- Shows "Thinking..." with animated dots
- Automatically replaced with actual response
- Prevents multiple simultaneous requests

### 6. Customizable Prompts
- Easy-to-modify system prompts
- Configurable AI behavior and personality
- Support for different use cases

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Security Note

⚠️ **Important**: The API key is currently hardcoded in the JavaScript file. For production use, implement proper server-side API handling to keep your API key secure.

## License

This project is for educational purposes. Please ensure you comply with OpenAI's usage policies when using their API.
