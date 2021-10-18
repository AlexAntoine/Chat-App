const socket = io();

document.querySelector('#message-form').addEventListener('submit',(response)=>{
    response.preventDefault();

    const message = response.target.elements.message.value;

    socket.emit('sendMessage', message)

});

socket.on('message', (message)=>{

    console.log(message);
});

document.querySelector('#send-location').addEventListener('click',()=>{
   
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser'); 
    }

    navigator.geolocation.getCurrentPosition((position)=>{

        const {latitude, longitude}= position.coords;

        const location ={
            latitude, longitude
        }
       
        socket.emit('sendLocation', location )
       
    });
});
