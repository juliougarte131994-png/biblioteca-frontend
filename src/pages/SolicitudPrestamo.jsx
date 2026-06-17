import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./SolicitudPrestamo.css";

function SolicitudPrestamo() {
    const [carrito, setCarrito] = useState([]);

    useEffect(() => {
        const data =
            JSON.parse(localStorage.getItem("carritoPrestamos")) || [];

        setCarrito(data);
    }, []);

    const enviarSolicitud = async (libroId) => {
        const user = JSON.parse(localStorage.getItem("usuarioLogueado"));

        try {
            await fetch("https://biblioteca-backend-eb0w.onrender.com/api/solicitudes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario_id: user.id,
                    libro_id: libroId
                })
            });

            alert("Solicitud enviada");

        } catch (error) {
            console.error(error);
            alert("Error al enviar solicitud");
        }
    };

    const enviarTodas = async () => {
        const user = JSON.parse(localStorage.getItem("usuarioLogueado"));

        try {
            for (let libro of carrito) {
                await fetch("https://biblioteca-backend-eb0w.onrender.com/api/solicitudes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        usuario_id: user.id,
                        libro_id: libro.id
                    })
                });
            }

            alert("Solicitudes enviadas");

            localStorage.removeItem("carritoPrestamos");
            setCarrito([]);

        } catch (error) {
            console.error(error);
            alert("Error al enviar solicitudes");
        }
    };

    const eliminarLibro = (id) => {
        const nuevoCarrito = carrito.filter((libro) => libro.id !== id);

        setCarrito(nuevoCarrito);

        localStorage.setItem(
            "carritoPrestamos",
            JSON.stringify(nuevoCarrito)
        );
    };

    return (
        <div>
            <Navbar />

            <div className="solicitud-container">

                <div className="solicitud-header">
                    <h2>Solicitud de préstamo</h2>
                    <p>Confirma los libros seleccionados antes de enviar</p>
                </div>

                {carrito.length === 0 ? (
                    <div className="solicitud-empty">
                        <h3>No hay libros seleccionados</h3>
                        <p>Agrega libros desde el catálogo para solicitar préstamo.</p>
                    </div>
                ) : (
                    <>
                        <div className="solicitud-card">

                            <table className="solicitud-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Título</th>
                                        <th>Autor</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {carrito.map((libro, index) => (
                                        <tr key={libro.id}>
                                            <td>{index + 1}</td>
                                            <td>{libro.titulo}</td>
                                            <td>{libro.autor}</td>
                                            <td>
                                                <button
                                                    className="btn-remove"
                                                    onClick={() => eliminarLibro(libro.id)}
                                                >
                                                    Quitar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>

                        <div className="solicitud-footer">
                            <button
                                className="btn-enviar"
                                onClick={enviarTodas}
                            >
                                Enviar todas las solicitudes
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default SolicitudPrestamo;