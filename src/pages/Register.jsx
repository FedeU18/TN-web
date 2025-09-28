import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    rol: "",
    //foto_perfil: "",
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

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await registerRequest(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrarse");
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
        <select
          name="rol"
          className="input-field"
          value={form.rol || ""}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un rol</option>
          <option value="cliente">Cliente</option>
          <option value="repartidor">Repartidor</option>
        </select>
        <button type="submit" className="btn btn-register" style={{width:"300px", marginTop: "1rem"}}>Registrarse</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}