import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { io } from "socket.io-client";
import "mapbox-gl/dist/mapbox-gl.css";
import api from "../../libs/axios";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function MapaRepartidor({
  pedidoId,
  origen,
  destino,
  estadoPedido,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const [ubicacion, setUbicacion] = useState({ lat: -38.9516, lng: -68.0591 });
  const [distanciaRestante, setDistanciaRestante] = useState(null);

  // =====================================================
  // 1️⃣ Ubicación inicial
  // =====================================================
  useEffect(() => {
    const fetchUbicacionInicial = async () => {
      try {
        const { data } = await api.get(`/pedidos/${pedidoId}/ubicacion`);
        if (data.latitud && data.longitud) {
          setUbicacion({ lat: data.latitud, lng: data.longitud });
        }
      } catch (err) {
        console.error("Error al obtener ubicación inicial:", err);
      }
    };
    fetchUbicacionInicial();
  }, [pedidoId]);

  // =====================================================
  // 2️⃣ Inicializar mapa
  // =====================================================
  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [ubicacion.lng, ubicacion.lat],
      zoom: 14,
    });

    map.current.on("load", () => {
      // 🔴 Repartidor
      marker.current = new mapboxgl.Marker({ color: "red" })
        .setLngLat([ubicacion.lng, ubicacion.lat])
        .setPopup(new mapboxgl.Popup().setText("🚴 Repartidor"))
        .addTo(map.current);

      // 🟢 Origen
      if (origen)
        new mapboxgl.Marker({ color: "green" })
          .setLngLat([origen.lng, origen.lat])
          .addTo(map.current);

      // 🔵 Destino
      if (destino)
        new mapboxgl.Marker({ color: "blue" })
          .setLngLat([destino.lng, destino.lat])
          .addTo(map.current);
    });

    return () => map.current.remove();
  }, []);

  // =====================================================
  // 3️⃣ Dibujar ruta → usando Mapbox Directions
  // =====================================================
  const trazarRuta = async (start, end) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/cycling/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) return;

    const route = data.routes[0].geometry.coordinates;
    const distancia = data.routes[0].distance / 1000; // km

    setDistanciaRestante(distancia.toFixed(2));

    // Si ya existe la capa, actualizar
    if (map.current.getSource("ruta")) {
      map.current.getSource("ruta").setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates: route },
      });
      return;
    }

    // Crear fuente y capa
    map.current.addSource("ruta", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "LineString", coordinates: route },
      },
    });

    map.current.addLayer({
      id: "ruta",
      type: "line",
      source: "ruta",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#007AFF", "line-width": 4 },
    });
  };

  // =====================================================
  // 4️⃣ Socket → Actualizar ubicación del repartidor
  // =====================================================
  useEffect(() => {
    const socket = io(BACKEND_URL);
    socket.emit("joinPedido", pedidoId);

    socket.on("ubicacionActualizada", async (data) => {
      const nuevaUbicacion = { lat: data.latitud, lng: data.longitud };
      setUbicacion(nuevaUbicacion);

      if (marker.current) {
        marker.current.setLngLat([nuevaUbicacion.lng, nuevaUbicacion.lat]);
      }

      // =============================
      // ⭐ Ruta según estado del pedido
      // =============================
      if (estadoPedido === "Asignado") {
        trazarRuta(nuevaUbicacion, origen);
      } else if (estadoPedido === "En camino") {
        trazarRuta(nuevaUbicacion, destino);
      }
    });

    return () => socket.disconnect();
  }, [pedidoId, estadoPedido]);

  // =====================================================
  // Render
  // =====================================================
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "350px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      />

      {/* ⭐ Distancia Restante */}
      {distanciaRestante && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "10px 14px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            fontWeight: "600",
            fontSize: "15px",
            zIndex: 10,
          }}
        >
          📏 Distancia restante: {distanciaRestante} km
        </div>
      )}

      {/* 🧭 Leyenda */}
      <div
        style={{
          marginTop: "8px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          padding: "8px",
          fontSize: "14px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <span>
          <span style={{ color: "green", fontWeight: "bold" }}>●</span> Origen
        </span>
        <span>
          <span style={{ color: "blue", fontWeight: "bold" }}>●</span> Destino
        </span>
        <span>
          <span style={{ color: "red", fontWeight: "bold" }}>●</span> Repartidor
        </span>
      </div>
    </div>
  );
}
