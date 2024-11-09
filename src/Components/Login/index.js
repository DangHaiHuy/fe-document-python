import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Login.module.css';
import { faLock, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { OAuthConfig } from '../../Configurations';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { getToken, setToken } from '../../Services/CookieService';
import clsx from 'clsx';
import { ToastContext } from '../../Context/ToastContext';

function Login() {
    const navigate = useNavigate();
    const toastContextValue = useContext(ToastContext);
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        setLoading(true);
        const data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);

        fetch(`${process.env.REACT_APP_API_URL}auth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString(),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.code !== 1000) throw new Error(JSON.stringify(data));
                setToken(data.result?.access_token);
                navigate('/document');
                setLoading(false);
            })
            .catch((error) => {
                const dataError = JSON.parse(error.message);
                addMessage(false, dataError.error_message || dataError.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        const accessToken = getToken();

        if (accessToken) {
            navigate('/document');
        }
    }, [navigate]);
    return (
        <>
            <div className={styles.wrapper}></div>
            <div className={styles.container}>
                <h2 className={styles.header}>LOGIN</h2>
                <div className={styles.body}>
                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faUser} className={styles.icon} />
                        <div className={styles.inpWrapper}>
                            <input
                                type="text"
                                className={styles.inp}
                                placeholder="Username"
                                value={username}
                                onChange={(e) => {
                                    setErrorUsername('');
                                    setUsername(e.target.value);
                                }}
                            />
                            {errorUsername && <span style={{ color: 'red', fontSize: '1.4rem' }}>{errorUsername}</span>}
                        </div>
                    </div>
                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faLock} className={styles.icon} />
                        <div className={styles.inpWrapper}>
                            <input
                                type="password"
                                className={styles.inp}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setErrorPassword('');
                                    setPassword(e.target.value);
                                }}
                            />
                            {errorPassword && <span style={{ color: 'red', fontSize: '1.4rem' }}>{errorPassword}</span>}
                        </div>
                    </div>
                    <Button
                        text
                        to="/forget-password"
                        className={clsx(styles.btnForgot, {
                            [styles.btnForgotError]: errorPassword,
                        })}
                    >
                        Forgot password?
                    </Button>
                </div>
                <div className={styles.footer}>
                    <Button
                        primary
                        size="big"
                        className={styles.submit}
                        onClick={handleLogin}
                        rightIcon={
                            loading && (
                                <div className="loading">
                                    <FontAwesomeIcon icon={faSpinner} className="spin"></FontAwesomeIcon>
                                </div>
                            )
                        }
                    >
                        Login
                    </Button>
                    <Button to="/register" primary size="big" className={styles.submit} outline>
                        Register
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Login;
