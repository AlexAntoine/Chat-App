const path = require('path');
const http = require('http');
const express = require('express')
const socketIo = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, generateLocationMessage} =  require('./utils/messages');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/user');
const { isRegExp } = require('util');

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

    socket.on('join',({username, room}, callback)=>{

       const {error, user} =  addUser({id:socket.id,username, room})

       if(error){
           return callback(error)
       }

        //can only use this on the server
        socket.join(user.room);

        socket.emit('message', generateMessage('Admin','Welcome!'));

        socket.broadcast.to(user.room).emit('message', generateMessage('Admin ',`${user.username} has joined the chat!`));

        callback();
    }) 

    /* Receives message from user */
    socket.on('sendMessage', (message, callback)=>{

        const filter = new Filter();

        if(filter.isProfane(message))
        {
            return callback('profanity is not allowed')
        }

        const user = getUser(socket.id);


        /* send message to everyone connected */
        io.to(user.room).emit('message', generateMessage(user.username,message));
        callback();
    });

    /* send message to everyone expect the current user connected when a user disconnects */
    socket.on('disconnect', ()=>{

        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left`));
        }
        
    });

    socket.on('sendLocation',({latitude, longitude}, callback)=>{

        const user = getUser(socket.id);

        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username, `https://google.com/maps?q=${latitude},${longitude}`) );

        callback('Server: Server recieved location.');

    });

   
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})