const express = require("express")
const app = express()

const path = require("path")
const http = require("http")
const {Server} = require("socket.io")

const server = http.createServer(app)

const io = new Server(server)
app.use(express.static(path.resolve("")))

let arr = []
let playingArr = []

io.on("connection",(socket)=>{

    socket.on("find",(e)=>{

        if(e.name != null){
            
            arr.push(e.name)

            if(arr.length >= 2){
                let p1obj = {
                    p1Name:arr[0],
                    p1Value:"x",
                    p1Move:""
                }
            
                let p2obj = {
                    p2Name:arr[1],
                    p2Value:"o",
                    p2Move:""
                }

                let obj = {
                    p1:p1obj,
                    p2:p2obj
                }
                playingArr.push(obj)

                arr.splice(0,2)

                io.emit("find",{allPlayers:playingArr})

            }
        }
    })
    
    socket.on("playing",(e)=>{
        if(e.value == "x"){
            let objToChange = playingArr.find(obj=>obj.p1.p1Name === e.name)
console.log("objToChange",objToChange);
            objToChange.p1.p1Move = e.id
            objToChange.sum++
        }
        else if(e.value == "o") {
            let objToChange = playingArr.find(obj=>obj.p2.p2Name === e.name)
console.log("objToChange",objToChange);
            objToChange.p2.p2Move = e.id
            objToChange.sum++
        }

        io.emit("playing",{allPlayers:playingArr})
    })

    socket.on("gameOver", (e)=>{
        playingArr = playingArr.filter(obj=>obj.p1.p1Name !== e.name)
        console.log(playingArr);
        console.log("HAHAHAHAHA");
    })
})

app.get("/", (req,res)=>{
    return res.sendFile("indes.html")
})

server.listen(3000,()=>{
    console.log("server on port 3000");
})