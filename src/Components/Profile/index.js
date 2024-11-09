import { useContext, useEffect, useState } from 'react';
import Button from '../Button';
import styles from './Profile.module.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Context } from '../../Context';
import { getToken } from '../../Services/CookieService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faSpinner } from '@fortawesome/free-solid-svg-icons';
import ModalUploadAvatar from '../ModalUploadAvatar';
import { ToastContext } from '../../Context/ToastContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const contextValue = useContext(Context);

    const userDetails = contextValue && contextValue.userDetails;

    const [profile, setProfile] = useState(userDetails);
    const [avatar, setAvatar] = useState();
    const [loading, setLoading] = useState(false);
    const [errorPhone, setErrorPhone] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorDob, setErrorDob] = useState('');
    const [modalUploadAvatar, setModalUploadAvatar] = useState(false);
    const toastContextValue = useContext(ToastContext);
    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };
    const nav = useNavigate();

    console.log(profile.dob);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        const submit = async () => {
            try {
                setLoading(true);
                const dataRequest = {
                    first_name: profile.firstName,
                    last_name: profile.lastName,
                    dob: formatDateSubmit(profile.dob),
                    location: profile.location,
                    phone: profile.phone,
                    email: profile.email,
                };
                const accessToken = await getToken();
                if (!accessToken) nav('/login');
                const res = await fetch(`${process.env.REACT_APP_API_URL}users/${profile.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataRequest),
                });
                const dataRes = await res.json();
                if (dataRes.code != 1000) {
                    throw new Error(JSON.stringify(dataRes));
                }
                addMessage(true, 'Submitted successfully');
            } catch (e) {
                const dataError = JSON.parse(e.message);
                addMessage(false, dataError?.errMessage || dataError?.message);
            }
            setLoading(false);
        };
        submit();
    };
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const formatDateSubmit = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    };
    useEffect(() => {
        const picker = flatpickr('#datepicker', {
            dateFormat: 'd/m/Y',
            position: 'below',
            maxDate: 'today',
            defaultDate:
                profile.dob != null
                    ? profile.dob.split('-')[2] + '-' + profile.dob.split('-')[1] + '-' + profile.dob.split('-')[0]
                    : '', //chỉ nhận dd-mm-yyyy
            onChange: (selectedDate) => {
                setErrorDob('');
                setProfile((prev) => ({
                    ...prev,
                    dob: formatDate(selectedDate[0]),
                }));
            },
        });
        return () => {
            picker.destroy();
        };
    }, [profile.dob]);
    useEffect(() => {
        setProfile(userDetails);
        setAvatar(userDetails.picture);
    }, [userDetails]);
    return (
        <>
            <div className={styles.wrapper}>
                <div className="grid wide">
                    <h1 className={styles.header}>Update Profile</h1>
                    <div className={styles.box}>
                        <div className={styles.avatarWrapper}>
                            <div className={styles.avatarBox}>
                                <img src={avatar} alt="avatar" className={styles.avatar}></img>
                                <div className={styles.edit} onClick={() => setModalUploadAvatar(true)}>
                                    <FontAwesomeIcon icon={faPencil} className={styles.icon} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.container}>
                            <form className="row">
                                <div className={`col l-6 m-12 c-12 ${styles.inputBox}`}>
                                    <div>
                                        <label className={styles.label} htmlFor="username">
                                            Username
                                        </label>
                                    </div>
                                    <input
                                        className={`${styles.input} ${styles.disabled}`}
                                        placeholder="username"
                                        id="username"
                                        disabled
                                        value={profile.username != null ? profile.username : ''}
                                        readOnly
                                    ></input>
                                </div>
                                <div className={`col l-6 m-12 c-12 ${styles.inputBox}`}>
                                    <div>
                                        <label className={styles.label} htmlFor="fullname">
                                            Fullname
                                        </label>
                                    </div>
                                    <input
                                        className={`${styles.input} ${styles.disabled}`}
                                        placeholder="fullname"
                                        id="fullname"
                                        value={`${profile.lastName} ${profile.firstName}`}
                                        readOnly
                                        disabled
                                    ></input>
                                </div>
                                <div className={`col l-6 m-12 c-12 ${styles.inputBox}`}>
                                    <div>
                                        <label className={styles.label} htmlFor="phone">
                                            Phone
                                        </label>
                                    </div>
                                    <input
                                        type="tel"
                                        className={styles.input}
                                        placeholder="phone"
                                        id="phone"
                                        value={profile.phone != null ? profile.phone : ''}
                                        onChange={(e) => {
                                            setErrorPhone('');
                                            setProfile((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }));
                                        }}
                                        pattern="[0-9]{10}"
                                    ></input>
                                    {errorPhone && <span className={styles.error}>{errorPhone}</span>}
                                </div>
                                <div className={`col l-6 m-12 c-12 ${styles.inputBox}`}>
                                    <div>
                                        <label className={styles.label} htmlFor="email">
                                            Email
                                        </label>
                                    </div>
                                    <input
                                        disabled
                                        type="email"
                                        className={`${styles.input} ${styles.disabled}`}
                                        placeholder="email"
                                        id="email"
                                        value={profile.email != null ? profile.email : ''}
                                        onChange={(e) => {
                                            setErrorPhone('');
                                            setProfile((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }));
                                        }}
                                    ></input>
                                    {errorEmail && <span className={styles.error}>{errorEmail}</span>}
                                </div>
                                <div className={`col l-6 m-12 c-12 ${styles.inputBox}`}>
                                    <div>
                                        <label className={styles.label} htmlFor="lastname">
                                            Lastname
                                        </label>
                                    </div>
                                    <input
                                        className={styles.input}
                                        placeholder="lastname"
                                        id="lastname"
                                        value={profile.lastName != null ? profile.lastName : ''}
                                        onChange={(e) =>
                                            setProfile((prev) => ({
                                                ...prev,
                                                lastName: e.target.value,
                                            }))
                                        }
                                    ></input>
                                </div>
                                <div className={`col l-6 m-12 c-12 ${styles.inputBox}`}>
                                    <div>
                                        <label className={styles.label} htmlFor="firstname">
                                            Firstname
                                        </label>
                                    </div>
                                    <input
                                        className={styles.input}
                                        placeholder="firstname"
                                        id="firstname"
                                        value={profile.firstName != null ? profile.firstName : ''}
                                        onChange={(e) =>
                                            setProfile((prev) => ({
                                                ...prev,
                                                firstName: e.target.value,
                                            }))
                                        }
                                    ></input>
                                </div>
                                <div className={`col l-6 m-12 c-12 ${styles.inputBox}`}>
                                    <div>
                                        <label className={styles.label} htmlFor="datepicker">
                                            Birthday
                                        </label>
                                    </div>
                                    <input
                                        type="date"
                                        className={styles.input}
                                        placeholder="birthday"
                                        id="datepicker"
                                        // value={profile.dob}
                                        readOnly
                                    ></input>
                                    {errorDob && <span className={styles.error}>{errorDob}</span>}
                                </div>
                                <div className={`col l-6 m-12 c-12 ${styles.inputBox}`}>
                                    <div>
                                        <label className={styles.label} htmlFor="location">
                                            Location
                                        </label>
                                    </div>
                                    <input
                                        className={styles.input}
                                        placeholder="location"
                                        id="location"
                                        value={profile.location != null ? profile.location : ''}
                                        onChange={(e) =>
                                            setProfile((prev) => ({
                                                ...prev,
                                                location: e.target.value,
                                            }))
                                        }
                                    ></input>
                                </div>
                                <div className={`col l-12 m-12 c-12 ${styles.btn}`}>
                                    <Button
                                        primary
                                        className={styles.submit}
                                        size="big"
                                        onClick={handleSubmitForm}
                                        rightIcon={
                                            loading && (
                                                <div className={styles.loading}>
                                                    <FontAwesomeIcon icon={faSpinner} className={styles.spin} />
                                                </div>
                                            )
                                        }
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {modalUploadAvatar && (
                <ModalUploadAvatar
                    setModalUploadAvatar={setModalUploadAvatar}
                    avatar={avatar}
                    setAvatar={setAvatar}
                    userId={profile.id}
                />
            )}
        </>
    );
}

export default Profile;
