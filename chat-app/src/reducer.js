const reducer = (state, action) => {
    const {type, payload} = action; 
    switch (type) {
      case 'JOINED':
        return {
          ...state,
          user: payload
        };
      case 'SET_DATA':
        return {
            ...state,
            usersOnline: payload
        };
      case 'USER_AND_DIALOG:SELECT':
        return {
            ...state,
            selectedUser: payload.selectedUser,
            currentDialog:payload.dialog,
            isSelected: true,
            dialogs: payload.dialogs,
            newMessagesBy:  payload.newMessagesBy
        };
      case 'SELECTED_USER:UPDATE_DATA':
          return {
            ...state,
            selectedUser: payload,
          };
      case 'DIALOG:UPDATE':
        return {
          ...state,
          dialogs: payload,
        };  
      case 'MESSAGE_BY:UPDATE':
          return {
            ...state,
          newMessagesBy: [...new Set([...state.newMessagesBy, payload].filter(user => state.selectedUser?user !== state.selectedUser.username:user))],
          };
      default:
        return state;
    }
  };
  
export default reducer;