import { faBook, faClock, faEye, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import styles from './Book.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons/faHeart';
import { useContext, useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { getToken } from '../../Services/CookieService';
import { ToastContext } from '../../Context/ToastContext';

function Book({ folder, kebabName }) {
    const [toggleHeart, setToggleHeart] = useState(folder.liked);
    const [heartValue, setHeartValue] = useState(folder.star);
    const [fakeValueStarBe, setFakeValueStarBe] = useState(folder.star);
    const heartValueDebounce = useDebounce(heartValue, 300);
    const [isDebounced, setIsDebounced] = useState(false); //để lần mount đầu không gọi api
    const [isPending, setIsPending] = useState(false);
    const toastContextValue = useContext(ToastContext);
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/document/${kebabName}`);
    };
    const handleClickLike = () => {
        if (!isPending) {
            setToggleHeart((prev) => !prev);
            setHeartValue((prev) => prev + 1);
        }
    };
    const handleClickUnlike = () => {
        if (!isPending) {
            setToggleHeart((prev) => !prev);
            setHeartValue((prev) => prev - 1);
        }
    };
    useEffect(() => {
        if (isDebounced) {
            const updateLike = async () => {
                setIsPending(true);
                const accessToken = await getToken();
                if (!accessToken) {
                    navigate('/login');
                }
                if (heartValueDebounce > fakeValueStarBe) {
                    try {
                        const res = await fetch(`${process.env.REACT_APP_API_URL}users/my-favorites/add/${folder.id}`, {
                            method: 'PUT',
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });
                        const data = await res.json();
                        if (data.code != 1000) {
                            throw new Error(JSON.stringify(data));
                        }
                        setFakeValueStarBe((prev) => prev + 1);
                        setIsPending(false);
                    } catch (e) {
                        const dataError = JSON.parse(e.message);
                        addMessage(false, dataError.error_message || dataError.message);
                        setToggleHeart((prev) => !prev);
                        setHeartValue((prev) => prev - 1);
                        setIsPending(false);
                    }
                } else if (heartValueDebounce < fakeValueStarBe) {
                    try {
                        const res = await fetch(
                            `${process.env.REACT_APP_API_URL}users/my-favorites/delete/${folder.id}`,
                            {
                                method: 'DELETE',
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            },
                        );
                        const data = await res.json();
                        if (data.code != 1000) {
                            throw new Error(JSON.stringify(data));
                        }
                        setFakeValueStarBe((prev) => prev - 1);
                        setIsPending(false);
                    } catch (e) {
                        const dataError = JSON.parse(e.message);
                        addMessage(false, dataError.error_message || dataError.message);
                        setToggleHeart((prev) => !prev);
                        setHeartValue((prev) => prev + 1);
                        setIsPending(false);
                    }
                }
            };
            updateLike();
        }
    }, [heartValueDebounce, isDebounced]);
    useEffect(() => {
        if (heartValueDebounce !== folder.star) {
            setIsDebounced(true);
        }
    }, [heartValueDebounce]);

    return (
        <div className={styles.box}>
            <div className={styles.header}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={faBook} />
                </div>
                <h3 className={styles.name}>{folder.name}</h3>
            </div>
            <div className={styles.body}>
                <div className={styles.content}>
                    <div className={styles.icon}>
                        <FontAwesomeIcon icon={faClock} />
                    </div>
                    <p className={styles.name}>
                        {new Date(folder.create_at).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })}
                    </p>
                </div>
                <div className={styles.content}>
                    <div className={styles.icon}>
                        <img className={styles.avatar} src={folder.author.picture}></img>
                    </div>
                    <p className={styles.name}>{`${folder.author.last_name} ${folder.author.first_name}`}</p>
                </div>
                <div className={styles.content}>
                    <div className={styles.icon}>
                        <FontAwesomeIcon icon={faEye} />
                    </div>
                    <p className={styles.name}>{`View: ${folder.view}`}</p>
                </div>
            </div>
            <Button primary size="small" className={styles.btn} onClick={handleClick}>
                Xem
            </Button>
            {!toggleHeart && (
                <div className={styles.heart} onClick={handleClickLike}>
                    <FontAwesomeIcon icon={faHeartRegular} className={styles.iconHeart}></FontAwesomeIcon>
                    <p className={styles.value}>{heartValue}</p>
                </div>
            )}
            {toggleHeart && (
                <div className={styles.heart} onClick={handleClickUnlike}>
                    <FontAwesomeIcon
                        icon={faHeartSolid}
                        className={`${styles.iconHeart} ${styles.active}`}
                    ></FontAwesomeIcon>
                    <p className={styles.value}>{heartValue}</p>
                </div>
            )}
            <div className={styles.margin}>
                <div className={styles.subMargin}></div>
            </div>
        </div>
    );
}

export default Book;
