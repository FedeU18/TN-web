import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./CrearPedidoVendedor.module.css";

import { getAllClientes, crearPedidoVendedor } from "../../../services/vendedor";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function CrearPedidoVendedor() {
  const [formData, setFormData] = useState({
    id_cliente: "",
    direccion_origen: "",
    direccion_destino: "",
    origen_latitud: "",
    origen_longitud: "",
    destino_latitud: "",
    destino_longitud: "",
    monto_pedido: "",
    descripcion: "", // <-- NUEVO
  });

  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  const [autocompleteOrigen, setAutocompleteOrigen] = useState([]);
  const [autocompleteDestino, setAutocompleteDestino] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // ============================================================
  // CARGAR CLIENTES
  // ============================================================
  useEffect(() => {
    const loadClientes = async () => {
      try {
        const data = await getAllClientes();
        setClientes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingClientes(false);
      }
    };
    loadClientes();
  }, []);

  // ============================================================
  // INICIALIZAR MAPA (SOLO UNA VEZ)
  // ============================================================
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-58.3816, -34.6037],
      zoom: 11,
    });

    // contador de toques en el mapa
    let clickCount = 0;

    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      clickCount++;

      // Reiniciar si toca por 3ra vez
      if (clickCount > 2) {
        clickCount = 1;

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        setFormData((prev) => ({
          ...prev,
          direccion_origen: "",
          origen_latitud: "",
          origen_longitud: "",
          direccion_destino: "",
          destino_latitud: "",
          destino_longitud: "",
        }));
      }

      const isOrigen = clickCount === 1;
      const markerColor = isOrigen ? "green" : "red";

      const marker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      markersRef.current.push(marker);

      // Geocoding para obtener la dirección
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      const direccion = data.features?.[0]?.place_name || "";

      if (isOrigen) {
        setFormData((prev) => ({
          ...prev,
          origen_latitud: lat,
          origen_longitud: lng,
          direccion_origen: direccion,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          destino_latitud: lat,
          destino_longitud: lng,
          direccion_destino: direccion,
        }));
      }
    });
  }, []);

  // ============================================================
  // AUTOCOMPLETAR DIRECCIONES
  // ============================================================
  const buscarDireccion = async (query, tipo) => {
    if (!query) {
      if (tipo === "origen") setAutocompleteOrigen([]);
      if (tipo === "destino") setAutocompleteDestino([]);
      return;
    }

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?country=ar&proximity=-58.3816,-34.6037&access_token=${
        mapboxgl.accessToken
      }`
    );

    const data = await res.json();

    if (tipo === "origen") setAutocompleteOrigen(data.features);
    else setAutocompleteDestino(data.features);
  };

  const seleccionarDireccion = (feature, tipo) => {
    const [lng, lat] = feature.center;

    mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });

    const marker = new mapboxgl.Marker({
      color: tipo === "origen" ? "green" : "red",
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    markersRef.current.push(marker);

    if (tipo === "origen") {
      setFormData((prev) => ({
        ...prev,
        direccion_origen: feature.place_name,
        origen_latitud: lat,
        origen_longitud: lng,
      }));
      setAutocompleteOrigen([]);
    } else {
      setFormData((prev) => ({
        ...prev,
        direccion_destino: feature.place_name,
        destino_latitud: lat,
        destino_longitud: lng,
      }));
      setAutocompleteDestino([]);
    }
  };

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const payload = {
        ...formData,
        id_cliente: Number(formData.id_cliente),
        origen_latitud: Number(formData.origen_latitud),
        origen_longitud: Number(formData.origen_longitud),
        destino_latitud: Number(formData.destino_latitud),
        destino_longitud: Number(formData.destino_longitud),
        descripcion: formData.descripcion || null, // <-- NUEVO
      };

      await crearPedidoVendedor(payload);

      setMessage("Pedido creado correctamente.");

      setFormData({
        id_cliente: "",
        direccion_origen: "",
        direccion_destino: "",
        origen_latitud: "",
        origen_longitud: "",
        destino_latitud: "",
        destino_longitud: "",
        monto_pedido: "",
        descripcion: "", // <-- NUEVO
      });

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al crear el pedido.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================
  return (
    <div className={styles.container}>
      <h2>Crear Pedido</h2>

      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.content}>
        {/* IZQUIERDA */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Cliente:
            <select
              value={formData.id_cliente}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  id_cliente: e.target.value,
                }))
              }
              required
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map((c) => (
                <option key={c.id_usuario} value={c.id_usuario}>
                  {c.email}
                </option>
              ))}
            </select>
          </label>

          <label>Dirección de origen:</label>
          <input
            type="text"
            value={formData.direccion_origen}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                direccion_origen: e.target.value,
              }));
              buscarDireccion(e.target.value, "origen");
            }}
          />

          {autocompleteOrigen.length > 0 && (
            <ul className={styles.suggestions}>
              {autocompleteOrigen.map((f) => (
                <li
                  key={f.id}
                  onClick={() => seleccionarDireccion(f, "origen")}
                >
                  {f.place_name}
                </li>
              ))}
            </ul>
          )}

          <label>Dirección de destino:</label>
          <input
            type="text"
            value={formData.direccion_destino}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                direccion_destino: e.target.value,
              }));
              buscarDireccion(e.target.value, "destino");
            }}
          />

          {autocompleteDestino.length > 0 && (
            <ul className={styles.suggestions}>
              {autocompleteDestino.map((f) => (
                <li
                  key={f.id}
                  onClick={() => seleccionarDireccion(f, "destino")}
                >
                  {f.place_name}
                </li>
              ))}
            </ul>
          )}

          <label>Monto del pedido ($):</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.monto_pedido}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                monto_pedido: e.target.value,
              }))
            }
            placeholder="Ej: 100.00"
            required
          />

          {/* NUEVO CAMPO DESCRIPCIÓN */}
          <label>Descripción (opcional):</label>
          <textarea
            className={styles.textarea}
            value={formData.descripcion}
            placeholder="Escribe detalles adicionales del pedido..."
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                descripcion: e.target.value,
              }))
            }
          ></textarea>

          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Pedido"}
          </button>
        </form>

        <div ref={mapContainerRef} className={styles.map}></div>
      </div>
    </div>
  );
}
