import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Home.module.css";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/* HERO */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Track Now</h1>
          <p className={styles.subtitle}>
            Plataforma inteligente para gestionar entregas en tiempo real.
          </p>

          <div className={styles.buttons}>
            <Link to="/register" className={styles.btnPrimary}>
              Crear cuenta
            </Link>

            <Link to="/login" className={styles.btnSecondary}>
              Iniciar sesión
            </Link>
          </div>
        </div>

        <div className={styles.heroImage}>
          <img src="/pexels-norma-mortenson-4392030.jpg" alt="Delivery" />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className={styles.stepsSection}>
        <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <img src="/order.svg" />
            <h3>Creación del pedido</h3>
            <p>El vendedor registra un nuevo pedido desde su panel.</p>
          </div>

          <div className={styles.stepCard}>
            <img src="/list.svg" />
            <h3>Pedidos disponibles</h3>
            <p>
              Los repartidores ven el listado y toman los pedidos disponibles.
            </p>
          </div>

          <div className={styles.stepCard}>
            <img src="/gps.svg" />
            <h3>Seguimiento en tiempo real</h3>
            <p>El cliente ve la ubicación del repartidor en vivo.</p>
          </div>

          <div className={styles.stepCard}>
            <img src="/qr.svg" />
            <h3>Validación con QR</h3>
            <p>La entrega se confirma escaneando un código QR del cliente.</p>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Funcionalidades por rol</h2>

        <div className={styles.cardsContainer}>
          {/* ADMIN */}
          <div className={styles.card}>
            <h3>Administrador</h3>
            <ul>
              <li>Gestión de usuarios y roles</li>
              <li>Reportes de desempeño</li>
              <li>Monitoreo en tiempo real</li>
              <li>Control del estado de pedidos</li>
            </ul>
          </div>

          {/* VENDEDOR */}
          <div className={styles.card}>
            <h3>Vendedor</h3>
            <ul>
              <li>Creación de pedidos</li>
              <li>Historial de pedidos creados</li>
              <li>Notificaciones de estado</li>
            </ul>
          </div>

          {/* REPARTIDOR */}
          <div className={styles.card}>
            <h3>Repartidor</h3>
            <ul>
              <li>Listado de pedidos disponibles</li>
              <li>Tomar pedidos y cambiar su estado</li>
              <li>Envío de ubicación en tiempo real</li>
              <li>Validación con QR al entregar</li>
            </ul>
          </div>

          {/* CLIENTE */}
          <div className={styles.card}>
            <h3>Cliente</h3>
            <ul>
              <li>Ver ubicación en vivo del repartidor</li>
              <li>Historial y detalles del pedido</li>
              <li>Calificar repartidor</li>
            </ul>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className={styles.benefitsSection}>
        <h2 className={styles.sectionTitle}>¿Por qué usar Track Now?</h2>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <h3>📡 Seguimiento preciso</h3>
            <p>
              Actualizaciones en tiempo real gracias a geolocalización continua.
            </p>
          </div>

          <div className={styles.benefitCard}>
            <h3>🔐 Sistema seguro</h3>
            <p>
              Validación con QR y registros de auditoría para evitar fraudes.
            </p>
          </div>

          <div className={styles.benefitCard}>
            <h3>⚡ Alta eficiencia</h3>
            <p>Optimización del proceso de entrega para reducir tiempos.</p>
          </div>

          <div className={styles.benefitCard}>
            <h3>📊 Métricas y reportes</h3>
            <p>Panel avanzado para analizar tiempos, desempeño y flujos.</p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className={styles.ctaSection}>
        <h2>Empezá a optimizar tus entregas</h2>
        <p>Registro gratuito y acceso inmediato al panel.</p>
        <Link to="/register" className={styles.btnPrimaryLarge}>
          Crear cuenta ahora
        </Link>
      </section>
    </div>
  );
}
