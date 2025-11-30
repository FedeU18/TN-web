import { useEffect, useState } from "react";
import styles from "./VerUsuarios.module.css";
import { getAllUsuarios, updateUserRol} from "../../../services/adminService";

export default function VerUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newRol, setNewRol] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

    const fetchUsuarios = async () => {
    try {
        setLoading(true);
        const data = await getAllUsuarios();

        const sorted = [...data].sort((a, b) => a.id_usuario - b.id_usuario);

        setUsuarios(sorted);
    } catch (error) {
        console.error("Error:", error);
        setMessage("Error al cargar usuarios");
    } finally {
        setLoading(false);
    }
    };

  const handleUpdateRol = async (id, rolActual) => {
    // No hacer nada si el rol no cambió
    if (!newRol || newRol === rolActual) {
      setMessage("El rol no cambió.");
      setEditingId(null);
      setNewRol("");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    try {
      await updateUserRol(id, newRol);
      setMessage("Rol actualizado correctamente");

      setEditingId(null);
      setNewRol("");

      fetchUsuarios();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error al actualizar rol: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <p className={styles.loading}>Cargando usuarios...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestión de Usuarios</h1>

      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id_usuario}>
                <td>{u.id_usuario}</td>
                <td>{u.nombre} {u.apellido}</td>
                <td>{u.email}</td>

                <td>
                  {editingId === u.id_usuario ? (
                    <select
                      value={newRol || u.rol}   // ← Muestra el rol actual si no tocaste el select
                      onChange={(e) => setNewRol(e.target.value)}
                      className={styles.roleSelect}
                    >
                      <option value="cliente">Cliente</option>
                      <option value="repartidor">Repartidor</option>
                      <option value="vendedor">Vendedor</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    u.rol
                  )}
                </td>

                <td className={styles.actions}>
                  {editingId === u.id_usuario ? (
                    <>
                      <button
                        onClick={() => handleUpdateRol(u.id_usuario, u.rol)}
                        className={`${styles.btn} ${styles.btnSave}`}
                      >
                        Guardar
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(null);
                          setNewRol("");
                        }}
                        className={`${styles.btn} ${styles.btnCancel}`}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(u.id_usuario);
                          setNewRol(u.rol);  // ← el select empieza con el rol actual
                        }}
                        className={`${styles.btn} ${styles.btnEdit}`}
                      >
                        Editar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}