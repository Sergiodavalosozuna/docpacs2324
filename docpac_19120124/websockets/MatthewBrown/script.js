const socket = io('http://172.16.3.163:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const nameU = prompt('What is your name?');
appendMessage('You joined');
socket.emit('newUser', nameU);

let userList = document.getElementById('user-list');

socket.on('usersUpdated', users => {
  while (userList.firstChild) {
    userList.removeChild(userList.firstChild);
  }

  users.forEach(user => {
    let userElement = document.createElement('li');
    userElement.innerText = user;
    userList.appendChild(userElement);
  });
});

socket.on('chatMessage', data => {
    appendMessage(`${data.nameU} (${data.timeSent}): ${data.message}`);
})

socket.on('userConnected', nameU => {
    appendMessage(`${nameU} connected`);
})

socket.on('userDisconnected', nameU => {
    appendMessage(`${nameU} disconnected`);
})

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    if (message.trim() === '') {
        // Message is only whitespace, don't send it
        return;
    }
    const timeSent = new Date().toLocaleTimeString();
    appendMessage(`You (${timeSent}): ${message}`);
    socket.emit('sendChatMessage', { message, timeSent });
    messageInput.value = '';
})

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}