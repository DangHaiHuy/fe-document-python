import { useContext, useEffect, useState } from 'react';
import { storage } from '../firebase';
import styles from './RenderPDF.module.css';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../Services/CookieService';
import { ToastContext } from '../../Context/ToastContext';

function RenderPDF() {
    const { id } = useParams();
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [listData, setListData] = useState({
        createAt: '',
        name: '',
        file: null,
    });
    const toastContextValue = useContext(ToastContext);
    const nav = useNavigate();

    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = getToken();
                if (!accessToken) nav('/login');
                const res = await fetch(`${process.env.REACT_APP_API_URL}api/v1/file/document/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await res.json();
                if (data.code === 1000) {
                    getDownloadURL(ref(storage, `pdf/${data?.result?.firebaseId}${data?.result?.name}`))
                        .then((url) => {
                            const date = new Date(data?.result?.createAt);

                            const day = date.getDate(); // Ngày
                            const month = date.getMonth() + 1;
                            const year = date.getFullYear();

                            const hours = date.getHours().toString().padStart(2, '0');
                            const minutes = date.getMinutes().toString().padStart(2, '0');

                            const dateString = `${day}/${month}/${year} (${hours}:${minutes})`;

                            setListData({ ...data?.result, file: url, createAt: dateString });
                        })
                        .catch((e) => {
                            addMessage(false, 'Get data failed');
                        });
                } else {
                    throw new Error(JSON.stringify(data));
                }
            } catch (e) {
                const dataError = JSON.parse(e);
                addMessage(false, dataError?.errMessage || dataError?.message);
            }
        };
        fetchData();
    }, []);
    return (
        <div>
            <div className={styles.wrapper}>
                <div className={styles.title}>
                    <h1 className={styles.header}>{listData.name}</h1>
                    <p className={styles.date}>{`Upload: ${listData.createAt}`}</p>
                </div>
                <div className={styles.body}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <div
                            style={{
                                border: '1px solid rgba(0, 0, 0, 0.3)',
                                height: '700px',
                            }}
                        >
                            {listData.file !== null && (
                                <Viewer
                                    fileUrl={listData.file}
                                    defaultScale={1}
                                    // initialPage={1}
                                    plugins={[defaultLayoutPluginInstance]}
                                />
                            )}
                        </div>
                    </Worker>
                </div>
            </div>
        </div>
    );
}

export default RenderPDF;
