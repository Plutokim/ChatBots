
import './userCard.scss'

const UserCard = ({selectedUser}) => {
    const {username, avatar, bio} = selectedUser;
    return(
        <section className="userCard">
        <img src={avatar} alt={username} className="avatar" />
        <div className="info">
            <h2 className="username">{username}</h2>
            <p className="bio">{bio}</p>
        </div>
       </section>
    );

}

export default UserCard;