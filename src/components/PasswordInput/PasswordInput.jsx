import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./PasswordInput.module.css";

export default function PasswordInput({
  name,
  placeholder = "Contraseña",
  value,
  onChange,
  required = false,
  className = "",
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${styles.passwordInputContainer} ${className}`}>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        className={styles.passwordInput}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        className={styles.toggleButton}
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {showPassword ? (
          <AiOutlineEye size={20} />
        ) : (
          <AiOutlineEyeInvisible size={20} />
        )}
      </button>
    </div>
  );
}
