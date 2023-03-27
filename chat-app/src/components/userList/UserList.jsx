import { useEffect, useState } from "react";
import ChatService from "../../services/ChatService";
import SearchPanel from "../searchPanel/SearchPanel";
import UserListItem from "../userListItem/UserListItem";

import './userList.scss'


const UserList = ({state, onUserSelect}) => {
    const {getAllUsers} = ChatService();

    const [usersOnlineList, setUsersOnlineList] = useState([]);
    const [usersAllList, setUsersAllList] = useState([]);
    const [toggle, setToggle] = useState('online');
    const [term, setTerm] = useState('');

    const {user, usersOnline, newMessagesBy,selectedUser} = state;

    useEffect(()=>{
        if(user.username){
            getAllUsers()
                    .then(setAll)
        }

        if(usersOnline.length > 0){
            const filtered =  filterUsers(usersOnline, user.username); 
            setUsersOnlineList(filtered);
        }
    
    // eslint-disable-next-line
    },[state])


    const setAll = (users) => {
        const filtered =  filterUsers(users, user.username); 
        setUsersAllList(filtered)
    }

    const filterUsers = (usersArray, username) => {
        return usersArray.filter(user => user.username !== username)
    }


    const searchUser = (users, term) => {
        if( term.length === 0) return users;
  
        return users.filter(user => user.username.toLowerCase().indexOf(term) > -1)
    }
  
    const onUpdateSearch = (term) => {
      setTerm(term);
    }

    const allCategoryStyle = toggle === 'all'? "categoryBtn active":"categoryBtn inactive";
    const onlineCategoryStyle = toggle === 'online'? "categoryBtn active":"categoryBtn inactive";
    const visibleAll = searchUser(usersAllList, term);
    const visibleOnline = searchUser(usersOnlineList, term);

    return(
       <nav className="userListSection">
        <div className="userCategories">
            <button className={onlineCategoryStyle} onClick={()=> setToggle('online')}>Online</button>
            <button className={allCategoryStyle} onClick={()=> setToggle('all')}>All</button>
        </div>
        <ul className="userList">
            {
                toggle === 'all'? 
                visibleAll.map((user,index) => <UserListItem 
                                        onUserSelect={()=>onUserSelect(user)}
                                        key={`${user.username+index}`}
                                        toggleValue={toggle}
                                        bio={user.bio}
                                        avatarUrl={user.avatar} 
                                        username={user.username}/>) : 
                visibleOnline.map((user,index) => {
                    let newMsg = false;
                    if(newMessagesBy.indexOf(user.username) !== -1){
                        if(selectedUser){
                            if(selectedUser.username !== user.username){
                                newMsg = true;   
                            }
                        }else{
                            newMsg = true;
                        }
                    }
                    return <UserListItem
                    onUserSelect={()=>onUserSelect(user)}
                    key={`${user.username+index}`}
                    toggleValue={toggle}
                    bio={user.bio}
                    avatarUrl={user.avatar} 
                    username={user.username}
                    newMsg={newMsg}
                    />
                })
            }
        </ul>
        <SearchPanel updateTerm={onUpdateSearch}/>
       </nav>
    );
}

export default UserList;