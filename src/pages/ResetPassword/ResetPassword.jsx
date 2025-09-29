import { useState } from "react";
import { resetPasswordRequest } from "../../api/auth";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      setError("Por favor complete ambos campos.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const res = await resetPasswordRequest({ token, newPassword });
      setSuccess(res.data.message);
      logout();
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <p className={styles.success}>{success} Redirigiendo al login...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Restablecer Contraseña</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <input
          className={styles.inputField}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nueva contraseña"
          required
        />

        <input
          className={styles.inputField}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmar contraseña"
          required
        />

        <button
          className={`${styles.btn} ${styles.btnSubmit}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Cambiando..." : "Cambiar Contraseña"}
        </button>
      </form>
    </div>
  );
}