import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <--- usamos useNavigate
import { forgotPasswordRequest } from "../../api/auth";
import styles from "./RecuperarContra.module.css";

export default function RecuperarContra() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <--- hook para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Por favor, ingrese su correo electrónico.");
      setLoading(false);
      return;
    }

    try {
      const response = await forgotPasswordRequest(email);

      // Redirigimos al formulario de verificar token y pasamos el mensaje como estado
      navigate("/verify-token", {
        state: { successMessage: response.data.message, email },
      });

      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar el enlace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={styles.title}>Recuperar Contraseña</h1>
      <form className={styles.centeredContainer} onSubmit={handleSubmit}>
        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.formGroup}>
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
        </button>
      </form>
    </div>
  );
}
