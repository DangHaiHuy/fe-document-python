import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Sidebar.module.css';
import { faFolder, faHome, faStar, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

function Sidebar({ children }) {
    const [active, setActive] = useState(1);
    const location = useLocation();

    const listButton = [
        {
            to: '/',
            icon: <FontAwesomeIcon icon={faHome} className={styles.icon} />,
            title: 'Home',
        },
        {
            to: '/document',
            icon: <FontAwesomeIcon icon={faFolder} className={styles.icon} />,
            title: 'Documents',
        },
        
    ];
    const handleBtnClick = (index) => {
        setActive(index);
    };
    useEffect(() => {
        if (location.pathname.startsWith('/document')) {
            setActive(1); // Nút 1 active khi URL bắt đầu với /document
        } else if (location.pathname.startsWith('/upload')) {
            setActive(2); // Nút 2 active khi URL bắt đầu với /favorites
        } else {
            setActive(null); // Không nút nào được active nếu không phải /document hoặc /favorites
        }
    }, [location.pathname]);
    return (
        <div className={styles.wrapper}>
            {listButton.map((btn, index) => {
                return (
                    <Link to={btn.to} className={styles.link} key={index}>
                        <div
                            className={clsx(styles.item, {
                                [styles.active]: index === active,
                            })}
                            onClick={() => {
                                handleBtnClick(index);
                            }}
                        >
                            {btn.icon}
                            <p className={styles.title}>{btn.title}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

export default Sidebar;
