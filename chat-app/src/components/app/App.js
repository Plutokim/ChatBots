import { useEffect, useReducer } from 'react';
import AppHeader from '../appHeader/AppHeader'
import socket from '../../socket';
import ChatService from '../../services/ChatService';
import reducer from '../../reducer';

import './app.scss'
import UserList from '../userList/UserList';
import Chat from '../chat/Chat';
import ChooseChat from '../chooseChat/ChooseChat';

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    user: {},
    selectedUser: undefined,
    currentDialog: undefined,
    isSelected: false,
    usersOnline: [],
    newMessagesBy: [],
    dialogs: new Map(), 
  });
  const {getRandomUser, getOnlineUsers, getUserDialogs} = ChatService();

  useEffect(()=> {
    getRandomUser()
        .then(onLogin);

    socket.on('USER:ONLINE', setData);
    getUserDialogs(state.user.username)
              .then(dialogs => {
                dispatch({
                  type: 'DIALOG:UPDATE',
                  payload: new Map(dialogs)
                })
              })
    getOnlineUsers()
              .then(users => {
                const filtered = filterUsers(users, state.user.username);
                setData(filtered);
              });

    socket.on('USER:OFFLINE',setData);

    socket.on('USER:NEW_MESSAGE', dialogs => {
      dispatch({
        type: 'DIALOG:UPDATE',
        payload: new Map(dialogs)
      })
    })
    socket.on('USER:NOTIFY', user => {
      dispatch({
        type: 'MESSAGE_BY:UPDATE',
        payload: user
      })
    });



  // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const {selectedUser, usersOnline} = state;
    if (selectedUser) {
      const searchedUser = usersOnline.filter(user => user.username === selectedUser.username);
      if(searchedUser.length === 0){
        const updatedUser = {
          ...selectedUser,
          online: false,
          socket: undefined
        };
        updateSelectedUser(updatedUser);
      }else{
        const [updatedUser] = searchedUser;
        updateSelectedUser(updatedUser);
      }
    }


   // eslint-disable-next-line  
  },[state.usersOnline])

  const onLogin = async (user) => {
    dispatch({
      type: 'JOINED',
      payload: user
    })
    socket.auth = {user}
    socket.connect();
  }

  const setData = (users) => {
    dispatch({
      type: 'SET_DATA',
      payload: users
    })
  }

  const updateSelectedUser = (user) => {
    dispatch({
      type: 'SELECTED_USER:UPDATE_DATA',
      payload: user,
    })
  }

  const filterUsers = (usersArray, username) => {
    return usersArray.filter(user => user.username !== username)
  }

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  const getDialog = (user1,user2) => {
    user1 = user1.split(' ').join('');
    user2 = user2.split(' ').join('');
    const dialogName = [user1, user2].sort().join('__AND__');
    return dialogName;
  }

  const addMessage = (message) => {
    const dialogs = new Map(state.dialogs);
    const {dialog , by,time, msg} = message;
    if(!dialogs.has(message.dialog)){
      dialogs.set(message.dialog, []);
    }
    const newMessage = {
      by,
      time,
      msg
    }
    dialogs.get(dialog).push(newMessage);
    dispatch({
      type: 'DIALOG:UPDATE',
      payload: dialogs
    })

  }

  const onUserSelect = (selectedUser) => {
    const dialogs = new Map(state.dialogs);
    const newMessagesBy = state.newMessagesBy.filter(user => user !== selectedUser.username);
    const {user} = state;
    const dialog = getDialog(user.username, selectedUser.username);
    if(!state.dialogs.has(dialog)){
      dialogs.set(dialog, []);
    }
    dispatch({
        type: 'USER_AND_DIALOG:SELECT',
        payload: {
          selectedUser,
          dialog,
          dialogs,
          newMessagesBy
        }
      })
    }

  const onMessage=(e, message) => {
    e.preventDefault();
    const {user, selectedUser, currentDialog} = state;
    const time = formatAMPM(new Date());
    let newMessage = {
        dialog: currentDialog,
        by: user.username,
        time,
        msg: message
      }  
    addMessage(newMessage);
    newMessage.to = selectedUser.socket;
    if (selectedUser.bot) {
      newMessage = {
        ...newMessage,
        bot: selectedUser.username,
        to: socket.id
      }
    }
    socket.emit("USER:NEW_MESSAGE", newMessage)
  }


  return (<>
  <AppHeader/>
  <main className='mainChatWindow'>
  {state.isSelected?<Chat onMessage={onMessage} selectedUser={state.selectedUser} currentDialog={state.currentDialog} dialogs={state.dialogs} />:<ChooseChat/>}
  <UserList state={state} onUserSelect={onUserSelect}></UserList>
  </main>
  </>);
}

export default App;
