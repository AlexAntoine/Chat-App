
const socket =  io();

document.querySelector('#increment').addEventListener('click', ()=>{
    console.log('button was clicked');

    socket.emit('increment');
});

socket.on('countUpdated', (count)=>{

    console.log('count has been updated ', count);
  
   
});