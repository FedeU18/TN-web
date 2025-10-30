import styles from "./KpiCard.module.css";

export default function KpiCard({ title, value, subtitle }) {
  const display = value === null || value === undefined ? "-" : (typeof value === "number" ? value.toFixed(2).replace(/\.00$/, "") : value);
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.value}>{display}</div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  );
}