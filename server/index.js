const express = require('express');
const cors = require('cors')
const app = express();
const {nanoid} = require('nanoid');
app.use(cors());
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

app.use(express.json());

const users = [
    {id: "11",
     username: "Sheldon Pattison",
     bio: "Hi, my name is Sheldon",
     avatar: "https://res.cloudinary.com/dfi2xji85/image/upload/v1679605058/Chat/2_cf1kly.png",
     bot: false,
     online: false,
     socket: undefined
    },
    {id: "12",
     username: "Albert Quackis",
     bio: "IDK what to write in my bio",
     avatar: "https://res.cloudinary.com/dfi2xji85/image/upload/v1679605058/Chat/3_oeuigc.png",
     bot: false,
     online: false,
     socket: undefined
    },
    {id: "13",
     username: "Robertto Buritos",
     bio: "I love Buritos!",
     avatar: "https://res.cloudinary.com/dfi2xji85/image/upload/v1679605058/Chat/4_c63iiy.png",
     bot: false,
     online: false,
     socket: undefined
    },
    {id: "14",
     username: "Kebab Cologne",
     bio: "A successful person is someone who sets and achieves goals. Some people may define success as being happy and fulfilled, while others may define it as having status and accomplishments. And that's who am I :)",
     avatar: "https://res.cloudinary.com/dfi2xji85/image/upload/v1679605058/Chat/5_wqmlm8.png",
     bot: false,
     online: false,
     socket: undefined
    },
    {id: "15",
     username: "Echo bot",
     bio:"Any message is answered with the same message.",
     avatar: "https://res.cloudinary.com/dfi2xji85/image/upload/v1679604700/Chat/echo_gyln1n.png",
     bot: true,
     online: true,
     socket: undefined
    },
    {id: "16",
     username: "Reverse bot",
     bio:"Any message is answered with the same message, but inverted.",
     avatar: "https://res.cloudinary.com/dfi2xji85/image/upload/v1679604695/Chat/reverse_oaz2cd.png",
     bot: true,
     online: true,
     socket: undefined
    },
    {id: "17",
     username: "Spam bot",
     bio:"Ignores everything you write to him. Every 10-120 seconds he writes something to the chat.",
     avatar: "https://res.cloudinary.com/dfi2xji85/image/upload/v1679604694/Chat/spam_mjzuan.png",
     bot: true,
     online: true,
     socket: undefined
    },
    {id: "18",
     username: "Ignore bot",
     bio:"It just ignores everything, does not write anything.",
     avatar: "https://res.cloudinary.com/dfi2xji85/image/upload/v1679604699/Chat/ignore_kd2mv8.png",
     bot: true,
     online: true,
     socket: undefined
    }
]

const onlineUsers = new Map();

onlineUsers.set('Echo bot',users[4]);
onlineUsers.set('Reverse bot',users[5]);
onlineUsers.set('Spam bot',users[6]);
onlineUsers.set('Ignore bot',users[7])

const randomNumber = (min, max) => {
    let number = min + Math.random() * (max - min);
    return Math.floor(number);
}


const history = new Map();
const intervals = new Map();

app.get('/randomUser', (req, res) => {
    const filteredUsers = users.filter(user => !user.bot && !user.online);
    if(filteredUsers.length !== 0){
        const number = randomNumber(0, filteredUsers.length);
        filteredUsers[number].online = true;
        res.json(filteredUsers[number]);
    }else{
        const guestId = nanoid(4)
        const guestUser = {
            id: guestId,
            username: `Guest ${guestId}`,
            bio:"I am just a guest with a random ID",
            avatar: "https://res.cloudinary.com/dfi2xji85/image/upload/v1679605058/Chat/1_ouoevj.png",
            bot: false,
            online: true,
            socket: undefined
        }
        users.push(guestUser);
        res.json(guestUser);
    }
    
})

app.get('/users',(req, res) => {
    res.json(users);
})

app.get('/usersOnline', (req, res) => {
    const usersOnline = [...onlineUsers.values()];
    res.json(usersOnline);
})

app.get('/dialogs/:name', (req, res) => {
    const { name: username } = req.params;
    const historyPrivate = history;
    historyPrivate.forEach((key)=>{
        const usernameJoined = username.split(' ').join('')
        if(key.indexOf(usernameJoined) === -1){
        historyPrivate.delete(key)
        }
    });
    res.json([...historyPrivate.entries()]);
})

io.on('connection', (socket) => {
    const user = socket.handshake.auth.user;
    console.log(`User connected, socketId: ${socket.id}`);
    if(user){
        users.forEach(current => {
            if(current.username === user.username){
                current.socket = socket.id;
                onlineUsers.set(socket.id, current);
            }
        });
    }
    const usersOnline = [...onlineUsers.values()]
    socket.broadcast.emit('USER:ONLINE',usersOnline)



    socket.on('USER:NEW_MESSAGE', (data) =>{
        const {dialog, msg, by,  time, to} = data;
        if(!history.has(dialog)){
            history.set(dialog, []);
        }
        let newMessage = {
            by,
            time,
            msg
        }
        history.get(dialog).push(newMessage);
        newMessage.dialog = dialog;
        let historyPrivate;
        if(data.bot){
            switch (data.bot) {
                case 'Echo bot': 
                    newMessage = {
                        ...newMessage,
                        by: data.bot
                    };
                    history.get(dialog).push(newMessage);
                    historyPrivate = history;
                    historyPrivate.forEach((key)=>{
                    const byJoined = by.split(' ').join('')
                    if(key.indexOf(byJoined) === -1){
                        historyPrivate.delete(key)
                    }
                    });
                    socket.emit('USER:NEW_MESSAGE',  [...historyPrivate.entries()]);
                    socket.emit('USER:NOTIFY',  data.bot);
                    break;
                case 'Reverse bot':
                    const messageReverse = msg.split('').reverse().join('');
                    newMessage = {
                        ...newMessage,
                        msg: messageReverse,
                        by: data.bot
                    };
                    history.get(dialog).push(newMessage);
                    historyPrivate = history;
                    historyPrivate.forEach((key)=>{
                    const byJoined = by.split(' ').join('')
                    if(key.indexOf(byJoined) === -1){
                        historyPrivate.delete(key)
                    }
                    });
                    setTimeout( () => {socket.emit('USER:NEW_MESSAGE',  [...historyPrivate.entries()]);
                                        socket.emit('USER:NOTIFY',  data.bot);}, 3000);
                    break;
                case 'Spam bot':
                    let interval1 = setInterval( () => {
                        newMessage = {
                            ...newMessage,
                            msg: 'I LIKE CARROTS!',
                            by: data.bot
                        };
                        history.get(dialog).push(newMessage);
                        historyPrivate = history;
                        historyPrivate.forEach((key)=>{
                        const byJoined = by.split(' ').join('')
                        if(key.indexOf(byJoined) === -1){
                            historyPrivate.delete(key)
                        }
                        });
                        socket.emit('USER:NEW_MESSAGE',  [...historyPrivate.entries()]);
                                        socket.emit('USER:NOTIFY',  data.bot);}, 10000);
                    let interval2 = setInterval( () => {
                        newMessage = {
                            ...newMessage,
                            msg: 'DO YOU KNOW THAT I LIKE CARROTS?',
                            by: data.bot
                        };
                        history.get(dialog).push(newMessage);
                        historyPrivate = history;
                        historyPrivate.forEach((key)=>{
                        const byJoined = by.split(' ').join('')
                        if(key.indexOf(byJoined) === -1){
                            historyPrivate.delete(key)
                        }
                        });
                        socket.emit('USER:NEW_MESSAGE',  [...historyPrivate.entries()]);
                                        socket.emit('USER:NOTIFY',  data.bot);}, 120000);
                        
                    intervals.set(by,[interval1,interval2]);
                    break;
                case 'Ignore bot':
                    break; 
            }
        }else{
            historyPrivate = history;
            historyPrivate.forEach((key)=>{
            const byJoined = by.split(' ').join('')
            if(key.indexOf(byJoined) === -1){
                historyPrivate.delete(key)
            }
            });
            socket.to(to).emit('USER:NEW_MESSAGE',  [...historyPrivate.entries()]);
            socket.to(to).emit('USER:NOTIFY',  by);
        }
    } )
    



    socket.on('disconnect', () => {
        console.log(`User disconnected, socketId: ${socket.id}`);

        users.forEach(user => {
            if(user.socket === socket.id){
                user.socket = undefined;
                user.online = false;
                if(intervals.has(user.username)){
                    intervals.get(user.username).forEach(interval => clearInterval(interval))
                }
            }
        })
        if(onlineUsers.delete(socket.id)){
            const usersOnline = [...onlineUsers.values()]
            socket.broadcast.emit('USER:OFFLINE',usersOnline)
        }
    });

});


server.listen(8080, (err) => {
    if (err) {
      throw Error(err);
    }
    console.log('Server Started!');
  });