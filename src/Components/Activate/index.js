import { useNavigate, useParams } from 'react-router-dom';
import styles from './Activate.module.css';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import { ToastContext } from '../../Context/ToastContext';

function Activate() {
    const { email } = useParams();
    const { code } = useParams();
    const [codeInput, setCodeInput] = useState(code);
    const [emailInput, setEmailInput] = useState(email);
    const [errorCodeInput, setErrorCodeInput] = useState('');
    const [successCodeInput, setSuccessCodeInput] = useState('');
    const [loading, setLoading] = useState(false);
    const toastContextValue = useContext(ToastContext);
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };
    const navigate = useNavigate();
    useEffect(() => {
        if (!(code == undefined || email == undefined)) handleSubmit();
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        const res = await fetch(
            `${process.env.REACT_APP_API_URL}users/activate?email=${emailInput}&code=${codeInput}`,
            {
                method: 'POST',
            },
        );
        const data = await res.json();
        if (data.code === 1000) {
            setErrorCodeInput('');
            setSuccessCodeInput(data?.result?.result);
            addMessage(true, data?.result?.result);
        } else {
            setSuccessCodeInput('');
            setErrorCodeInput(data?.errMessage);
            addMessage(false, data?.errMessage);
        }
        setLoading(false);
    };
    return (
        <>
            <div className={styles.wrapper}></div>
            <div className={styles.container}>
                <h2 className={styles.header}>Activate</h2>
                <div className={styles.body}>
                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faKey} className={styles.icon} />
                        <div className={styles.inpWrapper}>
                            <input
                                type="text"
                                className={styles.inp}
                                placeholder="Activation code"
                                value={codeInput}
                                onChange={(e) => {
                                    setErrorCodeInput('');
                                    setSuccessCodeInput('');
                                    setCodeInput(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                        <div className={styles.inpWrapper}>
                            <input
                                type="text"
                                className={styles.inp}
                                placeholder="Email"
                                value={emailInput}
                                onChange={(e) => {
                                    setErrorCodeInput('');
                                    setSuccessCodeInput('');
                                    setEmailInput(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
                {errorCodeInput && <span style={{ color: 'red', fontSize: '1.4rem' }}>{errorCodeInput}</span>}
                {successCodeInput && <span style={{ color: 'green', fontSize: '1.4rem' }}>{successCodeInput}</span>}
                <div className={styles.footer}>
                    <Button
                        primary
                        size="big"
                        className={styles.submit}
                        onClick={handleSubmit}
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
                    <Button
                        outline
                        size="big"
                        className={styles.submit}
                        onClick={() => {
                            navigate('/login');
                        }}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Activate;
