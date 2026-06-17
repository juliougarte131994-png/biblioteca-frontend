import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Solicitudes.css";

function Solicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(() => {
        loadSolicitudes();
    }, []);

    const loadSolicitudes = async () => {
        try {
            const res = await fetch("https://biblioteca-backend-eb0w.onrender.com/api/solicitudes");
            const data = await res.json();

            console.log(data);

            if (Array.isArray(data)) {
                setSolicitudes(data);
            } else {
                setSolicitudes([]);
                console.error("La API no devolvió un array");
            }
        } catch (error) {
            console.error(error);
            setSolicitudes([]);
        }
    };

    const aprobar = async (id) => {
        await fetch(`https://biblioteca-backend-eb0w.onrender.com/api/solicitudes/${id}/aprobar`, {
            method: "PUT"
        });

        alert("Solicitud aprobada");
        loadSolicitudes();
    };

    const devolverLibro = async (id) => {
        try {
            const response = await fetch(
                `https://biblioteca-backend-eb0w.onrender.com/api/solicitudes/${id}/devolver`,
                {
                    method: "PUT"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert("Libro devuelto correctamente");

            loadSolicitudes();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // 🔥 NO ELIMINA, SOLO CAMBIA A DENEGADA
    const denegar = (id) => {
        const nuevasSolicitudes = solicitudes.map((s) => {
            if (s.id === id) {
                return {
                    ...s,
                    estado: "denegada"
                };
            }

            return s;
        });

        setSolicitudes(nuevasSolicitudes);
    };

    return (
        <div>
            <Navbar />

            <div className="solicitudes-container">
                <h2>Solicitudes y préstamos</h2>

                <table className="tabla-solicitudes">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Usuario</th>
                            <th>ID Libro</th>
                            <th>Libro</th>
                            <th>Estado</th>
                            <th>Devuelto</th>
                            <th>Fecha devolución</th>
                            <th>Acción</th>
                        </tr>
                    </thead>

                    <tbody>
                        {solicitudes.map((s, index) => (
                            <tr key={s.id}>
                                <td>{index + 1}</td>
                                <td>{s.usuario}</td>
                                <td>{s.libro_id}</td>
                                <td>{s.titulo}</td>
                                <td>{s.estado}</td>

                                <td>
                                    {s.fecha_devolucion_real ? "Sí" : "No"}
                                </td>

                                <td>
                                    {s.fecha_devolucion_real
                                        ? new Date(
                                            s.fecha_devolucion_real
                                        ).toLocaleDateString()
                                        : "-"}
                                </td>

                                <td>
                                    {s.estado === "pendiente" && (
                                        <>
                                            <button
                                                onClick={() => aprobar(s.id)}
                                            >
                                                Aprobar
                                            </button>

                                            {" "}

                                            <button
                                                onClick={() => denegar(s.id)}
                                                style={{
                                                    backgroundColor: "#ef4444",
                                                    color: "white"
                                                }}
                                            >
                                                Denegar
                                            </button>
                                        </>
                                    )}

                                    {s.estado === "denegada" && (
                                        <button
                                            disabled
                                            style={{
                                                backgroundColor: "#9ca3af",
                                                color: "white",
                                                cursor: "not-allowed",
                                                opacity: 0.7
                                            }}
                                        >
                                            Denegada
                                        </button>
                                    )}

                                    {s.estado === "aprobado" && (
                                        <button
                                            onClick={() =>
                                                devolverLibro(s.prestamo_id)
                                            }
                                            disabled={
                                                !!s.fecha_devolucion_real
                                            }
                                            style={{
                                                backgroundColor:
                                                    s.fecha_devolucion_real
                                                        ? "#9ca3af"
                                                        : "#16a34a",
                                                color: "white",
                                                cursor:
                                                    s.fecha_devolucion_real
                                                        ? "not-allowed"
                                                        : "pointer",
                                                opacity:
                                                    s.fecha_devolucion_real
                                                        ? 0.7
                                                        : 1
                                            }}
                                        >
                                            {s.fecha_devolucion_real
                                                ? "Devuelto"
                                                : "Registrar devolución"}
                                        </button>
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

export default Solicitudes;