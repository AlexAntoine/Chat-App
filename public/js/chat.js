const socket = io();

document.querySelector('#message-form').addEventListener('submit',(response)=>{
    response.preventDefault();

    const message = response.target.elements.message.value;

    socket.emit('sendMessage', message)

});

socket.on('message', (message)=>{

    console.log(message);
});

// socket.on('new-message', (message)=>{
//     console.log(message);
// })
