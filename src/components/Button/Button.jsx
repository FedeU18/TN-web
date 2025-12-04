import styles from "./Button.module.css";

export function ButtonPrimary({ children, className = "", size = "normal", ...props }) {
  const buttonClass = size === "large" ? styles.btnPrimaryLarge : styles.btnPrimary;
  return (
    <button className={`${buttonClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonSecondary({ children, className = "", size = "normal", ...props }) {
  const buttonClass = size === "large" ? styles.btnSecondaryLarge : styles.btnSecondary;
  return (
    <button className={`${buttonClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
