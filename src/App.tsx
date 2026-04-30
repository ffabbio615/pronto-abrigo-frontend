import './App.scss';
import {api} from "./services/api";
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/shelter/register/ShelterRegister";
import PrivateRoute from "./routes/PrivateRoutes";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/home/Home";
import AlertBox from './components/alertBox/AlertBox';
import SpinLoader from './components/loader/SpinLoader';
import LandingPage from './pages/landing/LandingPage';
import ConfirmBox from './components/confirmBox/ConfirmBox';

export default function App() {

  useEffect(() => {
    setInterval(() => {
      api.get("/shelters"); // endpoint simples para acordar o backend e evitar lentidão no primeiro acesso
    }, 300000);
  }, []);

  return (
    <>
      <AlertBox />
      <ConfirmBox />
      <SpinLoader />
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path='/' element={<LandingPage />} />
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
