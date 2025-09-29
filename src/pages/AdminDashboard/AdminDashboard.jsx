import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
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
        <p className={styles.greeting}>Dashboard del rol Admin.</p>
        <p className={styles.subtitle}>Desde aquí podrás administrar todo el sistema.</p>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.primaryButton}>Gestionar Usuarios</button>
        <button className={styles.secondaryButton}>Reportes</button>
        <button className={styles.secondaryButton}>Mi Perfil</button>
      </div>

      <button className={styles.logoutButton} onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}