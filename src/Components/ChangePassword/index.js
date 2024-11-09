import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from '../Profile/Profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Button';
import { useContext, useState } from 'react';
import { getToken } from '../../Services/CookieService';
import { ToastContext } from '../../Context/ToastContext';
import { useNavigate } from 'react-router-dom';
function ChangePassword() {
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorCurrentPassword, setErrorCurrentPassword] = useState('');
    const [errorNewPassword, setErrorNewPassword] = useState('');
    const [errorConfirmNewPassword, setErrorConfirmNewPassword] = useState('');
    const toastContextValue = useContext(ToastContext);
    const nav = useNavigate();
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };
    const handleSubmit = async () => {
        setLoading(true);
        const accessToken = getToken();
        if (!accessToken) nav('/login');
        const dataRequest = {
            old_password: currentPassword,
            new_password: newPassword,
        };
        const res = await fetch(`${process.env.REACT_APP_API_URL}users/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(dataRequest),
        });
        const dataResponse = await res.json();
        if (dataResponse.code === 1000) {
            addMessage(true, dataResponse?.result?.result);
        } else if (dataResponse.code === 1004) {
            setErrorCurrentPassword(dataResponse?.error_message);
        } else if (Array.isArray(dataResponse)) {
            setErrorNewPassword(dataResponse[0]?.error_message);
        } else {
            addMessage(false, dataResponse?.error_message || dataResponse?.message);
        }
        setLoading(false);
    };
    return (
        <div className={styles.wrapper}>
            <div className="grid wide">
                <h1 className={styles.header}>Change Password</h1>
                <div className={styles.container} style={{ width: '100%' }}>
                    <form
                        style={{ width: '100%' }}
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <div className={styles.inputBox}>
                            <div>
                                <label className={styles.label} htmlFor="currentPassword">
                                    Current password
                                </label>
                            </div>
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="Current password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => {
                                    setErrorCurrentPassword('');
                                    setCurrentPassword(e.target.value);
                                }}
                            ></input>
                            {errorCurrentPassword && <span className={styles.error}>{errorCurrentPassword}</span>}
                        </div>
                        <div className={styles.inputBox}>
                            <div>
                                <label className={styles.label} htmlFor="newPassword">
                                    New password
                                </label>
                            </div>
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="New password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => {
                                    setErrorNewPassword('');
                                    setNewPassword(e.target.value);
                                }}
                            ></input>
                            {errorNewPassword && <span className={styles.error}>{errorNewPassword}</span>}
                        </div>
                        <div className={styles.inputBox}>
                            <div>
                                <label className={styles.label} htmlFor="confirmNewPassword">
                                    Confirm new password
                                </label>
                            </div>
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="Confirm new password"
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={(e) => {
                                    setErrorConfirmNewPassword('');
                                    setConfirmNewPassword(e.target.value);
                                }}
                            ></input>
                            {errorConfirmNewPassword && <span className={styles.error}>{errorConfirmNewPassword}</span>}
                        </div>
                        <div className={styles.btn}>
                            <Button
                                primary
                                className={styles.submit}
                                size="big"
                                onClick={() => {
                                    if (confirmNewPassword === newPassword) handleSubmit();
                                    else setErrorConfirmNewPassword('The confirmation password does not match.');
                                }}
                                rightIcon={
                                    loading && (
                                        <div className={styles.loading}>
                                            <FontAwesomeIcon icon={faSpinner} className={styles.spin} />
                                        </div>
                                    )
                                }
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
