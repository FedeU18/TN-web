import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { io } from "socket.io-client";
import "mapbox-gl/dist/mapbox-gl.css";
import api from "../../libs/axios";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function MapaRepartidor({ pedidoId, origen, destino }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const historialRef = useRef([]);
  const [ubicacion, setUbicacion] = useState({ lat: -38.9516, lng: -68.0591 });

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

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [ubicacion.lng, ubicacion.lat],
      zoom: 14,
    });

    map.current.on("load", () => {
      // 🔴 Marcador del repartidor (dinámico)
      marker.current = new mapboxgl.Marker({ color: "red" })
        .setLngLat([ubicacion.lng, ubicacion.lat])
        .setPopup(new mapboxgl.Popup().setText("🚴 Repartidor"))
        .addTo(map.current);

      // 🟢 Origen
      if (origen)
        new mapboxgl.Marker({ color: "green" })
          .setLngLat([origen.lng, origen.lat])
          .setPopup(new mapboxgl.Popup().setText("📦 Origen del pedido"))
          .addTo(map.current);

      // 🔵 Destino
      if (destino)
        new mapboxgl.Marker({ color: "blue" })
          .setLngLat([destino.lng, destino.lat])
          .setPopup(new mapboxgl.Popup().setText("🏠 Dirección de entrega"))
          .addTo(map.current);
    });

    return () => map.current.remove();
  }, []);

  useEffect(() => {
    const socket = io(BACKEND_URL);
    socket.emit("joinPedido", pedidoId);

    socket.on("ubicacionActualizada", (data) => {
      const nuevaUbicacion = [data.longitud, data.latitud];
      setUbicacion({ lat: data.latitud, lng: data.longitud });
      historialRef.current.push(nuevaUbicacion);

      if (marker.current) marker.current.setLngLat(nuevaUbicacion);

      const ruta = {
        type: "Feature",
        geometry: { type: "LineString", coordinates: historialRef.current },
      };

      if (map.current.getSource("ruta")) {
        map.current.getSource("ruta").setData(ruta);
      } else if (map.current.isStyleLoaded()) {
        map.current.addSource("ruta", { type: "geojson", data: ruta });
        map.current.addLayer({
          id: "ruta",
          type: "line",
          source: "ruta",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#FF0000", "line-width": 4 },
        });
      }
    });

    return () => socket.disconnect();
  }, [pedidoId]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "350px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      />

      {/* 🧭 Leyenda de colores */}
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
