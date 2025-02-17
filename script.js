document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.getElementById('chatBody');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
  
    // Function to add a message to the chat
    function addMessage(sender, text) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', sender);
  
      const avatarDiv = document.createElement('div');
      avatarDiv.classList.add('avatar', sender === 'bot' ? 'bot-avatar' : 'user-avatar');
  
      const textDiv = document.createElement('div');
      textDiv.classList.add('text');
      textDiv.textContent = text;
  
      messageDiv.appendChild(avatarDiv);
      messageDiv.appendChild(textDiv);
      chatBody.appendChild(messageDiv);
  
      // Scroll to the bottom of the chat
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  
    // Function to handle the "Send" button click
    async function handleSend() {
      const userText = userInput.value.trim();
  
      if (!userText) return;
  
      // Add the user's message to the chat
      addMessage('user', userText);
  
      // Clear the input field
      userInput.value = '';
  
      try {
        // Send the user's input to the Flask backend
        const response = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch response from server');
        }
  
        const data = await response.json();
  
        if (data.response) {
          // Add the bot's response to the chat
          addMessage('bot', data.response);
        } else if (data.error) {
          addMessage('bot', `Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Error:', error);
        addMessage('bot', 'Something went wrong. Please try again later.');
      }
    }
  
    // Add event listener to the "Send" button
    sendBtn.addEventListener('click', handleSend);
  
    // Allow pressing "Enter" to send the message
    userInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        handleSend();
      }
    });
  });
  