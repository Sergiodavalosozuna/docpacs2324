const socket = io('http://172.16.3.108:3000');
const messageContainer = document.getElementById('message-container');
const userContainer = document.getElementById('user-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const name = prompt("What's your hacker name?(Ethical hacker of course :nerd_emoji:)");
appendMessage('You have joined the chat');

socket.emit('new-user', name);

socket.on('chat-message', data => {
  appendMessage(`${data.date}: ${data.name}: ${data.message}`)
});

socket.on('user-connected', name => {
  appendUser()
  appendMessage(name + ' has joined the chat')
});

socket.on('user-disconnected', name => {
  appendMessage(name + ' has left the chat')
});

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message);
    messageInput.value = '';
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}