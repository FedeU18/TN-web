import { useEffect, useState } from "react";
import axios from "../../libs/axios";
import styles from "./UserProfile.module.css";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingImg, setUploadingImg] = useState(false);

  // Estados del formulario
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    foto_perfil: "",
  });

  // 🔹 Obtener datos del usuario
  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const res = await axios.get("/users/me");

      setUser(res.data);

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

  // 🔹 Manejo cambios del formulario
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImg(true);

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "tracknow"); // tu preset real
      data.append("folder", "folder/sub-folder"); // carpeta definida en tu preset

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlqqalmj4/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const cloudinaryData = await res.json();
      console.log("Cloudinary response:", cloudinaryData);

      if (!cloudinaryData.secure_url) {
        throw new Error(
          cloudinaryData.error?.message || "Error subiendo imagen"
        );
      }

      setForm((prev) => ({
        ...prev,
        foto_perfil: cloudinaryData.secure_url,
      }));
    } catch (error) {
      console.error(error);
      alert("Error al subir la imagen: " + error.message);
    } finally {
      setUploadingImg(false);
    }
  };

  // 🔹 Guardar cambios (incluye foto_perfil si existe)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const res = await axios.put("/users/me", form);

      alert("Perfil actualizado correctamente");
      setUser(res.data.user);
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

      {/* PREVIEW DE FOTO */}
      <div className={styles.photoSection}>
        <img
          src={form.foto_perfil || "/default-avatar.png"}
          className={styles.avatar}
          alt="Foto de perfil"
        />

        <label className={styles.imgUploadLabel}>
          Cambiar foto
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
        </label>

        {uploadingImg && <p>Subiendo imagen...</p>}
      </div>

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

        <button
          className={styles.saveBtn}
          type="submit"
          disabled={saving || uploadingImg}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
