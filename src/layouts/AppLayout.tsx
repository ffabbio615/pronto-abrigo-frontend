import { Outlet } from "react-router-dom";
// import Header from "../components/Header";
import CommonBackground from "../components/CommonBackground";

export default function AppLayout() {
  return (
    <>
        <CommonBackground />
        {/* <Header /> */}
        <main>
            <Outlet />
        </main>
    </>
  );
}