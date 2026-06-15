class OrbitAI {
    constructor() {
        this.currentDialog = 'main';
        this.messageHistory = [];
        this.isWaitingForResponse = false;
        
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.chatScreen = document.getElementById('chat-screen');
        this.messagesContainer = document.getElementById('messages-container');
        this.actionPanel = document.getElementById('action-panel');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalPanel = document.getElementById('modal-panel');
        this.questionsContainer = document.getElementById('questions-container');
        this.closeModal = document.getElementById('close-modal');
        this.backButton = document.getElementById('back-button');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.actionPanel.addEventListener('click', () => this.openModal());
        this.closeModal.addEventListener('click', () => this.closeModalPanel());
        this.modalOverlay.addEventListener('click', () => this.closeModalPanel());
        this.backButton.addEventListener('click', () => this.goBack());
    }
    
    openModal() {
        this.modalOverlay.classList.remove('hidden');
        this.modalPanel.classList.remove('hidden');
        this.renderQuestions();
    }
    
    closeModalPanel() {
        this.modalOverlay.classList.add('hidden');
        this.modalPanel.classList.add('hidden');
    }
    
    renderQuestions() {
        this.questionsContainer.innerHTML = '';
        const dialogData = DIALOGS[this.currentDialog];
        
        if (dialogData.options) {
            dialogData.options.forEach(option => {
                const [text, key] = option.split(' | ');
                const button = document.createElement('button');
                button.className = 'question-btn';
                button.textContent = text;
                button.addEventListener('click', () => this.selectOption(text, key));
                this.questionsContainer.appendChild(button);
            });
        }
    }
    
    selectOption(text, key) {
        this.closeModalPanel();
        this.startChat();
        this.addUserMessage(text);
        this.simulateAIResponse(key);
    }
    
    startChat() {
        this.welcomeScreen.classList.add('hidden');
        this.chatScreen.classList.remove('hidden');
    }
    
    addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;
        
        messageDiv.appendChild(bubble);
        this.messagesContainer.appendChild(messageDiv);
        
        this.messageHistory.push({ role: 'user', content: text });
        this.scrollToBottom();
    }
    
    simulateAIResponse(key) {
        this.currentDialog = key;
        this.isWaitingForResponse = true;
        
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai';
        typingDiv.id = 'typing-indicator';
        
        const typingBubble = document.createElement('div');
        typingBubble.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingBubble.appendChild(dot);
        }
        
        typingDiv.appendChild(typingBubble);
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
        
        // Simulate API delay
        setTimeout(() => {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            
            const dialogData = DIALOGS[key];
            if (dialogData) {
                this.typeMessage(dialogData.text);
            }
            
            this.isWaitingForResponse = false;
        }, 2500 + Math.random() * 2000);
    }
    
    typeMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = '';
        
        messageDiv.appendChild(bubble);
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                bubble.textContent += text[index];
                index++;
                this.scrollToBottom();
            } else {
                clearInterval(typeInterval);
            }
        }, 30);
        
        this.messageHistory.push({ role: 'ai', content: text });
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.parentElement.scrollTop = 
                this.messagesContainer.parentElement.scrollHeight;
        }, 0);
    }
    
    goBack() {
        // Reset to main screen
        this.currentDialog = 'main';
        this.messageHistory = [];
        this.isWaitingForResponse = false;
        
        this.messagesContainer.innerHTML = '';
        this.welcomeScreen.classList.remove('hidden');
        this.chatScreen.classList.add('hidden');
        this.closeModalPanel();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new OrbitAI();
});