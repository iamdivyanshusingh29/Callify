import { Server } from "socket.io";
import cors from "cors";

let connections = {};
let messages = {};
let timeOnline = {};


export const connectToServer  = (server) =>  {
    const  io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET","POST"],
            allowedHeaders: ["*"],
            credentials: true 
        }
    });

    io.on("connection" , (socket) => {

        console.log("SomeThing Connected");

        socket.on("join-call", (path) => {
            if(connections[path] === undefined) {
                connections[path] = [];
            }

            if (connections[path].length >= 2) {
                socket.emit("room-full");
                return;
            }

            if (connections[path].includes(socket.id)) return;

            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            connections[path].forEach((id) => {
                io.to(id).emit("user-joined", socket.id , connections[path]);
            });

            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                        messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }

        });
        socket.on("signal", (toId , message) => {
            io.to(toId).emit("signal",socket.id , message);
        });
        socket.on("chat-message", (data, sender) => {
            const [matchingRoom , found] = Object.entries(connections)
            .reduce(([room , isFound] , [roomKey , roomValue]) => {
                if(!isFound && roomValue.includes(socket.id)) {
                    return [roomKey , true];
                }
                return [room , isFound]
            },["" , false]);

            if(found===true){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id });

                console.log('message', matchingRoom , ":" , sender , data);

                connections[matchingRoom].forEach((room) => {
                    io.to(room).emit("chat-message",data,sender,socket.id);
                });
            }
        });
        socket.on("disconnect", () => {
            let key;

            for (const k in connections) {
                if (connections[k].includes(socket.id)) {
                    key = k;
                    break;
                }
            }

            if (key) {
                connections[key] = connections[key].filter((id) => id !== socket.id);

                connections[key].forEach((id) => {
                    io.to(id).emit("user-left" , socket.id);
                });

                if (connections[key].length === 0) {
                    delete connections[key];
                    delete messages[key];
                }
            }
            delete timeOnline[socket.id];
        });
    });

    return io;
}