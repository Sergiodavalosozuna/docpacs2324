const socket = io('http://172.16.3.110:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
})
const participantsList = document.getElementById('participants-list')

socket.on('user-connected', name => {
    appendMessage(`${name} connected`)
    appendParticipant(name);
})

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`)
    removeParticipant(name);
})


messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    if (message.trim() === '') {
        return;
    }
    appendMessage(`You: ${message}: -- ${new Date().toLocaleTimeString()}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
})

function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}