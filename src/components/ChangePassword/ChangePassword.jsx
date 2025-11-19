import { useState } from "react";
import axios from "../../libs/axios";
import styles from "./ChangePassword.module.css"; // opcional, podés crear este css

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false); // mostrar/ocultar
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const toggleVisible = () => setVisible(!visible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (form.newPassword !== form.confirmPassword) {
      return setError("Las contraseñas nuevas no coinciden");
    }

    try {
      setLoading(true);

      const res = await axios.put("/users/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setMessage(res.data.message || "Contraseña actualizada correctamente");

      // limpiar formulario
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (e) {
      console.error(e);
      if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else {
        setError("Error al cambiar contraseña");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Cambiar contraseña</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Contraseña actual:
          <input
            type={visible ? "text" : "password"}
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Nueva contraseña:
          <input
            type={visible ? "text" : "password"}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            minLength="6"
          />
        </label>

        <label>
          Confirmar nueva contraseña:
          <input
            type={visible ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
          />
        </label>

        <button
          type="button"
          className={styles.toggleBtn}
          onClick={toggleVisible}
        >
          {visible ? "Ocultar" : "Mostrar"} contraseñas
        </button>

        <button className={styles.saveBtn} type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}
    </div>
  );
}
