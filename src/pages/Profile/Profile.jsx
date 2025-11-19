import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../libs/axios";
import UserProfile from "../../components/UserProfile/UserProfile";
import OrderHistory from "../../components/OrderHistory/OrderHistory";
import ChangePassword from "../../components/ChangePassword/ChangePassword";
import styles from "./Profile.module.css";

export default function Profile() {
  const [showHistory, setShowHistory] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const toggleHistory = () => setShowHistory((prev) => !prev);
  const toggleEdit = () => setShowEdit((prev) => !prev);
  const toggleForm = () => setShowForm((prev) => !prev);

  // Cargar info del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const res = await axios.get("/users/me");
        setUser(res.data);
      } catch (e) {
        console.error(e);
        alert("Error al cargar usuario");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className={styles.profileContainer}>
      {/* ================================
            INFO DEL USUARIO ARRIBA
        ================================= */}
      {loadingUser ? (
        <p>Cargando usuario...</p>
      ) : user ? (
        <div className={styles.userInfoCard}>
          <h2>Mi Perfil</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.rol}
          </p>
          <p>
            <strong>Registrado:</strong>{" "}
            {new Date(user.fecha_registro).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>No se pudo cargar la información del usuario.</p>
      )}
      {/* ================================
            BOTONES Y SECCIONES
        ================================= */}
      <button className={styles.historyBtn} onClick={toggleHistory}>
        {showHistory ? "Ocultar historial" : "Ver historial de pedidos"}
      </button>
      {showHistory && <OrderHistory />}
      <button className={styles.historyBtn} onClick={toggleEdit}>
        {showEdit ? "Ocultar edición" : "Editar perfil"}
      </button>
      {showEdit && <UserProfile />} {/* ESTE FORM YA NO MUESTRA EMAIL/ROL */}
      <button className={styles.historyBtn} onClick={toggleForm}>
        {showForm ? "Ocultar formulario" : "Cambiar contraseña"}
      </button>
      {showForm && <ChangePassword />}
    </div>
  );
}
