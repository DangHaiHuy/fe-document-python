import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Footer.module.css';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';
import { faFacebook, faGithub, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.borderTop}></div>
            <div className={styles.body}>
                <div className='grid wide'>
                    <div className="row">
                        <div className={`col l-6 m-6 c-12 ${styles.column}`}>
                            <img src={require('../../Assets/Images/document.svg').default} className={styles.image}></img>
                        </div>
                        <div className="col l-6 m-6 c-12">
                            <div className="row">
                                <div className="col l-6 m-6 c-6">
                                    <h3 className={styles.header}>Follow us</h3>
                                    <div>
                                        <p className={styles.content}>Facebook</p>
                                        <p className={styles.content}>Github</p>
                                    </div>
                                </div>
                                <div className="col l-6 m-6 c-6">
                                    <h3 className={styles.header}>Legal</h3>
                                    <div>
                                        <p className={styles.content}>Privacy policy</p>
                                        <p className={styles.content}>Term & conditions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.partition}></div>
                        <div className={styles.container} >
                            <div className={styles.copyRight} >
                                <FontAwesomeIcon icon={faCopyright} className={styles.icon}></FontAwesomeIcon>
                                <p className={styles.sumary}>2024 PTIT DOCUMENT</p>
                            </div>
                            <div className={styles.listIcon} >
                                <FontAwesomeIcon icon={faFacebook} className={styles.icon}></FontAwesomeIcon>
                                <FontAwesomeIcon icon={faInstagram} className={styles.icon}></FontAwesomeIcon>
                                <FontAwesomeIcon icon={faGithub} className={styles.icon}></FontAwesomeIcon>
                                <FontAwesomeIcon icon={faYoutube} className={styles.icon}></FontAwesomeIcon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
