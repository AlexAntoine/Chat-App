const path = require('path');
const http = require('http');
const express = require('express')
const socketIo = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, generateLocationMessage} =  require('./utils/messages');

const app = express();

/* socket.io expect raw http server. Express does not give access to that hence the refactored code  */
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath));

/*
Messages from server to client:

socket.emit() "connected client"
io.emit() "every connected client"
socket.broadcast.emit() "every connect client except for the initial client"
socket.broadcast.to.emit() "send event to event to everyone expect to the initial client in a specific room"
io.to.emit() "emits an event to everybody in a specific room"

 */


/* Connect to socket io */
io.on('connection', (socket)=>{

    /* Receives message from user */
    socket.on('sendMessage', (message, callback)=>{

        const filter = new Filter();

        if(filter.isProfane(message))
        {
            return callback('profanity is not allowed')
        }


        /* send message to everyone connected */
        io.to('boston').emit('message', generateMessage(message));
        callback();
    });

    /* send message to everyone expect the current user connected when a user disconnects */
    socket.on('disconnect', ()=>{
        io.emit('message', generateMessage('A user has left'));
    });

    socket.on('sendLocation',({latitude, longitude}, callback)=>{

        io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`) );

        callback('Server: Server recieved location.');

    });

    socket.on('join',({username, room})=>{

        //can only use this on the server
        socket.join(room);

        socket.emit('message', generateMessage('Welcome!'))

        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined the chat!`));
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})