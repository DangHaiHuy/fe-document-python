import { getToken, removeToken, setToken } from './CookieService';

export const refreshToken = async () => {
    try {
        const data = {
            token: getToken(),
        };
        const response = await fetch(`${process.env.REACT_APP_API_URL}auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const dataResponse = await response.json();
        if (dataResponse.code !== 1000) throw new Error();
        setToken(dataResponse?.result?.token);
    } catch (error) {
        removeToken();
        alert('Error');
        window.location.href = `http://localhost:3000/login`;
    }
};
