
module.exports.chatSockets =(socketServer)=>{
    let io = require('socket.io')(socketServer,{
        cors:{
            origin:"*"
        }
    });

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect',function(){
            console.log(`socket connection disconnected`)
        });

        socket.on('join_room',(data)=>{
            console.log('join room request received with data', data);

            //if chat room is created then it'll join to that room otherwise create
            socket.join(data.chatroom)

            //server emits that the user has joined 
            io.in(data.chatroom).emit('user_joined',data)
        })

        // CHANGE :: detect send_message and broadcast to everyone in the room
        socket.on('send_message', function(data){
        io.in(data.chatroom).emit('receive_message', data);
        });
    });
}



