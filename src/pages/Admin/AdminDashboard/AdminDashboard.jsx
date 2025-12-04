import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/auth";
import { ButtonPrimary } from "../../../components/Button/Button";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días,';
    if (hour < 20) return 'Buenas tardes,';
    return 'Buenas noches,';
  };

  const handleLogout = () => {
    logout(); //limpia el token
    navigate("/"); //redirige al home
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcomeContainer}>
        <h1 className={styles.title}>
          ¡{getGreeting()} {user?.nombre || "Usuario"}!
        </h1>
        <p className={styles.subtitle}>
          Desde aquí podrás administrar todo el sistema.
        </p>
      </div>

      <div className={styles.buttonContainer}>
        <Link to="/admin-panel/pedidos">
          <ButtonPrimary className={styles.dashboardButton}>Pedidos</ButtonPrimary>
        </Link>
        <Link to="/reports-panel">
          <ButtonPrimary className={styles.dashboardButton}>Reportes</ButtonPrimary>
        </Link>
        <Link to="/admin-panel/usuarios">
          <ButtonPrimary className={styles.dashboardButton}>Usuarios</ButtonPrimary>
        </Link>
        <Link to="/admin-panel/calificaciones">
          <ButtonPrimary className={styles.dashboardButton}>Calificaciones</ButtonPrimary>
        </Link>
      </div>
    </div>
  );
}
