import express from "express";
import { createServer } from "http";
import {Server} from 'socket.io'
import ACTIONS from "./src/Actions.js";

const PORT = process.env.PORT || 5000;
const app= express()
const server = createServer(app)

const io = new Server(server);

const userSocketMap = {}

function getAllConnectedClient(roomId){
    //map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            username : userSocketMap[socketId]
        }
    })
    // ⬆ this will return all the clients/sockets with the roomId = specified roomId so that we could notify them
} 

app.get('/', (req, res)=>{
    res.send("hello");
})

io.on('connection', (socket)=>{
    console.log(`socket connected with ID : ${socket.id}`)

    socket.on(ACTIONS.JOIN , ({roomId, username})=>{
        userSocketMap[socket.id] = username 
        socket.join(roomId);
        const clients = getAllConnectedClient(roomId)
        console.log(clients)
        clients.forEach(({socketId})=> {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId : socket.id
            })
        });
    })
    
    socket.on(ACTIONS.CODE_CHANGE, ({roomId, newCode})=>{
        console.log(newCode)
        io.to(roomId).emit(ACTIONS.CODE_CHANGE, newCode)
        // io.to(roomId).emit('update-code', codeState)
        // socket.broadcast.emit('update-code', codeState)
    })

    socket.on('disconnecting', ()=>{
        const rooms = [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId : socket.id,
                username : userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id]
        socket.leave();
    })
    
})

server.listen(PORT, ()=>console.log(`server listening on port ${PORT}`))