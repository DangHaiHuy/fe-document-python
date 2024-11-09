import { memo, useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../../Services/CookieService';
import Loading from '../Loading';
import ContextProvider from '../../Context';
import { ToastContext } from '../../Context/ToastContext';

function PrivateRoute({ children, layout: Layout }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null, true, or false
    const [loading, setLoading] = useState(true);
    const toastContextValue = useContext(ToastContext);
    const navigate = useNavigate();
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };
    useEffect(() => {
        const checkAuthentication = async () => {
            if (getToken()) {
                const data = {
                    token: getToken(),
                };
                const response = await fetch(`${process.env.REACT_APP_API_URL}auth/introspect`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                const dataResponse = await response.json();

                if (dataResponse.code === 1011) {
                    setIsAuthenticated(false);
                    removeToken();
                    addMessage(false, dataResponse?.errMessage);
                    navigate('/activate');
                } else if (dataResponse.code !== 1000) {
                    setIsAuthenticated(false);
                    removeToken();
                } else {
                    setIsAuthenticated(true);
                    setLoading(false);
                }
            } else {
                setIsAuthenticated(false);
                setLoading(true);
            }
        };
        checkAuthentication();
    }, [getToken()]);
    if (!getToken()) return <Navigate to="/login" />;

    if (loading) {
        // Optionally return a loading spinner or nothing while loading
        return <Loading />;
    }

    return isAuthenticated ? (
        <ContextProvider isAuthenticated={isAuthenticated}>
            <Layout isAuthenticated={isAuthenticated}>{children}</Layout>
        </ContextProvider>
    ) : (
        <Navigate to="/login" />
    );
}

export default memo(PrivateRoute);
