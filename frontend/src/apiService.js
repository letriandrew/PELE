import axios from 'axios';


const API_URL = "http://localhost:8000/api" 
//const API_URL = "http://44.204.12.0/api"
//const API_URL = "https://pele.lol/api"

const apiService = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true // added for when we get to the jwt usage with cookies
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
        return error;
    }
}

async function signInUser(body){
    try {
        const response = await apiService.post('/auth/login',{
            email: body.email,
            password: body.password
        })
        return response
    } catch (error) {
        console.error("Error during user sign in:", error);
        return error;
    }
}

async function signOutUser(){
    try {
        const response = await apiService.get('/auth/logout')
        return response
    } catch (error) {
        console.error("Error during user sign out:", error);
        return error;
    }
}

async function verifyToken(){
    try {
        const response = await apiService.get('/auth/verifyToken')
        return response
    } catch (error) {
        console.error("Verification error:", error);
        return error;
    }
}

async function getStudySets(){
    try {
        const response = await apiService.get('/study-set/get-sets')
        return response
    } catch (error) {
        console.error("Error Retrieving study sets:", error);
        return error;
    }
}

async function handleQuestionComplete(new_id_list){
    try {
        const response = await apiService.patch('/question/handle-complete',{
            id_list: new_id_list
        })
        return response
    } catch (error) {
        console.error("Error updating question completion status:", error);
        return error;
    }
}

async function saveStudySet(new_title, new_transcript, new_questions) {
    try {
        const formattedQuestions = new_questions.map(question => ({ question }));

        const response = await apiService.post('/study-set/save-set', {
            title: new_title,
            transcript: new_transcript,
            questions: formattedQuestions
        });

        return response;
    } catch (error) {
        console.error("Error saving study set:", error);
        return error;
    }
}

async function sendAudio(formData, num_questions = 5) {
    try {
        // Send POST request to FastAPI backend
        const response = await axios.post(API_URL+`/gen/process-audio/${num_questions}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        });
        
        // Handle response (e.g., display the text received from the backend)
        console.log('Response from backend:', response.data);

        return response
      
      } catch (error) {
        console.error('Error sending audio:', error);
      }
}

async function deleteStudySet(id) {
    try {
        const response = await apiService.delete('study-set/delete-set/'+id);

        return response;
    } catch (error) {
        console.error("Error deleting study set:", error);
        return error;
    }
}

async function changeTitle(id, title) {
    try {
        const response = await apiService.patch('/transcript/change-title', {
            id: id,
            title: title
        });

        return response;
    } catch (error) {
        console.error("Error changing title:", error);
        return error;
    }
}

async function LoginSignUpGoogle(token){
    try{
       const response = await apiService.post(`/auth/login-signup-google`, {
            token: token
        });
        return response
    }
    catch(error){
        console.log("Error logging in / signing up with google",error);
        return error
    }
}

export {signUpUser, signInUser, signOutUser, verifyToken, getStudySets, handleQuestionComplete, saveStudySet, sendAudio, deleteStudySet, changeTitle, LoginSignUpGoogle}
