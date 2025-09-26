import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react"; 

export default function Login() {

    // const { t } = useTranslation();
    // const navigate = useNavigate();

    const [form, setForm] = useState ({email: "", password: ""});
    const [error, setError] = useState("");// "" o conviene null?
    const [logeado, setLogeado] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.email === "" || form.password === "") {
            setError("Todos los campos son obligatorios");
            return;
        }
        setError("");
        setLogeado(true);
    }

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
        </form>
    );
    

}