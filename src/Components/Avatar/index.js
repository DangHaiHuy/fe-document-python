import { Link, useNavigate } from 'react-router-dom';
import styles from './Avatar.module.css';
import { useEffect, useRef, useState } from 'react';
import { logOut } from '../../Services/authenticationService';
import { getToken } from '../../Services/CookieService';

function Avatar({ userDetails }) {
    const nav = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const wrapperRef = useRef();
    const handleClick = () => {
        setIsMenuOpen((prev) => !prev);
    };
    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsMenuOpen((prev) => !prev); // Đóng menu khi click bên ngoài
        }
    };
    const handleLogout = () => {
        const token = getToken();
        if (!token) {
            nav('/login');
        }
        const data = {
            token,
        };
        fetch(`${process.env.REACT_APP_API_URL}auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(() => {
            logOut();
            window.location.href = '/';
        });
    };
    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        // Dọn dẹp sự kiện khi component unmount hoặc khi menu đóng
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);
    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <img alt="Avatar" src={userDetails.picture} className={styles.container} onClick={handleClick}></img>
            {isMenuOpen && (
                <div className={styles.menu}>
                    <Link to="/user/profile" className={styles.item} onClick={() => setIsMenuOpen((prev) => !prev)}>
                        Profile
                    </Link>
                    <Link
                        to="/user/change-password"
                        className={styles.item}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                    >
                        Change password
                    </Link>
                    <div className={styles.item} onClick={handleLogout}>
                        Log out
                    </div>
                </div>
            )}
        </div>
    );
}

export default Avatar;
