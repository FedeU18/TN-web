import { useEffect, useState } from "react";
import axios from "../../libs/axios";
import styles from "./UserProfile.module.css";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados del formulario
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    foto_perfil: "",
  });

  // Obtener datos del usuario
  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const res = await axios.get("/users/me");

      setUser(res.data);

      // Carga los datos al formulario
      setForm({
        nombre: res.data.nombre || "",
        apellido: res.data.apellido || "",
        telefono: res.data.telefono || "",
        foto_perfil: res.data.foto_perfil || "",
      });
    } catch (e) {
      console.error(e);
      alert("Error al cargar perfil");
    } finally {
      setLoadingUser(false);
    }
  };

  // Manejo cambios del formulario
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const res = await axios.put("/users/me", form);
      alert("Perfil actualizado correctamente");

      setUser(res.data.user); // actualiza UI
    } catch (e) {
      console.error(e);
      alert("Error al actualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loadingUser) return <div>Cargando perfil...</div>;
  if (!user) return <div>No se pudo cargar el usuario</div>;

  return (
    <div className={styles.userProfile}>
      <h2>Editar Perfil</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </label>

        <label>
          Apellido:
          <input
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
          />
        </label>
        <label>
          Teléfono:
          <input
            type="text"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
          />
        </label>

        <button className={styles.saveBtn} type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      {/* Información no editable */}
      {/* <div className={styles.infoBox}>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong> {user.rol}
        </p>
        <p>
          <strong>Registrado:</strong>{" "}
          {new Date(user.fecha_registro).toLocaleDateString()}
        </p>
      </div> */}
    </div>
  );
}
