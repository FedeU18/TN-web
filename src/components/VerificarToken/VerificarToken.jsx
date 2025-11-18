import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyResetTokenRequest } from "../../api/auth";
import { useAuthStore } from "../../store/auth";
import styles from "./VerificarToken.module.css";

export default function VerificarToken() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const location = useLocation();
  const successMessage = location.state?.successMessage || "";
  const email = location.state?.email || ""; // 👈 Guardamos el email

  const [tokenInput, setTokenInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!tokenInput) {
      setError("Por favor ingrese el código.");
      setLoading(false);
      return;
    }

    try {
      const res = await verifyResetTokenRequest(email, tokenInput); // 👈 enviamos email + code
      if (res.data.valid) {
        setToken(tokenInput);
        navigate("/reset-password", { state: { email, code: tokenInput } }); // 👈 pasamos email y code
      } else {
        setError("Código inválido o expirado.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error verificando el código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Verificar Código</h1>

      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.errorMessage}>{error}</p>}

        <input
          className={styles.inputField}
          type="text"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Código de 4 dígitos"
          required
        />

        <button
          className={`${styles.btn} ${styles.btnVerify}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Verificando..." : "Verificar"}
        </button>
      </form>
    </div>
  );
}
