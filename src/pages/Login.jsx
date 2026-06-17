import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.services";
import "./Login.css";

function Login() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const user = await login({ usuario, password });

            localStorage.setItem("usuarioLogueado", JSON.stringify(user));

            setError("");

            navigate("/dashboard");

        } catch (error) {
            setError("Usuario o contraseña incorrectos");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2 className="login-title">Sistema Biblioteca</h2>

                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        className="login-input"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />

                    <button type="submit" className="login-button">
                        Ingresar
                    </button>
                </form>

                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;