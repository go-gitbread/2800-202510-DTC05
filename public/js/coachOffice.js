        const chatMessages = document.getElementById('chat-messages')
        const messageText = document.getElementById('message-text')
        const sendButton = document.getElementById('send-button')

        sendButton.addEventListener('click', sendMessage);

function sendMessage(){
    console.log('click')
    const message = messageText.value.trim()
    if (!message) return;
    // addMessageToChat(message,'user-message') //Add message to chat as a user message
    messageText.value = '';
}