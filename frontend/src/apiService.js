import axios from 'axios';


const API_URL = "http://localhost:8000" // probs better to use .env to store this

const apiService = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    "withCredentials": true // added for when we get to the jwt usage with cookies
});

async function signUpUser(body){
    try {
        const response = await apiService.post('/users',{
            email: body.email,
            name: body.name,
            password: body.password
        })
        return response
    } catch (error) {
        console.error("Error during user sign up:", error);
        return error.response;
    }
}

export {signUpUser}