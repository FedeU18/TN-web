import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest } from "../../api/auth";
import {
  validateRegistrationStep1,
  validateRegistrationStep2,
} from "../../utils/validations";

import styles from "./Register.module.css";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    rol: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setError("");
    const validation = validateRegistrationStep1(form);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    setStep(2);
  };

  const prevStep = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validation = validateRegistrationStep2(form);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    try {
      await registerRequest(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrarse");
    }
  };

  return (
    <div>
      <h1 className={styles.title}>Registro</h1>
      <form
        className={styles.centeredContainer}
        onSubmit={handleSubmit}
      >
        {step === 1 && (
          <>
            <input
              name="nombre"
              placeholder="Nombre"
              className={styles.inputField}
              value={form.nombre}
              onChange={handleChange}
            />
            <input
              name="apellido"
              placeholder="Apellido"
              className={styles.inputField}
              value={form.apellido}
              onChange={handleChange}
            />
            <input
              name="telefono"
              type="text"
              placeholder="Teléfono"
              className={styles.inputField}
              value={form.telefono}
              onChange={handleChange}
            />

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={nextStep}
              >
                Siguiente
              </button>

              <Link to="/" className={styles.linkBack}>
                Volver al menú principal
              </Link>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className={styles.inputField}
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className={styles.inputField}
              value={form.password}
              onChange={handleChange}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar Contraseña"
              className={styles.inputField}
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Registrarse
              </button>

              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={prevStep}
              >
                Volver
              </button>

              <Link to="/" className={styles.linkBack}>
                Volver al menú principal
              </Link>
            </div>
          </>
        )}
      </form>

      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}