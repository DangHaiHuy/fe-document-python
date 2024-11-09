import About from '../Components/About';
import Authenticate from '../Components/Authenticate';
import ChangePassword from '../Components/ChangePassword';
import File from '../Components/File';
import ForgetPassword from '../Components/ForgetPassword';
import Home from '../Components/Home';
import Login from '../Components/Login';
import Profile from '../Components/Profile';
import Register from '../Components/Register';
import RenderPDF from '../Components/RenderPDF/RenderPDF';
import SettingFolder from '../Components/SettingFolder';
import HeaderOnly from '../Layout/HeaderOnly';

const publicRoutes = [
    { path: '/', component: About, layout: HeaderOnly },
    { path: '/login', component: Login, layout: null },
    { path: '/authenticate', component: Authenticate, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/forget-password', component: ForgetPassword, layout: null },
];
const privateRoutes = [
    { path: '/document', component: Home },
    { path: '/user/profile', component: Profile },
    { path: '/document/:file', component: File },
    { path: '/document/:file/:id', component: RenderPDF },
    { path: '/user/change-password', component: ChangePassword },
];

export { publicRoutes, privateRoutes };
