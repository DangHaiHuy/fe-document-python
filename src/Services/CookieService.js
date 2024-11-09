import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const KEY_TOKEN = 'accessToken';

export const setToken = (token) => {
    const decoded = jwtDecode(token);
    const expireTimeInSeconds = decoded.exp; // Lấy thời gian hết hạn của JWT từ 'exp'
    // 2. Chuyển đổi 'exp' thành định dạng Date
    const expireDate = new Date(expireTimeInSeconds * 1000); // 'exp' tính bằng giây
    Cookies.set(KEY_TOKEN, token, { expires: expireDate });
    // localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
    return Cookies.get(KEY_TOKEN);
};

export const removeToken = () => {
    return Cookies.remove(KEY_TOKEN);
};

// function parseJwt(token) {
//     const base64Url = token.split('.')[1]; // Lấy phần payload của JWT
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Chuyển đổi ký tự base64URL thành base64 chuẩn
//     const jsonPayload = decodeURIComponent(
//         atob(base64) // Giải mã base64 thành chuỗi
//             .split('') // Chia chuỗi thành mảng ký tự
//             .map(function (c) {
//                 return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); // Chuyển đổi ký tự thành mã Unicode
//             })
//             .join(''), // Kết hợp lại thành chuỗi
//     );
//     return JSON.parse(jsonPayload); // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
// }
