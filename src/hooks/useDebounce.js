import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const TimeID = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        // console.log(TimeID);
        return () => {
            // console.log(TimeID);
            clearTimeout(TimeID);
        };
    }, [value]);
    return debouncedValue;
}

export default useDebounce;
