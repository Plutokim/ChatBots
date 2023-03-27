import { useState } from 'react';

import './messageForm.scss'

const MessageForm = ({onMessage}) => {
    const [message, setMessage] = useState('');

    const validateInput = () => {
        return !(message.length !== 0 && message.trim().length !== 0)
    }

    
    return(
        <form className="messagesForm">
        <input 
            className='msgInput' 
            type="text" 
            placeholder='Start chatting!' 
            onChange={(e)=>setMessage(e.target.value)}
            value={message}/>
        <button 
            className='msgButton'
            onClick={(e)=>{onMessage(e, message); setMessage('')}}
            disabled={validateInput()}>
                Send message
            </button>
        </form>
    );
}

export default MessageForm;