import { createContext, memo, useContext, useEffect, useState } from 'react';
import { getToken } from '../Services/CookieService';
import { ToastContext } from './ToastContext';
import { useNavigate } from 'react-router-dom';

const Context = createContext();

function ContextProvider({ children, isAuthenticated }) {
    const [userDetails, setUserDetails] = useState({
        id: '',
        username: '',
        firstName: '',
        lastName: '',
        dob: '',
        picture: '',
        location: '',
        phone: '',
        email: '',
    });
    const [toggleReloadContext, setToggleReoadContext] = useState(false);
    const toastContextValue = useContext(ToastContext);
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };
    const nav = useNavigate();

    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) nav('/login');
        const getUserDetails = async (accessToken) => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}users/myInfo`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            if (data.code !== 1000) addMessage(false, data?.errMessage || data?.message);
            else setUserDetails(data.result);
        };
        isAuthenticated && getUserDetails(accessToken);
    }, [toggleReloadContext]);

    return <Context.Provider value={{ userDetails, setToggleReoadContext }}>{children}</Context.Provider>;
}

export default memo(ContextProvider);

export { Context };
