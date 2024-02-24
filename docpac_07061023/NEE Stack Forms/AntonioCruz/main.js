const express = require('express')
const ejs = require('ejs')
const app = express()
const path = require('path');

PORT = 3000

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/end', (req, res) => {
    

})
app.listen(PORT, () => {
    console.log(`You are currently running on port ${PORT}.`);
})