import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port : 8080});


interface User{
    socket: WebSocket;
    room: string
}

let allSockets : User[] = [];


wss.on("connection", (socket) => {

    socket.on("message", (message) => {
        // @ts-ignore 
        const parsedMessage = JSON.parse(message);

     
        if(parsedMessage.type === "join"){
       
            allSockets.push({
                socket,
                room : parsedMessage.payload.roomId
            })
        }

        if (parsedMessage.type  === "chat"){
            let currentUserRoom = null;
            for(let i =0; i<allSockets.length; i++){
                  // @ts-ignore 
                if(allSockets[i].socket === socket){
                      // @ts-ignore 
                    currentUserRoom = allSockets[i].room
                }
            }
                  if(!currentUserRoom) return;
            for(let i =0; i<allSockets.length; i++){
                  // @ts-ignore 
                if(allSockets[i].room === currentUserRoom){
                      // @ts-ignore 
                    allSockets[i].socket.send(parsedMessage.payload.message)
                }
            }
        }
    })
})