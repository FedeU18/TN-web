import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./RecuperarContra.module.css";

export default function RecuperarContra() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Por favor, ingrese su correo electrónico.");
      setLoading(false);
      return;
    }

    try {
      // Simula llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(
        "Se ha enviado un enlace de recuperación a su correo electrónico."
      );
      setEmail("");
    } catch (err) {
      setError(
        "Error al enviar el enlace de recuperación. Inténtelo de nuevo."
      );
    }

    setLoading(false);
  };

  return (
    <div>
      <h1 className={styles.title}>Recuperar Contraseña</h1>
      <form
        className={styles.centeredContainer}
        onSubmit={handleSubmit}
      >
        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p className={styles.successMessage}>{success}</p>}

        <div className={styles.formGroup}>
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
        </button>
      </form>

      <p>
        <Link to="/login" className={styles.linkBack}>
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}