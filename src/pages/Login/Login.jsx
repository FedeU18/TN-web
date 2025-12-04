import { Link, useNavigate } from "react-router-dom";
import { validateLogin } from "../../utils/validations";
import { loginRequest } from "../../api/auth";
import { useAuthStore } from "../../store/auth";
import { useState } from "react";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button/Button";
import styles from "./Login.module.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [logeado, setLogeado] = useState(false); //estado logeado
  const [showModalRepartidor, setShowModalRepartidor] = useState(false);
  const navigate = useNavigate();

  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validation = validateLogin(form);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    try {
      const response = await loginRequest(form.email, form.password);
      const data = response.data;

      //bloquear el acceso del repartidor a la web
      if (data.user.rol === "repartidor") {
        setShowModalRepartidor(true);
        return;
      }

      //guarda el token en el store global solo si no es repartidor
      setToken(data.token);
      setUser(data.user);

      //marca como logeado
      setLogeado(true);

      //redirige al dashboard según el rol
      switch (data.user.rol) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "cliente":
          navigate("/cliente-dashboard");
          break;
        /*case "repartidor":
          navigate("/repartidor-dashboard");
          break;*/
        case "vendedor":
          navigate("/vendedor-dashboard");
          break;
        default:
          setError("Rol no reconocido");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error en el login");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img src="/2630732.png" alt="logo" />
        <h2>Track Now</h2>
        <h3>Tu solución de seguimiento de paquetes</h3>
      </div>
      <form className={styles.centeredContainer} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Iniciar Sesión</h1>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className={styles.inputField}
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />

        <PasswordInput
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br />

        {error && <p className={styles.errorMessage}>{error}</p>}

        <Link to="/recuperarContra" className={styles.linkForgot}>
          ¿Olvidaste tu contraseña?
        </Link>
        <br />

        <ButtonSecondary type="submit" style={{ width: '100%', marginTop: '1rem' }}>
          Iniciar sesión
        </ButtonSecondary>

        <div>
          <Link to="../" className={styles.linkBack}>
            Volver al menú principal
          </Link>
        </div>
      </form>

      {/* modal para repartidores bloqueados */}
      {showModalRepartidor && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Acceso no permitido</h2>
            <p>
              Los repartidores solo pueden iniciar sesión desde la aplicación
              móvil.
            </p>

            <button
              onClick={() => setShowModalRepartidor(false)}
              className={styles.btn}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
