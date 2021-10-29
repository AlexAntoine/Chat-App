const users = [];

/*** Add User ***/ 

const addUser = ({id, username, room})=>{
    
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase();

    //validate the data 
    if(!username || !room){
        return {
            error: 'username and room are required'
        }
    }

    //check for existing user
    const existingUser = users.find((user)=>{

        return user.room === room && user.username === username
    });

    //validate username
    if(existingUser)
    {
        return {
            error: 'Username is in use'
        }
    }

   const user = {id, username, room}

   users.push(user)

   return {user}
}
/*** Remove User ***/ 

const removeUser  = (id)=>{

    const index = users.findIndex((user)=>{

        return user.id === id
    });

    if(index != -1)
    {
        return users.splice(index, 1)[0];
    }
}
/*** Get User ***/ 

const getUser = (id)=>{

    return users.find((user)=> user.id === id);

}

/*** Get Users In Room ***/ 

const getUsersInRoom = (roomName)=>{

   return  users.filter((user) => user.room == roomName);
}

module.exports = {

    addUser,
    removeUser,
    getUser,
    getUsersInRoom

}