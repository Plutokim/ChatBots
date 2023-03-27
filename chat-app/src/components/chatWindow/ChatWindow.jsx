import MessageForm from '../messageForm/MessageForm';
import MessageWindow from '../messageWindow/MessageWindow';

import './chatWindow.scss'

const ChatWindow = ({onMessage, selectedUser, currentDialog, dialogs}) => {
    return(
        <section className='chatWindow'>
            <MessageWindow selectedUser={selectedUser} currentDialog={currentDialog} dialogs={dialogs} />
            <MessageForm onMessage={onMessage}/>
        </section>
    )
}

export default ChatWindow;