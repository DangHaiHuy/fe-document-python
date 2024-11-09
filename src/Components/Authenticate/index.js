import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Authenticate.module.css';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getToken, setToken } from '../../Services/CookieService';
import Loading from '../Loading';

function Authenticate() {
    const navigate = useNavigate();
    // const [isLoggedin, setIsLoggedin] = useState(false);

    useEffect(() => {
        const authCodeRegex = /code=([^&]+)/;
        const isMatch = window.location.href.match(authCodeRegex);

        if (isMatch) {
            const authCode = isMatch[1];
            fetch(`${process.env.REACT_APP_API_URL}auth/outbound/authentication?code=${authCode}`, {
                method: 'POST',
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.code !== 1000) {
                        throw new Error(data.messeage);
                    }
                    setToken(data.result?.token);
                    navigate('/document');
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

    useEffect(() => {
        if (getToken()) {
            navigate('/document');
        }
    }, [navigate]);

    return <Loading />;
}

export default Authenticate;
