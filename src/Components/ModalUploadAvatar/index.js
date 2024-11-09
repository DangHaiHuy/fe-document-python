import { useContext, useRef, useState } from 'react';
import styles from './ModalUploadAvatar.module.css';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';
import Button from '../Button';
import setCanvasPreview from '../../Services/setCanvasPreview';
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { getToken } from '../../Services/CookieService';
import { Context } from '../../Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastContext } from '../../Context/ToastContext';
import { useNavigate } from 'react-router-dom';

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

function ModalUploadAvatar({ avatar, setAvatar, setModalUploadAvatar, userId }) {
    const [crop, setCrop] = useState();
    const [imgSrc, setImgSrc] = useState('');
    const [nameFile, setNameFile] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const contextValue = useContext(Context);
    const setToggleReoadContext = contextValue ? contextValue.setToggleReoadContext : () => {};
    const toastContextValue = useContext(ToastContext);
    const nav = useNavigate();

    const addMessage = (isSuccess, message) => {
        toastContextValue?.toastRef?.current?.addMessage(isSuccess, message);
    };

    const uploadImageToFirebase = async (blob) => {
        setLoading(true);
        const firebaseId = v4();
        const storageRef = ref(storage, `images_python/${firebaseId}${nameFile}`);

        try {
            const accessToken = getToken();
            if (!accessToken) nav('/login');
            const res = await uploadBytes(storageRef, blob);
            const linkUrl = await getDownloadURL(storageRef);
            const dataRequest = {
                link_url:linkUrl,
                name_picture_firebase: `${firebaseId}${nameFile}`,
            };
            const response = await fetch(`${process.env.REACT_APP_API_URL}users/update-picture/${userId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataRequest),
            });
            const data = await response.json();
            if (data.code != 1000) {
                throw new Error(JSON.stringify(data));
            }
            addMessage(true, 'Updated successfully');
            setToggleReoadContext((prev) => !prev);
            setModalUploadAvatar(false);
        } catch (e) {
            const dataError = JSON.parse(e.message);
            addMessage(false, dataError?.error_message || dataError?.message);
        } finally {
            setLoading(false);
        }
    };
    const onSelectFile = (e) => {
        const file = e.target.files?.[0];
        setNameFile(file.name);
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || '';
            imageElement.src = imageUrl;

            imageElement.addEventListener('load', (e) => {
                if (error) setError('');
                const { naturalWidth, naturalHeight } = e.currentTarget;
                if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                    setError('Image must be at least 150 x 150 pixels.');
                    return setImgSrc('');
                }
            });
            setImgSrc(imageUrl);
        });
        reader.readAsDataURL(file);
    };
    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

        const crop = makeAspectCrop(
            {
                unit: '%',
                width: cropWidthInPercent,
            },
            ASPECT_RATIO,
            width,
            height,
        );
        const centeredCrop = centerCrop(crop, width, height);
        console.log(centerCrop);
        setCrop(centeredCrop);
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div
                    className={styles.close}
                    onClick={() => {
                        {
                            setModalUploadAvatar(false);
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faClose} className={styles.icon}></FontAwesomeIcon>
                </div>
                {!imgSrc && (
                    <div className={styles.avatarWrapper}>
                        <img src={avatar} className={styles.avatar}></img>
                    </div>
                )}
                {error && <p className="">{error}</p>}
                {imgSrc && (
                    <div className={styles.avatarWrapper}>
                        <ReactCrop
                            crop={crop}
                            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                            circularCrop
                            keepSelection
                            aspect={ASPECT_RATIO}
                            minWidth={MIN_DIMENSION}
                        >
                            <img
                                ref={imgRef}
                                src={imgSrc}
                                alt="Upload"
                                style={{ maxHeight: '70vh' }}
                                onLoad={onImageLoad}
                            />
                        </ReactCrop>
                        <Button
                            size="medium"
                            primary
                            className={styles.btn}
                            onClick={() => {
                                setCanvasPreview(
                                    imgRef.current,
                                    previewCanvasRef.current,
                                    convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height),
                                );
                                previewCanvasRef.current.toBlob((blob) => {
                                    if (blob) {
                                        uploadImageToFirebase(blob);
                                    }
                                }, 'image/jpeg');
                            }}
                            rightIcon={
                                loading && (
                                    <div className="loading">
                                        <FontAwesomeIcon icon={faSpinner} className="spin"></FontAwesomeIcon>
                                    </div>
                                )
                            }
                        >
                            Crop
                        </Button>
                    </div>
                )}
                {crop && (
                    <canvas
                        ref={previewCanvasRef}
                        style={{
                            display: 'none',
                            border: '1px solid black',
                            objectFit: 'contain',
                            width: 150,
                            height: 150,
                        }}
                    />
                )}
                <div className={styles.inputBox}>
                    <input
                        accept="image/*"
                        type="file"
                        className={styles.inputFile}
                        onChange={(e) => {
                            onSelectFile(e);
                        }}
                    ></input>
                </div>
            </div>
        </div>
    );
}

export default ModalUploadAvatar;
