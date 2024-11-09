import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Loading.module.css'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Loading() {
    return (
        <>
            <div className={styles.wrapper}></div>
            <div className={styles.container}>
                <FontAwesomeIcon icon={faSpinner} className={styles.spin} />
            </div>
        </>
    );
}

export default Loading;
