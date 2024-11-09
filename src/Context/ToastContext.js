import { createContext, useContext, useRef } from 'react';
import ToastMessage from '../Components/ToastMessage';

const ToastContext = createContext();

function ToastContextProvider({ children }) {
    const toastRef = useRef();
    return (
        <ToastContext.Provider value={{ toastRef }}>
            <ToastMessage ref={toastRef}></ToastMessage>
            {children}
        </ToastContext.Provider>
    );
}

export default ToastContextProvider;
export { ToastContext };
