const path = require('path');
const http = require('http');
const express = require('express')
const socketIo = require('socket.io');
const Filter = require('bad-words')

const app = express();

/* socket.io expect raw http server. Express does not give access to that hence the refactored code  */
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath));


/* Connect to socket io */
io.on('connection', (socket)=>{

    /* send message to front ent */
    socket.emit('message', 'Welcome!')

    /* send message to everyone expect the current user connected when new user is connected */
    socket.broadcast.emit('message', 'a new user has joined');

    /* Receives message from user */
    socket.on('sendMessage', (message, callback)=>{

        const filter = new Filter();

        if(filter.isProfane(message))
        {
            return callback('profanity is not allowed')
        }


        /* send message to everyone connected */
        io.emit('message', message);
        callback();
    });

    /* send message to everyone expect the current user connected when a user disconnects */
    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left');
    });

    socket.on('sendLocation',({latitude, longitude}, callback)=>{

        io.emit('message', `https://google.com/maps?q=${latitude},${longitude}`);

        callback('Server: Server recieved location.');

    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})