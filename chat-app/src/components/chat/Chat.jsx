import ChatWindow from '../chatWindow/ChatWindow';
import UserCard from '../userCard/UserCard';
import './chat.scss'

const Chat = ({selectedUser, currentDialog, dialogs, onMessage}) => {
    return(
        <article className="chat">
            <UserCard selectedUser={selectedUser}/>       
            <ChatWindow selectedUser={selectedUser} currentDialog={currentDialog} dialogs={dialogs} onMessage={onMessage}/>
        </article>
    );
}

export default Chat;