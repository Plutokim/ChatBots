import {useHttp} from "../hooks/http.hook";

const ChatService = () => {
    const request = useHttp();
    const _apiBase= 'http://localhost:8080';





    const getAllUsers = async () => {
        const response = await request(`${_apiBase}/users`);
        return response;
    }

    const getRandomUser = async () => {
        const response = await request(`${_apiBase}/randomUser`);
        return response;
    }

    const getOnlineUsers = async () => {
        const response = await request(`${_apiBase}/usersOnline`);
        return response;
    }

    const getUserDialogs = async (username) => {
        const response = await request(`${_apiBase}/dialogs/${username}`);
        return response;
    }

    return {getAllUsers, getRandomUser, getOnlineUsers, getUserDialogs}

}

export default ChatService;