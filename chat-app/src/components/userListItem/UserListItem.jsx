import './userListItem.scss'

const UserListItem = ({username, toggleValue,bio, avatarUrl,onUserSelect, newMsg}) => {
    const statusImg = toggleValue === 'online'? <img src='https://res.cloudinary.com/dfi2xji85/image/upload/v1679604727/Chat/online1_aagwdb.png' alt='online' className="avatarStatus" /> : null;
    const userBio = bio.length >=30? `${bio.slice(0,30)}...` : bio
    const notification = newMsg? "You got new message!":userBio;
    const notificationStyle = newMsg? "notification new": "notification";
    return(<li className="user" onClick={onUserSelect}>
        <div className="avatar">
            <img src={avatarUrl} alt={`${username} avatar`} className="avatarImage" />
            {statusImg}
        </div>
        <div className="info">
            <h5 className="username">{username}</h5>
            <p className={notificationStyle}>{notification}</p>
        </div>
    </li>);
}

export default UserListItem;