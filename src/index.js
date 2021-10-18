const path = require('path');
const http = require('http');
const express = require('express')
const socketIo = require('socket.io');

const app = express();

/* socket.io expect raw http server. Express does not give access to that hence the refactored code  */
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath));

let count = 0; 

io.on('connection', (socket)=>{

    console.log('new websocket connection');

    socket.emit('countUpdated',count);

    socket.on('increment', ()=>{
        count++;

        // socket.emit('countUpdated', count);
        io.emit('countUpdated', count);
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})