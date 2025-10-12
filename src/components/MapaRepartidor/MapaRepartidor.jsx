import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { io } from "socket.io-client";
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function MapaRepartidor({ pedidoId }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const historialRef = useRef([]);
  const [ubicacion, setUbicacion] = useState({ lat: -38.9516, lng: -68.0591 });//nqn x defecto

  //obtener ubicación inicial desde el backend
  useEffect(() => {
    const fetchUbicacionInicial = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/ubicacion/${pedidoId}`);
        const data = await res.json();
        if (data.latitud && data.longitud) {
          setUbicacion({ lat: data.latitud, lng: data.longitud });
        }
      } catch (err) {
        console.error("Error al obtener ubicación inicial:", err);
      }
    };

    fetchUbicacionInicial();
  }, [pedidoId]);

  //inicializar mapa
  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [ubicacion.lng, ubicacion.lat],
      zoom: 14,
    });

    marker.current = new mapboxgl.Marker({ color: "red" })
      .setLngLat([ubicacion.lng, ubicacion.lat])
      .addTo(map.current);

    return () => map.current.remove();
  }, [ubicacion]);

  //escuchar ubicación en tiempo real
  useEffect(() => {
    const socket = io(BACKEND_URL);
    socket.emit("joinPedido", pedidoId);

    socket.on("ubicacionRepartidor", (data) => {
      const nuevaUbicacion = [data.longitud, data.latitud];
      setUbicacion({ lat: data.latitud, lng: data.longitud });
      historialRef.current.push(nuevaUbicacion);

      if (marker.current) marker.current.setLngLat(nuevaUbicacion);

      const ruta = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: historialRef.current,
        },
      };

      if (map.current.getSource("ruta")) {
        map.current.getSource("ruta").setData(ruta);
      } else {
        map.current.addSource("ruta", { type: "geojson", data: ruta });
        map.current.addLayer({
          id: "ruta",
          type: "line",
          source: "ruta",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#FF0000", "line-width": 4 },
        });
      }

      map.current.flyTo({ center: nuevaUbicacion, speed: 0.5 });
    });

    return () => socket.disconnect();
  }, [pedidoId]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}