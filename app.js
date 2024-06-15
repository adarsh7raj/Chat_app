 const express=require("express");
const app=express();
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

const server=app.listen("3000",function(){ console.log("Server is on port:3000")});

const io=require("socket.io")(server);

app.use(express.static("public"));
let socketconnected=new Set();// js set is used store unique values .

io.on("connection",onconnection);
function onconnection(socket){// here is the function emits the data to the clients several times.
    socketconnected.add(socket.id);
    io.emit("total_client",socketconnected.size);//i.emit() is used to send some data to all the conected clients.
    socket.on("disconnect",()=>{
        console.log("client disconnected:"+socket.id);
        socketconnected.delete(socket.id);// 
io.emit(" total_client",socketconnected.size);
    });
    socket.on("message_value",(data)=>{
//console.log(data);                                                      
socket.broadcast.emit("message_data",data);//used to emit the data to all the connected clients except the client who esnd that message.
  
});
 socket.on("feedback",(status)=>{
    socket.broadcast.emit("who_typing",status);
 })  
}



// const input=document.getElementById("input");
//     input.innerHTML="hello";
// const WebSocket = require("ws");
// const wss = new WebSocket.Server({ port:3000});

// wss.on("connection", function (ws) {
//     console.log("Client is connected");

//     ws.on("close", function () {
//         console.log("Client is disconnected");
//     });

//     ws.on("message", (data) => {
//         console.log("Client sent a message:" +data);
//     });
//     ws.send("hello ,i am fine");
    
// });
