import { useContext, useEffect, useState } from 'react';
import styles from './About.module.css';
import Image from '../Image';
import { ToastContext } from '../../Context/ToastContext';


function About() {
    
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.image}>
                    <Image />
                </div>
            </div>
        </>
    );
}

export default About;
