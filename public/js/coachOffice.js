        const chatMessages = document.getElementById('chat-messages')
        const messageText = document.getElementById('message-text')
        const sendButton = document.getElementById('send-button')

        sendButton.addEventListener('click', sendMessage);

function sendMessage(){
    console.log('click')
    const message = messageText.value.trim()
    if (!message) return;
    addMessageToChat(message,'user-message') //Add message to chat as a user message
    messageText.value = '';

            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading clearfix';
            loadingDiv.textContent = 'Whiskers is typing...';
            chatMessages.appendChild(loadingDiv)
            chatMessages.scrollTop = chatMessages.scrollHeight; //Scroll to the bottom every time a message is added
            getCatCoachResponse(message).then(response =>{
                chatMessages.removeChild(loadingDiv)
                addMessageToChat(response, 'coach-message')
            })
        }
function addMessageToChat(text, className) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${className} clearfix`;
            
            const paragraph = document.createElement('p');
            paragraph.textContent = text;
            
            messageDiv.appendChild(paragraph);
            chatMessages.appendChild(messageDiv);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
}
async function getCatCoachResponse(message) {
    return "Bonjour";
}
//         // DOM elements
//         const chatMessages = document.getElementById('chat-messages');
//         const messageText = document.getElementById('message-text');
//         const sendButton = document.getElementById('send-button');

//         // Initialize chat functionality
//         document.addEventListener('DOMContentLoaded', () => {
//             // Set up event listeners
//             sendButton.addEventListener('click', sendMessage);
//             messageText.addEventListener('keypress', (e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     sendMessage();
//                 }
//             });
//         });

//         // Function to send message
//         function sendMessage() {
//             const message = messageText.value.trim();
//             if (!message) return;

//             // Add user message to chat
//             addMessageToChat(message, 'user-message');
            
//             // Clear input
//             messageText.value = '';
            
//             // Show loading indicator
//             const loadingDiv = document.createElement('div');
//             loadingDiv.className = 'loading clearfix';
//             loadingDiv.textContent = 'Whiskers is typing...';
//             chatMessages.appendChild(loadingDiv);
            
//             // Scroll to bottom
//             chatMessages.scrollTop = chatMessages.scrollHeight;
            
//             // Get response from cat coach
//             getCatCoachResponse(message)
//                 .then(response => {
//                     // Remove loading indicator
//                     chatMessages.removeChild(loadingDiv);
                    
//                     // Add coach response
//                     addMessageToChat(response, 'coach-message');
//                 })
//                 .catch(error => {
//                     // Remove loading indicator
//                     chatMessages.removeChild(loadingDiv);
                    
//                     // Add error message
//                     addMessageToChat("Meow! I'm having trouble connecting right now. Please try again later.", 'coach-message');
//                     console.error('Error:', error);
//                 });
//         }

//         // Function to add message to chat
//         function addMessageToChat(text, className) {
//             const messageDiv = document.createElement('div');
//             messageDiv.className = `message ${className} clearfix`;
            
//             const paragraph = document.createElement('p');
//             paragraph.textContent = text;
            
//             messageDiv.appendChild(paragraph);
//             chatMessages.appendChild(messageDiv);
            
//             // Scroll to bottom
//             chatMessages.scrollTop = chatMessages.scrollHeight;
//         }

// //Function to get the AI Coach's response
// async function getCatCoachResponse(userMessage) {
//   try {
//     console.log('Sending message to server:', userMessage);
    
//     const response = await fetch('/api/chat', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ message: userMessage })
//     });
    
//     console.log('Server response status:', response.status);
    
//     if (!response.ok) {
//       // Try to get the error message if available
//       const errorData = await response.json().catch(() => ({}));
//       console.error('Server response error:', errorData);
//       throw new Error('Failed to get response');
//     }
    
//     const data = await response.json();
//     console.log('Response received successfully');
//     return data.response;
//   } catch (error) {
//     console.error('Error in getCatCoachResponse:', error);
//     throw error;
//   }
// }