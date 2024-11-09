import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ToastMessage.module.css';
import { faCircleCheck, faCircleXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { v4 } from 'uuid';

const ToastMessage = forwardRef((_, ref) => {
    const [listMessage, setListMessage] = useState([]);
    const removeMessage = (indexToRemove) => {
        setListMessage((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    useImperativeHandle(ref, () => ({
        addMessage(isSuccess, message) {
            let id;
            setListMessage((prev) => {
                id = v4();
                return [...prev, { id, isSuccess, message }];
            });
            setTimeout(() => {
                setListMessage((prev) => {
                    return prev.filter((toast) => toast.id !== id);
                });
            }, 2000);
        },
    }));

    return (
        <div className={styles.wrapper}>
            {listMessage.map((message, index) => {
                return (
                    <div
                        className={styles.container}
                        style={{ backgroundColor: `${message.isSuccess ? '#a2d850' : '#eb7474'}` }}
                        key={index}
                    >
                        {message.isSuccess && (
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                                style={{ color: 'green', fontSize: '24px', margin: '0 12px' }}
                            />
                        )}
                        {!message.isSuccess && (
                            <FontAwesomeIcon
                                icon={faCircleXmark}
                                style={{ color: 'red', fontSize: '24px', margin: '0 12px' }}
                            />
                        )}
                        <div className={styles.body}>
                            <h3>{message.isSuccess ? 'Success' : 'Error'}</h3>
                            <p className={styles.message}>{message.message}</p>
                        </div>
                        <div
                            className={styles.iconWrapper}
                            onClick={() => {
                                removeMessage(index);
                            }}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export default ToastMessage;
