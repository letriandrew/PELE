import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../apiService';
import LoadingScreen from '../components/LoadingScreen';
import { signOutUser } from '../apiService';
import { AuthDispatchContext } from '../context/AuthContext';


const PrivateRouteUser = ({ children }) => {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const authDispatch = React.useContext(AuthDispatchContext)
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await verifyToken();
                if (response.status === 200) {
                    setVerified(true);
                }
                else{
                    sessionStorage.removeItem('user');
                    authDispatch({type:'reset'})
                    await signOutUser()
                }
            } catch (error) {
                console.error("Role verification failed:", error);
            } finally {
                setLoading(false);
            }
        };

        verify();
    },[]);

    if (loading) {
        return <LoadingScreen/>  
    }

    return verified ? children : (navigate('/signIn'), null);
};

export default PrivateRouteUser;
