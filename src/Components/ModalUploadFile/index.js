import { useContext, useState } from 'react';
import styles from './ModalUploadFile.module.css';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { storage } from '../firebase';
import { v4 } from 'uuid';
import { ref, uploadBytes } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../Services/CookieService';
import { ToastContext } from '../../Context/ToastContext';

function ModalUploadFile({ modalUploadFile, setModalUploadFile, setToggleReload }) {
    const [fileUpload, setFileUpoad] = useState(null);
    const [loading, setLoading] = useState(false);
    const { file } = useParams();
    const toastContextValue = useContext(ToastContext);
    const nav = useNavigate();

    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };
    const handleClose = () => {
        setModalUploadFile(false);
        setLoading(false);
    };
    const asyncDatabase = async (name, firebaseId) => {
        try {
            setLoading(true);
            const request = {
                firebaseId,
                name,
            };
            const accessToken = await getToken();
            if (!accessToken) nav('/login');
            const res = await fetch(`${process.env.REACT_APP_API_URL}api/v1/file/add/${file}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(request),
            });
            const data = await res.json();
            if (data.code != 1000) {
                throw new Error(JSON.stringify(data));
            }
            addMessage(true, 'Uploaded Successfully');
            setModalUploadFile(false);
            setToggleReload((prev) => !prev);
            setLoading(false);
        } catch (e) {
            const dataError = JSON.parse(e.message);
            addMessage(false, dataError?.errMessage || dataError?.message);
            setLoading(false);
        }
    };
    const uploadFilePDF = async () => {
        if (fileUpload === null) {
            setLoading(false);
            return;
        }
        const firebaseId = v4();
        const name = fileUpload.name;
        const pdfRef = ref(storage, `pdf/${firebaseId + name}`);
        uploadBytes(pdfRef, fileUpload)
            .then(() => {
                asyncDatabase(name, firebaseId);
            })
            .catch((e) => {
                addMessage(false, 'Upload failed');
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const handleSubmit = async () => {
        setLoading(true);
        uploadFilePDF();
    };
    return (
        <>
            {modalUploadFile && (
                <div className={styles.wrapper}>
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <h2>Upload New File</h2>
                        </div>
                        <div className={styles.body}>
                            <label htmlFor="name" className={styles.content}>
                                Select File:
                            </label>
                            <input
                                type="file"
                                className={styles.input}
                                id="name"
                                placeholder="Name File...."
                                onChange={(e) => {
                                    if (e.target.files[0].size > 20 * 1024 * 1024) {
                                        addMessage(false, `Can't upload file having size > 20mb`);
                                        e.target.value = null;
                                        setFileUpoad(null);
                                    } else {
                                        setFileUpoad(e.target.files[0]);
                                    }
                                }}
                                accept="application/pdf"
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

export default ModalUploadFile;
