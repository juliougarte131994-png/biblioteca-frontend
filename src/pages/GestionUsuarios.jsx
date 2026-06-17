import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    getUsuarios,
    inhabilitarUsuario,
    habilitarUsuario
} from "../services/usuario.services";
import "./GestionUsuarios.css";

function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        try {
            const data = await getUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInhabilitar = async (id) => {
        await inhabilitarUsuario(id);
        loadUsuarios();
    };

    const handleHabilitar = async (id) => {
        await habilitarUsuario(id);
        loadUsuarios();
    };

    return (
        <div>
            <Navbar />

            <div className="gestionusuarios-container">

                <div className="gestionusuarios-header">
                    <h2>👥 Gestión de Usuarios</h2>
                    <p>Administra el estado de acceso de los usuarios</p>
                </div>

                <div className="gestionusuarios-card">

                    <div className="table-wrapper">
                        <table className="usuarios-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>

                            <tbody>
                                {usuarios.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty-row">
                                            No hay usuarios registrados
                                        </td>
                                    </tr>
                                ) : (
                                    usuarios.map((u) => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.usuario}</td>
                                            <td>
                                                <span className={`rol-badge rol-${u.rol}`}>
                                                    {u.rol}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        u.habilitado
                                                            ? "estado-activo"
                                                            : "estado-inactivo"
                                                    }
                                                >
                                                    {u.habilitado ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>

                                            <td>
                                                {u.habilitado ? (
                                                    <button
                                                        className="btn-inhabilitar"
                                                        onClick={() => handleInhabilitar(u.id)}
                                                    >
                                                        Inhabilitar
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn-habilitar"
                                                        onClick={() => handleHabilitar(u.id)}
                                                    >
                                                        Habilitar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default GestionUsuarios;