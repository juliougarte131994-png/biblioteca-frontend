import { useState } from "react";
import Navbar from "../components/Navbar";
import { createUsuario } from "../services/usuario.services";
import "./Usuarios.css";

function Usuarios() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("estudiante");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createUsuario({ usuario, password, rol });

            setMensaje("Usuario creado correctamente");

            setUsuario("");
            setPassword("");
            setRol("estudiante");

        } catch (error) {
            console.error(error);
            setMensaje("Error al crear usuario");
        }
    };

    return (
        <div>
            <Navbar />

            <div className="usuarios-container">
                <div className="usuarios-card">

                    <div className="usuarios-header">
                        <h2>Crear Usuario</h2>
                        <p>Registra nuevos usuarios dentro del sistema</p>
                    </div>

                    <form onSubmit={handleSubmit} className="usuarios-form">

                        <div className="form-group">
                            <label>Usuario</label>
                            <input
                                type="text"
                                placeholder="Ingrese usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="Ingrese contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Rol</label>
                            <select
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                            >
                                <option value="admin">Admin</option>
                                <option value="bibliotecario">Bibliotecario</option>
                                <option value="estudiante">Estudiante</option>
                                <option value="profesor">Profesor</option>
                            </select>
                        </div>

                        <button type="submit" className="usuarios-btn">
                            Crear Usuario
                        </button>

                        {mensaje && (
                            <div className="usuarios-alert">
                                {mensaje}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Usuarios;