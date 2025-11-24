import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/auth";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout(); //limpia el token
    navigate("/"); //redirige al home
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcomeContainer}>
        <h1 className={styles.title}>
          ¡Bienvenido {user?.nombre || "Usuario"}!
        </h1>
        <p className={styles.subtitle}>
          Desde aquí podrás administrar todo el sistema.
        </p>
      </div>

      <div className={styles.buttonContainer}>
        <Link to="/reports-panel" className={styles.primaryButton}>
          Reportes
        </Link>
        <Link to="/admin-panel" className={styles.secondaryButton}>
          Panel
        </Link>
        <Link to="/admin-panel/pedidos" className={styles.primaryButton}>
          Pedidos
        </Link>
      </div>
    </div>
  );
}
