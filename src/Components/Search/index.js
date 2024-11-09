import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Search.module.css';
import { faCircleXmark, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { getToken } from '../../Services/CookieService';
import BoxSearch from './BoxSearch/BoxSearch';
import useDebounce from '../../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../../Context/ToastContext';

function Search() {
    const [listSearch, setListSearch] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataInput, setDataInput] = useState('');
    const [totalData, setTotalData] = useState(0);
    const [forceBoxSearchOpen, setForceBoxSearchMenuOpen] = useState(false);
    const [forceBoxSearchClose, setForceBoxSearchMenuClose] = useState(false);
    const debounceDataInput = useDebounce(dataInput, 500);
    const navigate = useNavigate();
    const wrapperRef = useRef();
    const inputRef = useRef();
    const toastContextValue = useContext(ToastContext);
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const accessToken = await getToken();
            if (!accessToken) navigate('/login');
            const res = await fetch(`${process.env.REACT_APP_API_URL}api/v1/search?name=${debounceDataInput}&limit=4`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            if (data.code === 1000) {
                setListSearch(data?.result?.items);
                setTotalData(data?.result?.total);
            } else {
                addMessage(false, data?.errMessage || data?.message);
            }
            setLoading(false);
        };
        if (debounceDataInput.trim() != '') fetchData();
        else {
            setListSearch([]);
            setTotalData(0);
        }
    }, [debounceDataInput]);
    const handleSearch = () => {
        setForceBoxSearchMenuClose((prev) => !prev);
        if (debounceDataInput) navigate(`/document?name=${debounceDataInput}`);
        else {
            navigate('/document');
        }
    };
    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <input
                ref={inputRef}
                type="text"
                className={styles.container}
                placeholder="Search"
                value={dataInput}
                onChange={(e) => {
                    setDataInput(e.target.value);
                }}
                onFocus={() => {
                    setForceBoxSearchMenuOpen((prev) => !prev);
                }}
            ></input>

            <div className={styles.layoutIcon} onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} className={styles.icon}></FontAwesomeIcon>
            </div>

            {loading && (
                <div className={styles.layoutIconInput}>
                    <FontAwesomeIcon icon={faSpinner} className={`${styles.icon} ${styles.spin}`}></FontAwesomeIcon>
                </div>
            )}
            {!loading && dataInput != '' && (
                <div
                    className={styles.layoutIconInput}
                    onClick={() => {
                        setDataInput('');
                        if (inputRef.current) {
                            inputRef.current.focus();
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faCircleXmark} className={`${styles.icon}`}></FontAwesomeIcon>
                </div>
            )}
            <BoxSearch
                dataInput={debounceDataInput}
                listDataSearch={listSearch}
                totalData={totalData}
                wrapperRef={wrapperRef}
                forceBoxSearchOpen={forceBoxSearchOpen}
                forceBoxSearchClose={forceBoxSearchClose}
            />
        </div>
    );
}

export default Search;
