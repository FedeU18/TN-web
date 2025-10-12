import { useState } from "react";
import { Link } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import OrderHistory from "../../components/OrderHistory/OrderHistory";
import styles from "./Profile.module.css";

export default function Profile() {
  const [showHistory, setShowHistory] = useState(false);

  const toggleHistory = () => setShowHistory((prev) => !prev);

  return (
    <div className={styles.profileContainer}>
      <UserProfile />

      <button className={styles.historyBtn} onClick={toggleHistory}>
        {showHistory ? "Ocultar historial" : "Ver historial de pedidos"}
      </button>

      {showHistory && <OrderHistory />}

      <div className={styles.backLink}>
        <Link to="../cliente-dashboard">Volver al Dashboard</Link>
      </div>
    </div>
  );
}