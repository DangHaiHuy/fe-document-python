import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Pagination.module.css';
import { faAnglesLeft, faAnglesRight} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

function Pagination({ page, maxPage, setPage }) {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxButtons = 5;
        let startPage, endPage;

        if (maxPage <= maxButtons) {
            startPage = 1;
            endPage = maxPage;
        } else {
            if (page <= Math.ceil(maxButtons / 2)) {
                startPage = 1;
                endPage = maxButtons;
            } else if (page + Math.floor(maxButtons / 2) >= maxPage) {
                startPage = maxPage - maxButtons + 1;
                endPage = maxPage;
            } else {
                startPage = page - Math.floor(maxButtons / 2);
                endPage = page + Math.floor(maxButtons / 2);
            }
        }

        // Điều chỉnh lại để có đủ số lượng nút phân trang
        if (endPage - startPage + 1 < maxButtons) {
            if (startPage === 1) {
                endPage = Math.min(startPage + maxButtons - 1, maxPage);
            } else if (endPage === maxPage) {
                startPage = Math.max(endPage - maxButtons + 1, 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };
    const handleBtnClick = (pag) => {
        setPage(pag);
    };

    const pageNumbers = getPageNumbers();
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.item} onClick={()=>{
                    setPage(1);
                }}>
                    <FontAwesomeIcon icon={faAnglesLeft} />
                </div>
                {pageNumbers.map((pag, index) => {
                    return (
                        <div
                            className={clsx(styles.item, {
                                [styles.active]: pag === page,
                            })}
                            key={index}
                            onClick={() => handleBtnClick(pag)}
                        >
                            {pag}
                        </div>
                    );
                })}
                <div className={styles.item} onClick={()=>{
                    setPage(pageNumbers[pageNumbers.length-1]);
                }}>
                    <FontAwesomeIcon icon={faAnglesRight} />
                </div>
            </div>
        </div>
    );
}

export default Pagination;
