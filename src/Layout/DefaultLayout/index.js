import Footer from '../../Components/Footer';
import Header from '../../Components/Header';
import Sidebar from '../../Components/Sidebar';
import styles from './DefaultLayout.module.css';

function DefaultLayout({ children, isAuthenticated }) {
    return (
        <>
            <Header isAuthenticated={isAuthenticated}></Header>
            <div className={styles.container}>
                <Sidebar></Sidebar>
                <div className={`grid wide ${styles.box}`}>
                    <div className={styles.content}>{children}</div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
}

export default DefaultLayout;
