import { Link } from 'react-router-dom';

import { validateLogin } from '../utils/validations';
import { loginRequest } from '../api/auth';
import { useState } from "react"; 

export default function Login() {
    const [form, setForm] = useState ({email: "", password: ""});
    const [error, setError] = useState("");
    const [logeado, setLogeado] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const validation = validateLogin(form);
        if (!validation.isValid) {
            setError(validation.message);
            return;
        }

        try {
            const response = await loginRequest(form.email, form.password);

            //axios devuelve data
            const data = response.data;

            //guardo el token
            localStorage.setItem("token", data.token);

            setLogeado(true);
        } catch (err) {
            //axios mete el error
            setError(err.response?.data?.error || "Error en el login");
        }
    };

    if (logeado) {
        return <h1>Bienvenido, {form.email}</h1>//cambiar a q llame el user buscando x el mail
    }

    return (
        <form className="centered-container" style={{ marginBottom: "3rem" }} onSubmit={handleSubmit}>
            <h1 className="title">Iniciar Sesión</h1>
            <input
                type="email"
                name="email"
                placeholder="Email"
                className="input-field" 
                value={form.email}
                onChange={handleChange}
                required
            />
            <br />
            <input
                type="password"
                name="password"
                placeholder="Password"
                className="input-field" 
                value={form.password}
                onChange={handleChange}
                required
            />
            <br />

            {error && <p style={{color: "red"}}>{error}</p>}
            <button type="submit" className="btn btn-login" style={{width:"300px"}}>Iniciar sesión</button>
            <div style={{ marginTop: "16px" }}>
                <Link 
                    to="../" 
                    style={{
                        display: "inline-block",
                        width: "300px",
                        background: "black",
                        fontSize: "12px",
                        color: "white",
                        textAlign: "center",
                        padding: "10px 0",
                        textDecoration: "none",
                        borderRadius: "10px"
                    }}
                >
                    Volver al menú principal
                </Link>
            </div>
        </form>
    );
    

}