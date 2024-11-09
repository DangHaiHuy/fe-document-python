import { Link } from 'react-router-dom';
import Button from '../Button';
import styles from './Header.module.css';
import Search from '../Search';
import Avatar from '../Avatar';
import { memo, useContext } from 'react';
import { Context } from '../../Context';

function Header({ isAuthenticated }) {
    const contextValue = useContext(Context);

    const userDetails = isAuthenticated && contextValue ? contextValue.userDetails : null;
    console.log(isAuthenticated)

    return (
        <div className={styles.wrapper}>
            <div className="grid wide" style={{ height: '100%' }}>
                <div className={styles.container}>
                    <div>
                        <img className={styles.logo} src={require('../../Assets/Images/document.svg').default}></img>
                    </div>
                    {isAuthenticated ? <Search></Search> : <></>}
                    {isAuthenticated ? (
                        <Avatar userDetails={userDetails}></Avatar>
                    ) : (
                        <div>
                            <Link to="/register" className={styles.btn}>
                                <Button className="abc" outline size="medium">
                                    Đăng ký
                                </Button>
                            </Link>
                            <Link to="/login" className={styles.btn}>
                                <Button className="abc" primary size="medium">
                                    Đăng nhập
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(Header);
