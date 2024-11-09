import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ModalConfirm.module.css';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import { useState } from 'react';

function ModalConfirm({
    modalConfirmDelete,
    setModalConfirmDelete,
    setToggleReload,
    handleSubmit,
    paramFunctionSubmit,
}) {
    const [loading, setLoading] = useState(false);
    const handleClose = () => {
        setModalConfirmDelete(false);
    };
    const handleClickSubmit = async (id) => {
        setLoading(true);
        await handleSubmit(id);
        setLoading(false);
        setModalConfirmDelete(false);
        setToggleReload((prev) => !prev);
    };
    return (
        <>
            {modalConfirmDelete && (
                <div className={styles.wrapper}>
                    <div className={styles.container}>
                        <h3 className={styles.text}>Confirm deletion?</h3>
                        <div className={styles.submit}>
                            <Button size="small" outline onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                size="small"
                                primary
                                onClick={() => handleClickSubmit(paramFunctionSubmit)}
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
                    </div>
                </div>
            )}
        </>
    );
}

export default ModalConfirm;
