import { useState, useEffect, useRef } from 'react';
import Message from '../message/Message';
import EmptyMessages from '../emptyMessages/EmptyMessages'

import './messageWindow.scss'

const MessageWindow = ({selectedUser, currentDialog, dialogs}) => {
    const [dialog, setDialog] = useState([]);
    const messagesRef = useRef(null);

    useEffect(()=>{
        messagesRef.current.scrollTo(0, 99999);
        setDialog(dialogs.get(currentDialog));
    // eslint-disable-next-line         
    },[dialogs])

    useEffect(()=>{
        messagesRef.current.scrollTo(0, 99999);
    },[dialog])

    const messages = !dialog? <EmptyMessages/>: dialog.length === 0?<EmptyMessages/> : dialog.map((message, index) => {
                                                        const style = message.by !== selectedUser.username ? "message sender": "message"; 
                                                        const direction = message.by !== selectedUser.username ? "right": "left";
                                                        return <Message key={`${message.by + index}`} style={style} direction={direction} message={message}/>
                                                        })

    return(
        <ul className='messageWindow' ref={messagesRef}>
            {messages}
        </ul>
    );
}

export default MessageWindow;