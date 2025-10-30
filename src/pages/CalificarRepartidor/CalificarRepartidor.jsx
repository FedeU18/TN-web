import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { calificarRepartidor } from "../../services/repartidoresApi";

export default function CalificarRepartidor() {
  const [searchParams] = useSearchParams();
  const id_pedido = searchParams.get("id_pedido");
  const [calificacion, setCalificacion] = useState(0);
  const [mensaje, setMensaje] = useState("");

  const handleEnviar = async () => {
    try {
      await calificarRepartidor(id_pedido, calificacion);
      setMensaje("¡Gracias por tu calificación!");
    } catch (error) {
      setMensaje("Error al enviar la calificación");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Calificar Repartidor</h2>
      <p>Pedido ID: {id_pedido}</p>
      <input
        type="number"
        value={calificacion}
        onChange={(e) => setCalificacion(e.target.value)}
        min="1"
        max="5"
      />
      <button onClick={handleEnviar}>Enviar</button>
      <p>{mensaje}</p>
    </div>
  );
}