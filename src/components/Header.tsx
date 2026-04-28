import { useAuthStore } from "../store/useAuthStore";

export default function Header() {
    const { logout } = useAuthStore();

    return (
        <header>
            Meu Header (logo, nome do abrigo, logout...)
            <button style={{ marginLeft: "20px" }} onClick={logout}>Logout</button>
        </header>
    );
}