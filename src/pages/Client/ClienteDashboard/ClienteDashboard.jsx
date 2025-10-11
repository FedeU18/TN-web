import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth";
import styles from "./ClienteDashboard.module.css";

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();        //limpia el token
        navigate("/");   //redirige al home
    };

  return (
    <div className={styles.container}>
      <div className={styles.welcomeContainer}>
        <h1 className={styles.title}>¡Bienvenido {user?.nombre || "Usuario"}!</h1>
        <p className={styles.greeting}>Dashboard del rol Cliente.</p>
        <p className={styles.subtitle}>Desde aquí podrás realizar y gestionar tus pedidos.</p>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.primaryButton}>Hacer Pedido</button>
        <button className={styles.secondaryButton}>Mis Pedidos</button>
        <Link to="/profile" className={styles.secondaryButton}>Mi Perfil</Link>
      </div>

      <button className={styles.logoutButton} onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}