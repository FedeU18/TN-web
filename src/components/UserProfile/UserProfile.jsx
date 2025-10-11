import { useEffect, useState } from "react";
import axios from "../../libs/axios";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  //obtener datos del user
  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const res = await axios.get("/users/me");
      setUser(res.data);
    } catch (e) {
      console.error(e);
      alert("Error al cargar perfil");
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loadingUser) return <div>Cargando perfil...</div>;

  if (!user) return <div>No se pudo cargar el usuario</div>;

  return (
    <div style={{ padding: 16 }}>
      {/*perfil del user*/}
      <div>
        <img
          src={user.foto_perfil || "/default-avatar.png"}
          alt="Avatar"
          style={{ width: 80, height: 80, borderRadius: "50%" }}
        />
        <div>
          <h2>{user.nombre} {user.apellido}</h2>
          <p>Email: {user.email}</p>
          <p>Teléfono: {user.telefono || "-"}</p>
          <p>Rol: {user.rol}</p>
          <p>Registrado: {new Date(user.fecha_registro).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}