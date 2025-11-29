import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../libs/axios";
import UserProfile from "../../components/UserProfile/UserProfile";
import OrderHistory from "../../components/OrderHistory/OrderHistory";
import ChangePassword from "../../components/ChangePassword/ChangePassword";
import styles from "./Profile.module.css";
import { useAuthStore } from "../../store/auth";

export default function Profile() {
  const [showHistory, setShowHistory] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const openHistory = () => {
    setShowHistory(true);
    setShowEdit(false);
    setShowForm(false);
  };

  const openEdit = () => {
    setShowHistory(false);
    setShowEdit(true);
    setShowForm(false);
  };

  const openForm = () => {
    setShowHistory(false);
    setShowEdit(false);
    setShowForm(true);
  };

  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); //limpia el token
    navigate("/"); //redirige al home
  };

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
        <div className={styles.profileCard}>
          <div className={styles.header}>
            <div className={styles.avatar}>
              {user.foto_perfil ? (
                <img
                  src={user.foto_perfil}
                  alt="Foto de perfil"
                  className={styles.avatarImg}
                />
              ) : (
                user.nombre?.charAt(0).toUpperCase()
              )}
            </div>
            <div className={styles.userDetails}>
              <h2 className={styles.name}>
                {user.nombre} {user.apellido}
              </h2>
              <p className={styles.role}>{user.rol}</p>
            </div>
          </div>

          <div className={styles.infoSection}>
            <p>
              <strong>Email:</strong> {user.email}
            </p>

            {user.telefono && (
              <p>
                <strong>Teléfono:</strong> {user.telefono}
              </p>
            )}

            {user.direccion && (
              <p>
                <strong>Dirección:</strong> {user.direccion}
              </p>
            )}

            <p>
              <strong>Registrado:</strong>{" "}
              {new Date(user.fecha_registro).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.currentTarget.closest(".header")?.classList.remove("menu-open");
              handleLogout();
            }}
            className={styles.cerrarSesión}
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <div>
          <p>No se pudo cargar la información del usuario.</p>
          <button
            onClick={(e) => {
              e.currentTarget.closest(".header")?.classList.remove("menu-open");
              handleLogout();
            }}
            className={styles.cerrarSesión}
          >
            Cerrar Sesión
          </button>
        </div>
      )}
      <div className={styles.actionsSection}>
        <div className={styles.actionsContainer}>
          <button
            className={`${styles.historyBtn} ${
              showHistory ? styles.activeSection : ""
            }`}
            onClick={openHistory}
          >
            Historial de pedidos
          </button>

          <button
            className={`${styles.historyBtn} ${
              showEdit ? styles.activeSection : ""
            }`}
            onClick={openEdit}
          >
            Editar perfil
          </button>

          <button
            className={`${styles.historyBtn} ${
              showForm ? styles.activeSection : ""
            }`}
            onClick={openForm}
          >
            Cambiar contraseña
          </button>
        </div>
        <div>
          {showHistory && (
            <div className={styles.historyWrapper}>
              <div className={styles.tableResponsive}>
                <OrderHistory />
              </div>
            </div>
          )}
          {showEdit && <UserProfile />}
          {showForm && <ChangePassword />}
        </div>
      </div>
    </div>
  );
}
