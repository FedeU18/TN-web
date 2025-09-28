import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest } from "../api/auth";
import { validateRegistrationStep1, validateRegistrationStep2 } from "../utils/validations";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    rol: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setError("");
    const validation = validateRegistrationStep1(form);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    setStep(2);
  };

  const prevStep = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validation = validateRegistrationStep2(form);
    if (!validation.isValid) {
      setError(validation.message);
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
        {step === 1 && (
          <>
            <input 
              name="nombre" 
              placeholder="Nombre"
              className="input-field" 
              value={form.nombre} 
              onChange={handleChange} 
            />
            <input 
              name="apellido" 
              placeholder="Apellido"
              className="input-field" 
              value={form.apellido} 
              onChange={handleChange} 
            />
            <input 
              name="telefono"
              className="input-field" 
              type="text"
              placeholder="Teléfono" 
              value={form.telefono} 
              onChange={handleChange} 
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "1rem" }}>
              <button 
                type="button" 
                style={{
                  background: "#2E7D32",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 0",
                  width: "300px",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
                onClick={nextStep}
              >
                Siguiente
              </button>

              <Link 
                to="/" 
                style={{
                  background: "black",
                  color: "white",
                  textAlign: "center",
                  padding: "12px 0",
                  textDecoration: "none",
                  borderRadius: "10px",
                  width: "300px",
                  fontSize: "16px"
                }}
              >
                Volver al menú principal
              </Link>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <input 
              name="email" 
              type="email"
              className="input-field" 
              placeholder="Email" 
              value={form.email} 
              onChange={handleChange} 
            />
            <input 
              name="password" 
              type="password"
              className="input-field" 
              placeholder="Contraseña" 
              value={form.password} 
              onChange={handleChange} 
            />
            <input 
              name="confirmPassword"
              className="input-field" 
              type="password" 
              placeholder="Confirmar Contraseña" 
              value={form.confirmPassword} 
              onChange={handleChange} 
            />
            {/* <select
              name="rol"
              className="input-field"
              value={form.rol || ""}
              onChange={handleChange}
            >
              <option value="">Selecciona un rol</option>
              <option value="cliente">Cliente</option>
              <option value="repartidor">Repartidor</option>
            </select> */}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "1rem" }}>
              <button 
                type="submit" 
                style={{
                  flex: 1,
                  width: "300px",
                  fontSize: "16px",
                  padding: "12px 0",
                  background: "#2E7D32",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                Registrarse
              </button>
              <button 
                type="button" 
                style={{
                  flex: 1,
                  fontSize: "16px",
                  padding: "12px 0",
                  background: "gray",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  width: "300px",
                  cursor: "pointer"
                }}
                onClick={prevStep}
              >
                Volver
              </button>
              <Link 
                to="/" 
                style={{
                  background: "black",
                  color: "white",
                  textAlign: "center",
                  padding: "12px 0",
                  textDecoration: "none",
                  borderRadius: "10px",
                  width: "300px",
                  fontSize: "16px"
                }}
              >
                Volver al menú principal
              </Link>
            </div>
          </>
        )}
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}