import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapSelector({ onPointsSelected }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-58.3816, -34.6037], // Buenos Aires
      zoom: 11,
    });

    mapRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      if (markers.length < 2) {
        // Crear marcador
        const marker = new mapboxgl.Marker({
          color: markers.length === 0 ? "red" : "blue",
        })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        const newMarkers = [...markers, marker];
        setMarkers(newMarkers);

        if (newMarkers.length === 2) {
          onPointsSelected({
            origen: newMarkers[0].getLngLat(),
            destino: newMarkers[1].getLngLat(),
          });
        }
      } else {
        // Reiniciar marcadores
        markers.forEach((m) => m.remove());
        const marker = new mapboxgl.Marker({ color: "red" })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        setMarkers([marker]);
        onPointsSelected(null);
      }
    });
  }, [markers]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "8px",
        marginTop: "1rem",
      }}
    />
  );
}
