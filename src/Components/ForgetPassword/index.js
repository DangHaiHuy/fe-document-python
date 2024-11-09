import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ForgetPassword.module.css';
import { useContext, useEffect, useState } from 'react';
import { faEnvelope, faKey, faLock, faPaperPlane, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import { ToastContext } from '../../Context/ToastContext';
import clsx from 'clsx';

function ForgetPassword() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [isCheckUser, setIsCheckUser] = useState(false);
    const [isCheckOtp, setIsCheckOtp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingSendEmail, setLoadingSendEmail] = useState(false);
    const toastContextValue = useContext(ToastContext);
    const [otpCode, setOtpCode] = useState('');
    const [errorOtpCode, setErrorOtpCode] = useState('');
    const [disabledSendEmail, setDisabledSendEmail] = useState(false);
    const [counter, setCounter] = useState(0);
    const [newPassword, setNewPassword] = useState('');
    const [errorNewPassword, setErrorNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorConfirmNewPassword, setErrorConfirmNewPassword] = useState('');
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };
    const handleSubmitUsername = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.REACT_APP_API_URL}users/get-hidden-email/${username}`, {
                method: 'GET',
            });
            const data = await res.json();
            if (data.code === 1000) {
                setEmail(data?.result?.email);
                setIsCheckUser(true);
                setLoading(false);
            } else throw new Error(JSON.stringify(data));
        } catch (error) {
            const errorData = JSON.parse(error.message);
            setErrorUsername(errorData?.error_message || errorData?.message);
            setIsCheckUser(false);
            setLoading(false);
        }
    };
    useEffect(() => {
        let intervalId;
        if (counter > 0) {
            intervalId = setTimeout(() => {
                setCounter((prevCounter) => prevCounter - 1);
            }, 1000);
        } else if (counter === 0) {
            setDisabledSendEmail(false);
        }
        return () => {
            clearTimeout(intervalId); // Dọn dẹp interval khi component unmount hoặc counter về 0
        };
    }, [counter]);
    const handleSendOtp = async () => {
        try {
            setCounter(60);
            setDisabledSendEmail(true);
            setLoadingSendEmail(true);
            const res = await fetch(`${process.env.REACT_APP_API_URL}api/v1/otp/send-otp/${username}`, {
                method: 'GET',
            });
            const data = await res.json();
            if (data.code !== 1000) throw new Error(JSON.stringify(data));
            addMessage(true, 'Please check your email! This code will expire after 5 minutes');
            setLoadingSendEmail(false);
        } catch (error) {
            const errorData = JSON.parse(error.message);
            addMessage(false, errorData?.error_message || errorData?.message);
            setLoadingSendEmail(false);
        }
    };
    const handleVerify = async () => {
        try {
            setLoading(true);
            const request = {
                otp_code: otpCode,
                username,
            };
            const res = await fetch(`${process.env.REACT_APP_API_URL}api/v1/otp/check-otp/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
            const data = await res.json();
            if (data.code !== 1000) throw new Error(JSON.stringify(data));
            addMessage(true, data?.result?.result);
            setIsCheckOtp(true);
            setDisabledSendEmail(true);
            setLoading(false);
        } catch (error) {
            const errorData = JSON.parse(error.message);
            setErrorOtpCode(errorData?.error_message || errorData?.message);
            setIsCheckOtp(false);
            setLoading(false);
        }
    };
    const handleReset = async () => {
        try {
            setLoading(true);
            const request = {
                otp_code: otpCode,
                username,
                new_password: newPassword,
            };
            const res = await fetch(`${process.env.REACT_APP_API_URL}users/reset-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
            const data = await res.json();
            if (data.code !== 1000) throw new Error(JSON.stringify(data));
            addMessage(true, data?.result?.result);
            setLoading(false);
        } catch (error) {
            const errorData = JSON.parse(error.message);
            addMessage(false, errorData?.error_message || errorData?.message);
            setLoading(false);
        }
    };
    return (
        <>
            <div className={styles.wrapper}></div>
            <div className={styles.container}>
                <h2 className={styles.header}>Reset Password</h2>
                <div className={styles.body}>
                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faUser} className={styles.icon} style={{ width: '17.5px' }} />
                        <div className={styles.inpWrapper}>
                            <input
                                type="text"
                                className={clsx(styles.inp, { [styles.disabled]: isCheckUser })}
                                placeholder="Username"
                                value={username}
                                onChange={(e) => {
                                    setErrorUsername('');
                                    setUsername(e.target.value);
                                }}
                                readOnly={isCheckUser}
                                disabled={isCheckUser}
                            />
                            {errorUsername && <span style={{ color: 'red', fontSize: '1.4rem' }}>{errorUsername}</span>}
                        </div>
                    </div>
                    {isCheckUser && (
                        <>
                            <div className={styles.content}>
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className={styles.icon}
                                    style={{ width: '17.5px' }}
                                />
                                <div className={styles.inpWrapper}>
                                    <input
                                        type="text"
                                        className={`${styles.inp} ${styles.disabled}`}
                                        placeholder="Email"
                                        value={email}
                                        readOnly
                                        disabled
                                    />
                                    {errorUsername && (
                                        <span style={{ color: 'red', fontSize: '1.4rem' }}>{errorUsername}</span>
                                    )}
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    margin: '8px 0',
                                }}
                            >
                                {disabledSendEmail && (
                                    <div
                                        style={{ color: 'var(--primary)', padding: '0 8px', opacity: '0.5' }}
                                    >{`${counter}s`}</div>
                                )}
                                <Button
                                    text
                                    rightIcon={<FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>}
                                    style={{ color: 'var(--primary)' }}
                                    onClick={handleSendOtp}
                                    leftIcon={
                                        loadingSendEmail && (
                                            <div className="loading">
                                                <FontAwesomeIcon icon={faSpinner} className="spin" />
                                            </div>
                                        )
                                    }
                                    disabled={disabledSendEmail}
                                >
                                    Click to send OTP via email
                                </Button>
                            </div>
                            <div className={styles.content}>
                                <FontAwesomeIcon icon={faKey} className={styles.icon} style={{ width: '17.5px' }} />
                                <div className={styles.inpWrapper}>
                                    <input
                                        type="text"
                                        className={clsx(styles.inp, {
                                            [styles.disabled]: isCheckOtp,
                                        })}
                                        placeholder="Otp code"
                                        value={otpCode}
                                        onChange={(e) => {
                                            setOtpCode(e.target.value);
                                            setErrorOtpCode('');
                                        }}
                                        readOnly={isCheckOtp}
                                        disabled={isCheckOtp}
                                    />
                                    {errorOtpCode && (
                                        <span style={{ color: 'red', fontSize: '1.4rem' }}>{errorOtpCode}</span>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    {isCheckOtp && (
                        <>
                            <div className={styles.content}>
                                <FontAwesomeIcon icon={faLock} className={styles.icon} style={{ width: '17.5px' }} />
                                <div className={styles.inpWrapper}>
                                    <input
                                        type="password"
                                        className={styles.inp}
                                        placeholder="New password"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setErrorNewPassword('');
                                        }}
                                    />
                                    {errorNewPassword && (
                                        <span style={{ color: 'red', fontSize: '1.4rem' }}>{errorNewPassword}</span>
                                    )}
                                </div>
                            </div>
                            <div className={styles.content}>
                                <FontAwesomeIcon icon={faLock} className={styles.icon} style={{ width: '17.5px' }} />
                                <div className={styles.inpWrapper}>
                                    <input
                                        type="password"
                                        className={styles.inp}
                                        placeholder="Confirm new password"
                                        value={confirmNewPassword}
                                        onChange={(e) => {
                                            setConfirmNewPassword(e.target.value);
                                            setErrorConfirmNewPassword('');
                                        }}
                                    />
                                    {errorConfirmNewPassword && (
                                        <span style={{ color: 'red', fontSize: '1.4rem' }}>
                                            {errorConfirmNewPassword}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.footer}>
                    {!isCheckUser && (
                        <Button
                            primary
                            size="big"
                            className={styles.submit}
                            onClick={handleSubmitUsername}
                            rightIcon={
                                loading && (
                                    <div className="loading">
                                        <FontAwesomeIcon icon={faSpinner} className="spin"></FontAwesomeIcon>
                                    </div>
                                )
                            }
                        >
                            Submit
                        </Button>
                    )}
                    {isCheckUser && isCheckOtp === false && (
                        <Button
                            primary
                            size="big"
                            className={styles.submit}
                            rightIcon={
                                loading && (
                                    <div className="loading">
                                        <FontAwesomeIcon icon={faSpinner} className="spin"></FontAwesomeIcon>
                                    </div>
                                )
                            }
                            onClick={handleVerify}
                        >
                            Verify
                        </Button>
                    )}
                    {isCheckOtp && (
                        <Button
                            primary
                            size="big"
                            className={styles.submit}
                            rightIcon={
                                loading && (
                                    <div className="loading">
                                        <FontAwesomeIcon icon={faSpinner} className="spin"></FontAwesomeIcon>
                                    </div>
                                )
                            }
                            onClick={() => {
                                if (newPassword === confirmNewPassword) handleReset();
                                else setErrorConfirmNewPassword('The confirmation password does not match.');
                            }}
                        >
                            Reset password
                        </Button>
                    )}
                    <Button to="/login" outline size="big" className={styles.submit}>
                        Login
                    </Button>
                </div>
            </div>
        </>
    );
}

export default ForgetPassword;
