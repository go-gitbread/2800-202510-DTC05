const chatMessages = document.getElementById('chat-messages')
const messageText = document.getElementById('message-text')
const sendButton = document.getElementById('send-button')

//Event listeners for the messege Send button
sendButton.addEventListener('click', sendMessage);
//Send message if the user presses enter  
messageText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); //Prevent the default behaviour of inserting a new line when 'Enter' is pressed
            sendMessage();
        }
    });

//Function for sending message to cat coach
function sendMessage(){
    const message = messageText.value.trim() //Get the inputted message value
    if (!message) return; //If there is no message, do nothing & exit function
    addMessageToChat(message,'user-message') //Add message to chat as a user message
    messageText.value = ''; //Clear the message from the input box

            // Create an indicator to show the AI is responding (while the response is loading)
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading clearfix';
            loadingDiv.textContent = 'Whiskers is typing...';
            chatMessages.appendChild(loadingDiv)

            //Scroll to the bottom every time a message is added
            chatMessages.scrollTop = chatMessages.scrollHeight; 

            //Call helper function to retrieve the response from AI
            getCatCoachResponse(message).then(response =>{
            //Once the response has been recieved...
            chatMessages.removeChild(loadingDiv) // Remove the loading indicator
            addMessageToChat(response, 'coach-message') // Add the response as a coach-message (for different styling)
            })
        }

//Helper function to add messages to the chat
function addMessageToChat(text, className) { //Function accepts the message, and who it's from 
    const messageDiv = document.createElement('div'); //Create a new message div 

    //Apply the given className to the message div to distinguish it from user or AI
    messageDiv.className = `message ${className} clearfix`; 
            
    //Create a new p element to contain the message text
    const paragraph = document.createElement('p'); 
    paragraph.textContent = text;
            
    messageDiv.appendChild(paragraph); //Append the message text to the message div
    chatMessages.appendChild(messageDiv); //Append the message div to the chatbox
            
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

//Function to send the user's message to the server to get a response from OpenAI
async function getCatCoachResponse(userMessage) {
    try {
    console.log('Sending message to server:', userMessage);
    
    // Send a fetch POST request to the backend with the user's message
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage }) //Pass the userMessage to the server as a JSON
    });
    
    console.log('Server response status:', response.status);
    
    const data = await response.json();
    console.log('Response received successfully');
    return data.response;
  } catch (error) {
    console.error('Error in getCatCoachResponse:', error);
    throw error;
  }
}