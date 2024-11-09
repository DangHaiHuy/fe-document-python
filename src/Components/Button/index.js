import styles from './Button.module.css';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
function Button({
    to,
    href,
    primary,
    outline,
    children,
    size,
    text,
    disabled,
    rounded,
    className,
    leftIcon,
    rightIcon,
    onClick,
    ...lastProps
}) {
    let Comp = 'button';
    const props = {
        onClick,
        ...lastProps,
    };
    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    } else if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }
    return (
        <Comp
            className={clsx(styles.wrapper, {
                [styles.primary]: primary,
                [styles.outline]: outline,
                [styles.text]: text,
                [styles.disabled]: disabled,
                [styles.rounded]: rounded,
                [className]: className,
                [styles[size]]: size,
            })}
            {...props}
        >
            {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
            <span className={styles.betweenIcon}>{children}</span>
            {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
        </Comp>
    );
}
export default Button;
