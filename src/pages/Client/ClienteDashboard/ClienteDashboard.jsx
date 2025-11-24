import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/auth";
import styles from "./ClienteDashboard.module.css";

export default function ClienteDashboard() {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días,';
    if (hour < 20) return 'Buenas tardes,';
    return 'Buenas noches,';
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcomeContainer}>
        <h1 className={styles.title}>
          ¡{getGreeting()} {user?.nombre || "Usuario"}!
        </h1>
        <div className={styles.optionsContainer}>
          <div>
            <h2 className={styles.subtitle}>
              Desde aquí podrás gestionar y seguir las entregas de tus pedidos
            </h2>
            <Link to="/mis-pedidos" className={styles.primaryButton}>
              Mis Pedidos
            </Link>
          </div>
          <div>
            <h2 className={styles.subtitle}>
              Desde aquí podrás ver y editar la información de tu perfil
            </h2>
            <Link to="/profile" className={styles.secondaryButton}>
              Mi Perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
