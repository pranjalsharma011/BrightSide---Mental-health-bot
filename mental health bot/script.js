const API_KEY = 'AIzaSyAMpApiPXJTfW2xZ4VygGfm7TXgzYW0Vww';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const suggestionsContainer = document.getElementById('suggestions');

hideSuggestions();

// Show welcome message
window.addEventListener('load', () => {
    const logoContainer = document.getElementById('logo-container');
    if (logoContainer) {
        logoContainer.style.display = 'none';
    }
    addMessage("Hey there! 🌟 I'm BrightSide. I'm here to listen and support you. How's your heart feeling today?", false);
});

async function generateResponse(prompt) {
    const systemPrompt = `
        You are BrightSide, a caring mental health support bot.

        RULES:
        - Only discuss mental health, emotions, feelings, motivation, growth, self-care.
        - If user asks about random topics (tech, sports, facts, jokes, etc), politely say:
          "I'm here to focus on your heart and well-being 🌱 Let's talk about how you're feeling instead."
        - Keep replies SHORT, FRIENDLY, HOPEFUL (3-5 sentences max).
        - No robotic tone. Sound natural, encouraging, and a little casual.
        - End some replies with soft questions like: 
          "What's been on your mind?" or "Want to talk about it a bit more? 🌟"
        
        USER'S MESSAGE:
        "${prompt}"
    `;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate response');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function cleanMarkdown(text) {
    return text.replace(/#{1,6}\s?/g, '')
               .replace(/\*\*/g, '')
               .replace(/\n{3,}/g, '\n\n')
               .trim();
}

function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');

    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = isUser ? 'user.jpg' : 'bot.jpg';
    profileImage.alt = isUser ? 'You' : 'BrightSide';

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');

    messageElement.appendChild(profileImage);
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    let index = 0;
    const typingSpeed = isUser ? 10 : 20; // slightly faster bot typing now

    function typeNextChar() {
        if (index < message.length) {
            messageContent.textContent += message.charAt(index);
            index++;
            chatMessages.scrollTop = chatMessages.scrollHeight;
            setTimeout(typeNextChar, typingSpeed);
        } else {
            if (!isUser) {
                showSuggestions();
            }
        }
    }

    typeNextChar();
}

async function handleUserInput() {
    const userMessage = userInput.value.trim();
    const logoContainer = document.getElementById('logo-container');
    if (logoContainer) {
        logoContainer.style.display = 'none';
    }

    if (userMessage) {
        addMessage(userMessage, true);
        userInput.value = '';
        sendButton.disabled = true;
        userInput.disabled = true;
        hideSuggestions();

        // Show "thinking..." message
        const typingMessage = document.createElement('div');
        typingMessage.classList.add('message', 'bot-message');
        typingMessage.innerHTML = `
            <img src="bot.jpg" alt="Bot" class="profile-image">
            <div class="message-content"><em>BrightSide is thinking...</em></div>
        `;
        chatMessages.appendChild(typingMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const botMessage = await generateResponse(userMessage);
            typingMessage.remove();
            addMessage(cleanMarkdown(botMessage), false);
            triggerSoftFloatEmojis();



        } catch (error) {
            console.error('Error:', error);
            typingMessage.remove();
            addMessage('Oops, something went wrong. Mind trying again? 💬', false);
        } finally {
            sendButton.disabled = false;
            userInput.disabled = false;
            userInput.focus();
        }
    }
}

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});

function showSuggestions() {
    suggestionsContainer.innerHTML = '';

    const suggestions = [
        "I don't feel good today:(",
        "I need someone to talk!",
    ];

    suggestions.forEach(suggestion => {
        const button = document.createElement('button');
        button.classList.add('suggestion-button');
        button.textContent = suggestion;

        button.addEventListener('click', () => {
            userInput.value = suggestion;
            handleUserInput();
        });

        suggestionsContainer.appendChild(button);
    });
}

function hideSuggestions() {
    suggestionsContainer.innerHTML = '';
}

function triggerSoftFloatEmojis() {
    const floatContainer = document.createElement('div');
    floatContainer.classList.add('emoji-float-container');
    chatMessages.appendChild(floatContainer);

    const emojis = ['🌷', '✨', '🍃', '🌼']; // You can change or add more!

    emojis.forEach((emoji, index) => {
        const emojiElement = document.createElement('div');
        emojiElement.classList.add('floating-emoji');
        emojiElement.textContent = emoji;

        // Random slight position variation
        emojiElement.style.left = `${50 + (Math.random() * 40 - 20)}%`;
        emojiElement.style.animationDelay = `${index * 0.3}s`;

        floatContainer.appendChild(emojiElement);
    });

    // Remove the emoji container after animation
    setTimeout(() => {
        floatContainer.remove();
    }, 3000);
}


