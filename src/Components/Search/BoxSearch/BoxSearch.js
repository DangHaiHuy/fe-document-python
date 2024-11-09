import { Link, useNavigate } from 'react-router-dom';
import styles from './BoxSearch.module.css';
import { useEffect, useState } from 'react';

function BoxSearch({ dataInput, listDataSearch, totalData, wrapperRef, forceBoxSearchOpen, forceBoxSearchClose }) {
    const [isBoxSearchOpen, setIsBoxSearchOpen] = useState(false);
    const navigate = useNavigate();
    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsBoxSearchOpen(false); // Đóng menu khi click bên ngoài
        }
    };
    useEffect(() => {
        if (isBoxSearchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        // Dọn dẹp sự kiện khi component unmount hoặc khi menu đóng
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isBoxSearchOpen]);
    useEffect(() => {
        setIsBoxSearchOpen(true);
    }, [dataInput, forceBoxSearchOpen]);
    useEffect(() => {
        setIsBoxSearchOpen(false);
    }, [forceBoxSearchClose]);
    return (
        <>
            {totalData > 0 && isBoxSearchOpen && (
                <div className={styles.wrapper}>
                    <div className={styles.container}>
                        {listDataSearch.map((data, index) => {
                            return (
                                <Link
                                    to={`/document/${data.slug}`}
                                    className={styles.link}
                                    key={index}
                                    onClick={() => {
                                        setIsBoxSearchOpen(false);
                                    }}
                                >
                                    <div className={styles.item} key={index}>
                                        <p className={styles.content}>{data.name}</p>
                                    </div>
                                </Link>
                            );
                        })}
                        {totalData > 4 && (
                            <div
                                className={styles.item}
                                onClick={() => {
                                    navigate(`/document?name=${dataInput}`);
                                    setIsBoxSearchOpen(false);
                                }}
                            >
                                <p className={styles.content}>...</p>
                            </div>
                        )}
                    </div>
                    <div className={styles.footer}>
                        <p>{`Found ${totalData} search ${totalData > 1 ? 'results' : 'result'}`}</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default BoxSearch;
