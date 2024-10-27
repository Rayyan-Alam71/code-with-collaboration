import { io } from "socket.io-client";

export const initSocket = async ()=> {
    const options={
        'force new connection':true,
        reconnectionAttemp:'Infinit',
        timeout:10000,
        transports:['websocket']
    }
    // console.log("starteddd");

    return io("http://localhost:5000", options)
}