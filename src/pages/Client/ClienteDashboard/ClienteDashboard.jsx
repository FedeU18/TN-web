import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/auth";
import { ButtonPrimary } from "../../../components/Button/Button";
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
        <p className={styles.subtitle}>
          Desde acá podés gestionar y seguir tus entregas
        </p>
      </div>

      <div className={styles.buttonContainer}>
        <Link to="/mis-pedidos">
          <ButtonPrimary className={styles.dashboardButton}>Mis Pedidos</ButtonPrimary>
        </Link>
        <Link to="/profile">
          <ButtonPrimary className={styles.dashboardButton}>Mi Perfil</ButtonPrimary>
        </Link>
      </div>
    </div>
  );
}
