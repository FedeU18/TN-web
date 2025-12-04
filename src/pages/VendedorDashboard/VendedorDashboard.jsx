import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { ButtonPrimary } from "../../components/Button/Button";
import styles from "./VendedorDashboard.module.css";

export default function VendedorDashboard() {
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
          Desde acá podés crear pedidos y gestionar tu perfil
        </p>
      </div>

      <div className={styles.buttonContainer}>
        <Link to="/crear-pedido">
          <ButtonPrimary className={styles.dashboardButton}>Crear Pedido</ButtonPrimary>
        </Link>
        <Link to="/profile">
          <ButtonPrimary className={styles.dashboardButton}>Mi Perfil</ButtonPrimary>
        </Link>
      </div>
    </div>
  );
}
