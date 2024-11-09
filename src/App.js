import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './Routes';
import DefaultLayout from './Layout/DefaultLayout';
import PrivateRoute from './Components/PrivateRoute';
import NoLayOut from './Layout/NoLayout';
import "react-image-crop/dist/ReactCrop.css";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = NoLayOut;
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <route.component />
                                    </Layout>
                                }
                            ></Route>
                        );
                    })}
                    {privateRoutes.map((route,index) => {
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = NoLayOut;
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <PrivateRoute layout={Layout}>
                                        {/* <Layout> */}
                                            <route.component />
                                        {/* </Layout> */}
                                    </PrivateRoute>
                                }
                            ></Route>
                        );
                    })}
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
