const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

const $messages = document.querySelector('#messages');
const $location = document.querySelector('#location');

//Templates
const messageTemplates = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;


//Options
const {username, room} = Qs.parse(location.search,{ ignoreQueryPrefix: true });

const autoScroll = ()=>{
    //New message element 
    const $newMessage = $messages.lastElementChild

    console.log('value of $newMessages ', $newMessage);

    // Get the height of new message
    const newMessageStyles = getComputedStyle($newMessage);

    // console.log('newMessageStyles: ', newMessageStyles);

    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    console.log('newMessageMargin: ', newMessageMargin);

    //something is wrong with this 
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    console.log('newMessage offSetHeight: ',$newMessage.offsetHeight);
    
    //newMessageHeight is NaN
    console.log('newMessageHeight: ', newMessageHeight);

    //visible Height
    const visibleHeight = $messages.offsetHeight;

    console.log('visibleHeight: ', visibleHeight);

    //Height of messages container
    const containerheight = $messages.scrollHeight

    //How far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    console.log('scrollOfSet: ', scrollOffset);

    if(containerheight - newMessageHeight <= scrollOffset){

        console.log('if statment code reaced her ');

        console.log('diff of containerHeight and newMessageHeight');

        $messages.scrollTop = $messages.scrollHeight
    }

    // console.log(newMessageMargin);
}

$messageForm.addEventListener('submit',(response)=>{
    response.preventDefault();

    const message = response.target.elements.message.value;

    // disable form when submitted

    // $messageFormButton.setAttribute('disabled','disabled');

    socket.emit('sendMessage', message, (error)=>{
        //enable form

        // setTimeout(()=>{
        //     $messageFormButton.removeAttribute('disabled');
        // },1000);

       $messageFormInput.value = '';
       $messageFormInput.focus();
       

        if(error)
        {
           return console.log(error)
        }
        console.log('the message was delivered');
    })

});

socket.on('message', ({username, text, createdAt})=>{

    // console.log(message);

    const html = Mustache.render(messageTemplates,{
        username,
        text,
        createdAt: moment(createdAt).format('h:mm a') 
    });
    
    $messages.insertAdjacentHTML('beforeend', html);

    autoScroll();
});

socket.on('locationMessage', (message)=>{

    console.log(message);

    const html = Mustache.render(locationTemplate,{
       username: message.username,
       location:message.location,
       createdAt: moment(message.createdAt).format('h:mm a'),

    });

    $location.insertAdjacentHTML('beforeend', html);

    autoScroll();
});

socket.on('roomData',({room, users})=>{

    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    });

    document.querySelector('#sidebar').innerHTML = html
    console.log(room);
    console.log(users);
})



$sendLocationButton.addEventListener('click',()=>{
   
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser'); 
    }

    //disable
    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position)=>{

        const {latitude, longitude}= position.coords;

        const location ={
            latitude, longitude
        }
       
        socket.emit('sendLocation', location, (message)=>{

            //enable
            setTimeout(()=>{

                $sendLocationButton.removeAttribute('disabled');
            },1000);

            console.log('Client: location was sent.');
            console.log(message);
        })
       
    });
});

socket.emit('join', {username, room}, (error)=>{
    
    if(error){
        alert(error);

        location.href = '/'; 
    }
}); 
