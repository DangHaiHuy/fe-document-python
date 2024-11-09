import { useContext, useState } from 'react';
import Button from '../Button';
import styles from './ModalCreateFolder.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getToken } from '../../Services/CookieService';
import { ToastContext } from '../../Context/ToastContext';
import { useNavigate } from 'react-router-dom';

function ModalCreateFolder({ modalCreateFolder, setModalCreateFolder, setToggleReload }) {
    const [valueFolderName, setValueFolderName] = useState('');
    const [loading, setLoading] = useState(false);
    const toastContextValue = useContext(ToastContext);
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };
    const nav = useNavigate();

    const handleSubmit = async () => {
        if (valueFolderName.trim() === '') return;
        try {
            setLoading(true);
            const request = {
                name: valueFolderName,
            };
            const accessToken = getToken();
            if (!accessToken) nav('/login');
            const res = await fetch(`${process.env.REACT_APP_API_URL}api/v1/folder/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(request),
            });
            const data = await res.json();
            if (data.code !== 1000) {
                throw new Error(JSON.stringify(data));
            }
            setLoading(false);
            setModalCreateFolder(false);
            setToggleReload((prev) => !prev);
            addMessage(true, 'Created successfully');
        } catch (e) {
            const dataError = JSON.parse(e.message);
            addMessage(false, dataError?.errMessage || dataError?.message);
            setLoading(false);
        }
    };
    const handleClose = () => {
        setModalCreateFolder(false);
        setLoading(false);
    };
    return (
        <>
            {modalCreateFolder && (
                <div className={styles.wrapper}>
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <h2>Create New Folder</h2>
                        </div>
                        <div className={styles.body}>
                            <label htmlFor="name" className={styles.content}>
                                Name Folder:
                            </label>
                            <input
                                className={styles.input}
                                id="name"
                                placeholder="Name Folder...."
                                value={valueFolderName}
                                onChange={(e) => {
                                    setValueFolderName(e.target.value);
                                }}
                            ></input>
                        </div>
                        <div className={styles.submit}>
                            <Button size="small" outline onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                size="small"
                                primary
                                onClick={handleSubmit}
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
                    </div>
                </div>
            )}
        </>
    );
}

export default ModalCreateFolder;
