import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    foto_perfil: "",
    //id_rol: "",
    //id_estado: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación simple
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Error al registrarse");
      } else {
        navigate("/login"); // redirigir al login
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div>
      <h1 className="title">Registro</h1>
      <form className="centered-container" style={{ marginBottom: "3rem" }} onSubmit={handleSubmit}>
        <input 
            name="nombre" 
            placeholder="Nombre"
            className="input-field" 
            value={form.nombre} 
            onChange={handleChange} 
            required />
        <input 
            name="apellido" 
            placeholder="Apellido"
            className="input-field" 
            value={form.apellido} 
            onChange={handleChange} 
            required />
        <input 
            name="email" 
            type="email"
            className="input-field" 
            placeholder="Email" 
            value={form.email} 
            onChange={handleChange} 
            required />
        <input 
            name="password" 
            type="password"
            className="input-field" 
            placeholder="Contraseña" 
            value={form.password} 
            onChange={handleChange} 
            required />
        <input 
            name="confirmPassword"
            className="input-field" 
            type="password" 
            placeholder="Confirmar Contraseña" 
            value={form.confirmPassword} 
            onChange={handleChange} 
            required />
        <input 
            name="telefono"
            className="input-field" 
            type="number"
            placeholder="Teléfono" 
            value={form.telefono} 
            onChange={handleChange} />
        <input 
            name="foto_perfil" 
            placeholder="URL Foto de Perfil"
            className="input-field" 
            value={form.foto_perfil} 
            onChange={handleChange} />
        <button type="submit" className="btn btn-register" style={{width:"300px", marginTop: "1rem"}}>Registrarse</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}