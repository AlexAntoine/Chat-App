const socket = io();

//Elements

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

const $sendLocationButton = document.querySelector('#send-location');

const $messages = document.querySelector('#messages');
const $location = document.querySelector('#location');

const messageTemplates = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;



$messageForm.addEventListener('submit',(response)=>{
    response.preventDefault();

    const message = response.target.elements.message.value;

    // disable form when submitted
    $messageFormButton.setAttribute('disabled','disabled');

    socket.emit('sendMessage', message, (error)=>{
        //enable form
        setTimeout(()=>{
            $messageFormButton.removeAttribute('disabled');
        },1000);

       $messageFormInput.value = '';
        $messageFormInput.focus();
       

        if(error)
        {
           return console.log(error)
        }
        console.log('the message was delivered');
    })

});

socket.on('locationMessage', (location)=>{

    console.log(location);

    const html = Mustache.render(locationTemplate,{
        location
    });

    $location.insertAdjacentHTML('beforeend', html);
})

socket.on('message', (message)=>{

    console.log(message);

    const html = Mustache.render(messageTemplates,{
        message
    });
    
    $messages.insertAdjacentHTML('beforeend', html);
});

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
