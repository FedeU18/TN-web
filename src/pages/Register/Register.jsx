import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest } from "../../api/auth";
import {
  validateRegistrationStep1,
  validateRegistrationStep2,
} from "../../utils/validations";
import PasswordInput from "../../components/PasswordInput/PasswordInput";

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

  // Password validation requirements
  const validatePasswordRequirements = (password) => {
    return {
      minLength: password.length >= 6,
      hasNumber: /\d/.test(password),
      hasLetter: /[a-zA-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  };

  const passwordRequirements = validatePasswordRequirements(form.password);
  const allRequirementsMet = Object.values(passwordRequirements).every((req) => req);

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
    <div className={styles.conteiner}>
      <div className={styles.logoContainer}>
        <img src="/2630732.png" alt="logo" />
        <h2>Track Now</h2>
        <h3>Tu solución de seguimiento de paquetes</h3>
      </div>
      <form className={styles.centeredContainer} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Registro</h1>
        {step === 1 && (
          <>
            <p className={styles.paso}>Paso 1: información personal</p>
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
            <select
              name="rol"
              className="input-field"
              value={form.rol || ""}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="cliente">Cliente</option>
              <option value="repartidor">Repartidor</option>
              <option value="vendedor">Vendedor</option>
            </select>
            {error && <p className={styles.errorMessage}>{error}</p>}

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
            <p className={styles.paso}>Paso 2: Datos de acceso</p>

            <input
              name="email"
              type="email"
              placeholder="Email"
              className={styles.inputField}
              value={form.email}
              onChange={handleChange}
            />
            <PasswordInput
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
            />
            
            <div className={styles.passwordRequirements}>
              <p className={styles.requirementsTitle}>La contraseña debe contener:</p>
              <div className={styles.requirementItem}>
                <span className={passwordRequirements.minLength ? styles.requirementMet : styles.requirementNotMet}>
                  {passwordRequirements.minLength ? '✓' : '○'}
                </span>
                <span>Al menos 6 caracteres</span>
              </div>
              <div className={styles.requirementItem}>
                <span className={passwordRequirements.hasNumber ? styles.requirementMet : styles.requirementNotMet}>
                  {passwordRequirements.hasNumber ? '✓' : '○'}
                </span>
                <span>Al menos un número</span>
              </div>
              <div className={styles.requirementItem}>
                <span className={passwordRequirements.hasLetter ? styles.requirementMet : styles.requirementNotMet}>
                  {passwordRequirements.hasLetter ? '✓' : '○'}
                </span>
                <span>Al menos una letra</span>
              </div>
              <div className={styles.requirementItem}>
                <span className={passwordRequirements.hasSpecialChar ? styles.requirementMet : styles.requirementNotMet}>
                  {passwordRequirements.hasSpecialChar ? '✓' : '○'}
                </span>
                <span>Al menos un carácter especial (como ! o &)</span>
              </div>
            </div>

            <PasswordInput
              name="confirmPassword"
              placeholder="Confirmar Contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {error && <p className={styles.errorMessage}>{error}</p>}

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
    </div>
  );
}
