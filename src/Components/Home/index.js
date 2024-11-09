import { useContext, useEffect, useState } from 'react';
import Book from '../Book';
import styles from './Home.module.css';
import { getToken } from '../../Services/CookieService';
import Pagination from '../Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../Button';
import ModalCreateFolder from '../ModalCreateFolder';
import { ToastContext } from '../../Context/ToastContext';

function Home() {
    const [folderList, setFolderList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [totalData, setTotalData] = useState(0);
    const [loading, setLoading] = useState(false);
    const [btnIndex, setBtnIndex] = useState(0);
    const [allMode, setAllMode] = useState(true);
    const [favoriteMode, setFavoriteMode] = useState(false);
    const [modalCreateFolder, setModalCreateFolder] = useState(false);
    const [toggleReload, setToggleReload] = useState(false);
    const nav = useNavigate();

    const toastContextValue = useContext(ToastContext);
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };

    const [searchParams] = useSearchParams();
    const name = searchParams.get('name');
    const listBtn = [
        {
            name: 'All Documents',
        },
        {
            name: 'My Documents',
        },
        {
            name: 'My Favorites',
        },
    ];
    useEffect(() => {
        setPage(1);
    }, [name]);
    useEffect(() => {
        setLoading(true);
        const accessToken = getToken();
        if (!accessToken) {
            nav('/login');
            return;
        }
        const apiCall =
            allMode || name
                ? `${process.env.REACT_APP_API_URL}api/v1/folder?page=${page}&limit=8${
                      name != null ? `&name=${name}` : ''
                  }`
                : !favoriteMode
                ? `${process.env.REACT_APP_API_URL}users/my-documents?page=${page}&limit=8`
                : `${process.env.REACT_APP_API_URL}users/my-favorites?page=${page}&limit=8`;
        fetch(apiCall, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.code !== 1000) {
                    throw new Error(JSON.stringify(data));
                }
                setFolderList(data?.result?.items);
                setTotalData(data?.result?.total);
                setLoading(false);
            })
            .catch((e) => {
                const dataError = JSON.parse(e.message);
                addMessage(false, dataError?.errMessage || dataError?.message);
                setLoading(false);
            });
    }, [page, allMode, name, favoriteMode, toggleReload]);
    const handleClickBtn = (index) => {
        setBtnIndex(index);
        setPage(1);
        if (index === 0) {
            setAllMode(true);
            setFavoriteMode(false);
        } else if (index == 1) {
            setAllMode(false);
            setFavoriteMode(false);
        } else if (index == 2) {
            setAllMode(false);
            setFavoriteMode(true);
        }
    };
    return (
        <>
            <div className={styles.wrapper}>
                {name == null && (
                    <div className={styles.modeWrapper}>
                        <div className={styles.mode}>
                            {listBtn.map((btn, index) => {
                                return (
                                    <div
                                        className={clsx(styles.item, {
                                            [styles.active]: index === btnIndex,
                                        })}
                                        key={index}
                                        onClick={() => handleClickBtn(index)}
                                    >
                                        {btn.name}
                                    </div>
                                );
                            })}
                        </div>
                        <Button
                            leftIcon={<FontAwesomeIcon icon={faFolderPlus} />}
                            primary
                            size="medium"
                            onClick={() => {
                                setModalCreateFolder(true);
                            }}
                        >
                            New Folder
                        </Button>
                    </div>
                )}
                {folderList.length > 0 && loading == false ? (
                    <>
                        <div className="row">
                            {folderList.map((folder) => {
                                return (
                                    <div className={`col l-3 m-6 c-12 ${styles.container}`} key={folder.id}>
                                        <Book folder={folder} kebabName={folder.slug}></Book>
                                    </div>
                                );
                            })}
                        </div>
                        <Pagination
                            page={page}
                            limit={limit}
                            setPage={setPage}
                            maxPage={Math.floor((totalData - 1) / 8) + 1}
                        ></Pagination>
                    </>
                ) : loading == true ? (
                    <div className={styles.loadingWrapper}>
                        <div className={styles.loading}>
                            <FontAwesomeIcon icon={faSpinner} className={styles.spin}></FontAwesomeIcon>
                        </div>
                    </div>
                ) : (
                    <div className={styles.noDataWrapper}>
                        <div className={styles.empty}>Không tìm thấy tài liệu</div>
                    </div>
                )}
            </div>
            <ModalCreateFolder
                setModalCreateFolder={setModalCreateFolder}
                modalCreateFolder={modalCreateFolder}
                setToggleReload={setToggleReload}
            ></ModalCreateFolder>
        </>
    );
}

export default Home;
