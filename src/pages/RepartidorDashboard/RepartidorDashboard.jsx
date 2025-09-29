import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import styles from "./RepartidorDashboard.module.css";

export default function RepartidorDashboard() {
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
        <p className={styles.greeting}>Dashboard del rol Repartidor.</p>
        <p className={styles.subtitle}>Desde aquí podrás gestionar tus entregas y rutas.</p>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.primaryButton}>Lista de Pedidos</button>
        <button className={styles.secondaryButton}>Entregas Pendientes</button>
        <button className={styles.secondaryButton}>Historial</button>
        <button className={styles.secondaryButton}>Mi Perfil</button>
      </div>

      <button className={styles.logoutButton} onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}