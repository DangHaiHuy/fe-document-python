import styles from './Image.module.css';

function Image() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container} />
            <div className={styles.content}>
                <h1 className={styles.header}>PTIT DOCUMENT</h1>
                <p className={styles.sumary}>Sharing, support, free</p>
            </div>
        </div>
    );
}

export default Image;
