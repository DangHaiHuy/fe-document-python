import Footer from '../../Components/Footer';
import Header from '../../Components/Header';
import styles from './HeaderOnly.module.css';

function HeaderOnly({ children, isAuthenticated }) {
    return (
        <div className={`grid ${styles.wrapper}`}>
            <Header isAuthenticated={isAuthenticated}></Header>
            <div className={styles.container}>{children}</div>
            <Footer />
        </div>
    );
}

export default HeaderOnly;
