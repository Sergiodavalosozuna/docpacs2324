const socket = io('http://172.16.3.142:5000')
const messageContainer = document.getElementById('messageContainer')
const messageForm = document.getElementById('sendContainer')
const messageInput= document.getElementById('messageBox')

const newName = prompt("what is your name?")
appendMessage('You Joined')
socket.emit('new-user', newName)

socket.on('chat-message', data => {
    appendMessage(`${data.newName}: ${data.message} \n ${data.date}`)
})

socket.on('user-connected', newName => {
    appendMessage(`${newName} connected`)
})

socket.on('user-disconnected', newName => {
    appendMessage(`${newName} disconnected`)
})
messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
})

function appendMessage(message){
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)

}