import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./EstadoPrestamo.css";

function EstadoPrestamo() {
    const [estado, setEstado] = useState([]);

    useEffect(() => {
        loadEstado();
    }, []);

    const loadEstado = async () => {
        const user = JSON.parse(localStorage.getItem("usuarioLogueado"));

        const res = await fetch(
            `http://localhost:3001/api/solicitudes?usuario_id=${user.id}`
        );

        const data = await res.json();

        setEstado(data);
    };

    return (
        <div>
            <Navbar />

            <div className="estado-container">

                <div className="estado-header">
                    <h2>📚 Estado de Préstamo</h2>
                    <p>Consulta el estado de tus solicitudes realizadas</p>
                </div>

                <div className="estado-card">

                    <div className="table-wrapper">
                        <table className="estado-table">
                            <thead>
                                <tr>
                                    <th>Libro</th>
                                    <th>Estado</th>
                                    <th>Fecha solicitud</th>
                                </tr>
                            </thead>

                            <tbody>
                                {estado.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="empty-row">
                                            No existen solicitudes registradas
                                        </td>
                                    </tr>
                                ) : (
                                    estado.map((s) => (
                                        <tr key={s.id}>
                                            <td>{s.titulo}</td>

                                            <td>
                                                <span className={`estado-badge estado-${s.estado}`}>
                                                    {s.estado}
                                                </span>
                                            </td>

                                            <td>
                                                {new Date(s.fecha_solicitud).toLocaleDateString()}
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

export default EstadoPrestamo;