import axios from 'axios';
import API_URL from '../config/config'



const signUpApi = (type, fullname, email, username, password, phone) => {
    return axios.post(API_URL.API_URL+ "/signup", {type, fullname, email, username, password, phone})
}

export { signUpApi};