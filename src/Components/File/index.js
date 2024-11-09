import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../Services/CookieService';
import styles from './File.module.css';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus, faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import ModalUploadFile from '../ModalUploadFile';
import ModalConfirm from '../ModalConfirm';
import { ToastContext } from '../../Context/ToastContext';
function File() {
    const [listFile, setListFile] = useState([]);
    const [lastUpdate, setLastUpdate] = useState('');
    const [modalUploadFile, setModalUploadFile] = useState(false);
    const [toggleReload, setToggleReload] = useState(false);
    const [canUpdate, setCanUpdate] = useState(false);
    const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
    const [paramFunctionSubmit, setParamFunctionSubmit] = useState('');
    const [listDocumentDelete, setListDocumentDelete] = useState([]);
    const [modalHandleSubmit, setModalHandleSubmit] = useState();
    // const [modalDeleterFolder, setModalDeleteFolder] = useState(false);
    const toastContextValue = useContext(ToastContext);
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };

    const navigate = useNavigate();
    const { file } = useParams();
    useEffect(() => {
        const fetchData = () => {
            const accessToken = getToken();
            if (!accessToken) navigate('/login');
            fetch(`${process.env.REACT_APP_API_URL}api/v1/file/${file}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    const list = data?.result?.items;
                    if (data.code !== 1000) {
                        throw new Error(JSON.stringify(data));
                    }
                    if (list.length > 0) {
                        const lastCreateAt = new Date(list[0].createAt);
                        const now = new Date();
                        const timeDiff = now - lastCreateAt;
                        const seconds = Math.floor(timeDiff / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        const days = Math.floor(hours / 24);
                        const months = Math.floor(days / 30);
                        const years = Math.floor(days / 365);
                        let timeAgoText = '';
                        if (years > 0) {
                            timeAgoText = `${years} year${years > 1 ? 's' : ''} ago`;
                        } else if (months > 0) {
                            timeAgoText = `${months} month${months > 1 ? 's' : ''} ago`;
                        } else if (days > 0) {
                            timeAgoText = `${days} day${days > 1 ? 's' : ''} ago`;
                        } else if (hours > 0) {
                            timeAgoText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
                        } else if (minutes > 0) {
                            timeAgoText = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
                        } else {
                            timeAgoText = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
                        }
                        setLastUpdate(timeAgoText);
                    }
                    setListFile(list);
                    setCanUpdate(data?.result?.canUpdate);
                })
                .catch((e) => {
                    const dataError = JSON.parse(e.message);
                    addMessage(false, dataError?.errMessage || dataError?.message);
                });
        };
        fetchData();
    }, [file, toggleReload]);

    const handleCheckboxChange = (id) => {
        setListDocumentDelete((prev) => {
            if (prev.includes(id)) {
                return prev.filter((docuemntId) => {
                    return docuemntId != id;
                });
            } else return [...prev, id];
        });
    };

    const handleClick = (id) => {
        navigate(`/document/${file}/${id}`);
    };
    const handleSubmitDelete = async (id) => {
        try {
            const accessToken = getToken();
            if (!accessToken) navigate('/login');
            const res = await fetch(`${process.env.REACT_APP_API_URL}api/v1/file/document/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            if (data.code != 1000) {
                throw new Error(JSON.stringify(data));
            }
            addMessage(true, data?.result?.result);
        } catch (e) {
            const dataError = JSON.parse(e.message);
            addMessage(false, dataError?.errMessage || dataError?.message);
        }
    };
    const handleSubmitDeleteList = async (listDocument) => {
        try {
            const accessToken = getToken();
            if (!accessToken) navigate('/login');
            const request = {
                documentsId: listDocument,
            };
            const res = await fetch(`${process.env.REACT_APP_API_URL}api/v1/file/document`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
            const data = await res.json();
            if (data.code != 1000) {
                throw new Error(JSON.stringify(data));
            }
            addMessage(true, data?.result?.result);
        } catch (e) {
            const dataError = JSON.parse(e.message);
            addMessage(false, dataError?.errMessage || dataError?.message);
        }
    };
    const handleDeleteFolder = async (slug) => {
        try {
            const accessToken = getToken();
            if (!accessToken) navigate('/login');
            const request = {
                slug: file,
            };
            const res = await fetch(`${process.env.REACT_APP_API_URL}api/v1/folder/delete`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
            const data = await res.json();
            if (data.code != 1000) {
                throw new Error(JSON.stringify(data));
            }
            addMessage(true, data?.result?.result);
            navigate('/document');
        } catch (e) {
            const dataError = JSON.parse(e.message);
            addMessage(false, dataError?.errMessage || dataError?.message);
        }
    };
    return (
        <>
            <div>
                <div className={styles.wrapper}>
                    {listFile.length > 0 ? (
                        <>
                            <div className={styles.content}>
                                <div className={styles.title}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <h1
                                            className={styles.header}
                                        >{`All documents of "${listFile[0].folder.name}"`}</h1>
                                        {canUpdate && (
                                            <Button
                                                rightIcon={<FontAwesomeIcon icon={faTrash} />}
                                                style={{ fontSize: '24px', padding: '12px 0px 12px 6px' }}
                                                onClick={() => {
                                                    setModalConfirmDelete(true);
                                                    setModalHandleSubmit(2);
                                                    setParamFunctionSubmit(file.id);
                                                }}
                                            ></Button>
                                        )}
                                    </div>
                                    <p className={styles.lastUpdate}> {`Last update: ${lastUpdate}`}</p>
                                </div>
                            </div>
                            <div className={styles.listBtn}>
                                {canUpdate && (
                                    <div className={styles.btn}>
                                        <Button
                                            primary
                                            size="medium"
                                            leftIcon={<FontAwesomeIcon icon={faFileCirclePlus}></FontAwesomeIcon>}
                                            onClick={() => {
                                                setModalUploadFile(true);
                                            }}
                                        >
                                            New file
                                        </Button>
                                        <Button
                                            outline
                                            disabled={listDocumentDelete.length === 0}
                                            size="medium"
                                            leftIcon={<FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>}
                                            onClick={() => {
                                                setModalConfirmDelete(true);
                                                setModalHandleSubmit(1);
                                                setParamFunctionSubmit(listDocumentDelete);
                                            }}
                                        >
                                            Delete selected file
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div>
                                {listFile.map((file) => {
                                    return (
                                        <div className={styles.container} key={file.id}>
                                            <div className={styles.box}>
                                                <p
                                                    className={styles.name}
                                                    onClick={() => {
                                                        handleClick(file.id);
                                                    }}
                                                >
                                                    {file.name}
                                                </p>
                                                {canUpdate && (
                                                    <div
                                                        className={styles.delete}
                                                        onClick={() => {
                                                            setModalConfirmDelete(true);
                                                            setModalHandleSubmit(0);
                                                            setParamFunctionSubmit(file.id);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                                    </div>
                                                )}
                                            </div>
                                            {canUpdate && (
                                                <div className={styles.checkBox}>
                                                    <input
                                                        type="checkbox"
                                                        className={styles.check}
                                                        onChange={() => {
                                                            handleCheckboxChange(file.id);
                                                        }}
                                                        checked={listDocumentDelete.includes(file.id)}
                                                    ></input>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <>
                            {canUpdate && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className={styles.btn}>
                                        <Button
                                            primary
                                            size="medium"
                                            leftIcon={<FontAwesomeIcon icon={faFileCirclePlus}></FontAwesomeIcon>}
                                            onClick={() => {
                                                setModalUploadFile(true);
                                            }}
                                        >
                                            New file
                                        </Button>
                                    </div>
                                    <Button
                                        rightIcon={<FontAwesomeIcon icon={faTrash} />}
                                        style={{ fontSize: '24px', padding: '12px 0px 12px 6px' }}
                                        onClick={() => {
                                            setModalConfirmDelete(true);
                                            setModalHandleSubmit(2);
                                            setParamFunctionSubmit(file.id);
                                        }}
                                    ></Button>
                                </div>
                            )}
                            <div className={styles.empty}>Không tìm thấy tài liệu</div>
                        </>
                    )}
                </div>
            </div>
            <ModalUploadFile
                modalUploadFile={modalUploadFile}
                setModalUploadFile={setModalUploadFile}
                setToggleReload={setToggleReload}
            />
            <ModalConfirm
                modalConfirmDelete={modalConfirmDelete}
                setModalConfirmDelete={setModalConfirmDelete}
                setToggleReload={setToggleReload}
                handleSubmit={
                    modalHandleSubmit === 0
                        ? handleSubmitDelete
                        : modalHandleSubmit === 1
                        ? handleSubmitDeleteList
                        : handleDeleteFolder
                }
                paramFunctionSubmit={paramFunctionSubmit}
            />
        </>
    );
}

export default File;
