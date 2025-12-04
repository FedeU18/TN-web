import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button/Button";
import styles from "./Home.module.css";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className={styles.container}>
      {/* HERO */}
      <section
        className={styles.heroSection}
        aria-labelledby="hero-title"
        aria-describedby="hero-desc"
      >
        <div className={styles.heroContent}>
          <h1 id="hero-title" className={styles.title}>
            Track Now
          </h1>

          <p id="hero-desc" className={styles.subtitle}>
            Plataforma inteligente para gestionar entregas en tiempo real
          </p>

          <div className={styles.buttons}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <ButtonPrimary size="large" aria-label="Crear una cuenta nueva">
                Crear cuenta
              </ButtonPrimary>
            </Link>

            <Link to="/login" style={{ textDecoration: 'none' }}>
              <ButtonSecondary size="large" aria-label="Iniciar sesión en Track Now">
                Iniciar sesión
              </ButtonSecondary>
            </Link>
          </div>
        </div>        <div className={styles.heroImage}>
          <img
            src="/pexels-norma-mortenson-4392030.jpg"
            alt="Persona realizando una entrega en bicicleta"
            loading="eager"
          />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className={styles.stepsSection} aria-labelledby="steps-title">
        <h2 id="steps-title" className={styles.sectionTitle}>
          ¿Cómo funciona?
        </h2>

        <div className={styles.stepsGrid}>
          <article className={styles.stepCard}>
            <img
              src="/order.svg"
              alt="Icono de creación de pedido"
              loading="lazy"
            />
            <h3>Creación del pedido</h3>
            <p>El vendedor registra un nuevo pedido desde su panel</p>
          </article>

          <article className={styles.stepCard}>
            <img
              src="/list.svg"
              alt="Icono de lista de pedidos disponibles"
              loading="lazy"
            />
            <h3>Pedidos disponibles</h3>
            <p>
              Los repartidores ven el listado y toman los pedidos disponibles
            </p>
          </article>

          <article className={styles.stepCard}>
            <img
              src="/gps.svg"
              alt="Icono de geolocalización en tiempo real"
              loading="lazy"
            />
            <h3>Seguimiento en tiempo real</h3>
            <p>El cliente ve la ubicación del repartidor en vivo</p>
          </article>

          <article className={styles.stepCard}>
            <img
              src="/qr.svg"
              alt="Icono de validación mediante código QR"
              loading="lazy"
            />
            <h3>Validación con QR</h3>
            <p>La entrega se confirma escaneando un código QR del cliente</p>
          </article>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section
        className={styles.featuresSection}
        aria-labelledby="features-title"
      >
        <h2 id="features-title" className={styles.sectionTitle}>
          Funcionalidades por rol
        </h2>

        <div className={styles.cardsContainer}>
          <article className={styles.card}>
            <h3>Administrador</h3>
            <ul>
              <li>Gestión de usuarios y roles</li>
              <li>Reportes de desempeño</li>
              <li>Monitoreo en tiempo real</li>
              <li>Control del estado de pedidos</li>
            </ul>
          </article>

          <article className={styles.card}>
            <h3>Vendedor</h3>
            <ul>
              <li>Creación de pedidos</li>
              <li>Historial de pedidos creados</li>
              <li>Notificaciones de estado</li>
            </ul>
          </article>

          <article className={styles.card}>
            <h3>Repartidor</h3>
            <ul>
              <li>Listado de pedidos disponibles</li>
              <li>Tomar pedidos y cambiar su estado</li>
              <li>Envío de ubicación en tiempo real</li>
              <li>Validación con QR al entregar</li>
            </ul>
          </article>

          <article className={styles.card}>
            <h3>Cliente</h3>
            <ul>
              <li>Ver ubicación en vivo del repartidor</li>
              <li>Historial y detalles del pedido</li>
              <li>Calificar repartidor</li>
            </ul>
          </article>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section
        className={styles.benefitsSection}
        aria-labelledby="benefits-title"
      >
        <h2 id="benefits-title" className={styles.sectionTitle}>
          ¿Por qué usar Track Now?
        </h2>

        <div className={styles.benefitsGrid}>
          <article className={styles.benefitCard}>
            <h3>📡 Seguimiento preciso</h3>
            <p>
              Actualizaciones en tiempo real gracias a geolocalización continua
            </p>
          </article>

          <article className={styles.benefitCard}>
            <h3>🔐 Sistema seguro</h3>
            <p>Validación con QR y registros de auditoría</p>
          </article>

          <article className={styles.benefitCard}>
            <h3>⚡ Alta eficiencia</h3>
            <p>Optimización del proceso de entrega para reducir tiempos</p>
          </article>

          <article className={styles.benefitCard}>
            <h3>📊 Métricas y reportes</h3>
            <p>Panel avanzado para analizar tiempos y desempeño</p>
          </article>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className={styles.ctaSection}>
        <h2>Empezá a optimizar tus entregas</h2>
        <p>Registro gratuito y acceso inmediato al panel</p>
        <Link
          to="/register"
          className={styles.btnPrimaryLarge}
          aria-label="Crear una cuenta en Track Now"
        >
          ¡Creá tu cuenta ahora!
        </Link>
      </section>
    </main>
  );
}
