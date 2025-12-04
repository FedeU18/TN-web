import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/auth";
import { ButtonPrimary, ButtonSecondary } from "../../../components/Button/Button";
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
            <Link to="/mis-pedidos">
              <ButtonPrimary>Mis Pedidos</ButtonPrimary>
            </Link>
          </div>
          <div>
            <h2 className={styles.subtitle}>
              Desde aquí podrás ver y editar la información de tu perfil
            </h2>
            <Link to="/profile">
              <ButtonSecondary>Mi Perfil</ButtonSecondary>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
