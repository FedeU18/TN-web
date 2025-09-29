import { Link, useNavigate } from "react-router-dom";
import { validateLogin } from "../../utils/validations";
import { loginRequest } from "../../api/auth";
import { useAuthStore } from "../../store/auth";
import { useState } from "react";
import styles from "./Login.module.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [logeado, setLogeado] = useState(false); //estado logeado
  const navigate = useNavigate();

  const setToken = useAuthStore((state) => state.setToken);

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

      //guarda el token en el store global
      setToken(data.token);

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
        case "repartidor":
          navigate("/repartidor-dashboard");
          break;
        default:
          setError("Rol no reconocido");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error en el login");
    }
  };

  return (
    <form className={styles.centeredContainer} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Iniciar Sesión</h1>

      <input
        type="email"
        name="email"
        placeholder="Email"
        className={styles.inputField}
        value={form.email}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className={styles.inputField}
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

      <button type="submit" className={`${styles.btn} ${styles.btnLogin}`}>
        Iniciar sesión
      </button>

      <div>
        <Link to="../" className={styles.linkBack}>
          Volver al menú principal
        </Link>
      </div>
    </form>
  );
}