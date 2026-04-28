import './App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/shelter/register/ShelterRegister";
import PrivateRoute from "./routes/PrivateRoutes";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/home/Home";
import AlertBox from './components/alertBox/AlertBox';
import SpinLoader from './components/loader/SpinLoader';

export default function App() {

  return (
    <>
      <AlertBox />
      <SpinLoader />
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="shelter/register" element={<Register />} />

          {/* Rotas Privadas */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/home" element={<Home />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
