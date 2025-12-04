import styles from "./Loading.module.css";

export default function Loading({ message = "Cargando..." }) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>{message}</p>
    </div>
  );
}
