import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Register.module.css';
import { faEnvelope, faIdBadge, faLock, faRotateRight, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../../Context/ToastContext';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorFirstName, setErrorFirstName] = useState('');
    const [errorLastName, setErrorLastName] = useState('');
    const toastContextValue = useContext(ToastContext);
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            setLoading(true);
            const request = {
                username,
                password,
                email,
                firstName,
                lastName,
            };
            const res = await fetch(`${process.env.REACT_APP_API_URL}users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
            const data = await res.json();
            if (data.code !== 1000) {
                throw new Error(JSON.stringify(data));
            }
            navigate('/document');
            setLoading(false);
            addMessage(true, 'Register successfully');
        } catch (e) {
            const dataError = JSON.parse(e.message);
            if (Array.isArray(dataError))
                dataError.forEach((error) => {
                    if (error.message === 'email') {
                        setErrorEmail(error.errMessage);
                    } else if (error.message === 'username') {
                        setErrorUsername(error.errMessage);
                    } else if (error.message === 'password') {
                        setErrorPassword(error.errMessage);
                    } else if (error.message === 'firstName') {
                        setErrorFirstName(error.errMessage);
                    } else if (error.message === 'lastName') {
                        setErrorLastName(error.errMessage);
                    }
                });
            else {
                addMessage(false, dataError.errMessage);
            }
            setLoading(false);
        }
    };
    return (
        <>
            <div className={styles.wrapper}></div>
            <div className={styles.container}>
                <h2 className={styles.header}>Register</h2>
                <div className={styles.body}>
                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faUser} className={styles.icon} style={{ width: '17.5px' }} />
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
                        <FontAwesomeIcon icon={faLock} className={styles.icon} style={{ width: '17.5px' }} />
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
                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faRotateRight} className={styles.icon} style={{ width: '17.5px' }} />
                        <div className={styles.inpWrapper}>
                            <input
                                type="password"
                                className={styles.inp}
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setErrorConfirmPassword('');
                                    setConfirmPassword(e.target.value);
                                }}
                            />
                            {errorConfirmPassword && (
                                <span style={{ color: 'red', fontSize: '1.4rem' }}>{errorConfirmPassword}</span>
                            )}
                        </div>
                    </div>
                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.icon} style={{ width: '17.5px' }} />
                        <div className={styles.inpWrapper}>
                            <input
                                type="text"
                                className={styles.inp}
                                placeholder="Email"
                                value={email}
                                onChange={(e) => {
                                    setErrorEmail('');
                                    setEmail(e.target.value);
                                }}
                            />
                            {errorEmail && <span style={{ color: 'red', fontSize: '1.4rem' }}>{errorEmail}</span>}
                        </div>
                    </div>

                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faIdBadge} className={styles.icon} style={{ width: '17.5px' }} />
                        <div className={styles.inpWrapperRow}>
                            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minWidth: '50px' }}>
                                <input
                                    type="text"
                                    className={`${styles.inp} ${styles.inpX}`}
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => {
                                        setErrorLastName('');
                                        setLastName(e.target.value);
                                    }}
                                />
                                {errorLastName && (
                                    <span style={{ color: 'red', fontSize: '1.4rem' }}>{errorLastName}</span>
                                )}
                            </div>
                            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minWidth: '50px' }}>
                                <input
                                    type="text"
                                    className={styles.inp}
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => {
                                        setErrorFirstName('');
                                        setFirstName(e.target.value);
                                    }}
                                />
                                {errorFirstName && (
                                    <span style={{ color: 'red', fontSize: '1.4rem' }}>{errorFirstName}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.footer}>
                    <Button
                        primary
                        size="big"
                        className={styles.submit}
                        onClick={() => {
                            if (password !== confirmPassword) {
                                setErrorConfirmPassword('The confirmation password does not match.');
                            } else handleRegister();
                        }}
                        rightIcon={
                            loading && (
                                <div className="loading">
                                    <FontAwesomeIcon icon={faSpinner} className="spin" />
                                </div>
                            )
                        }
                    >
                        Register
                    </Button>
                    <Button to="/login" outline size="big" className={styles.submit}>
                        Login
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Register;
