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

app.use(express.static(publicDirectoryPath))

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})