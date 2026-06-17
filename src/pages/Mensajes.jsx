import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMensajes, sendMensaje } from "../services/mensaje.services";
import "./Mensajes.css"

function Mensajes() {
    const [mensajes, setMensajes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [receptorId, setReceptorId] = useState("");
    const [mensaje, setMensaje] = useState("");

    const user = JSON.parse(localStorage.getItem("usuarioLogueado"));

    useEffect(() => {
        loadMensajes();
        loadUsuarios();
    }, []);

    const loadMensajes = async () => {
        const data = await getMensajes(user.id);
        setMensajes(data);
    };;

    const loadUsuarios = async () => {
        const res = await fetch("http://localhost:3001/api/mensajes/usuarios");
        const data = await res.json();
        setUsuarios(data);
    };

    const enviarMensaje = async (e) => {
        e.preventDefault();

        await sendMensaje({
            emisor_id: user.id,
            receptor_id: receptorId,
            mensaje
        });

        alert("Mensaje enviado");

        setMensaje("");
        setReceptorId("");

        loadMensajes();
    };

    return (
        <div>
            <Navbar />

            <div className="mensajes-container">
                <div className="mensajes-header">
                    <h2>💬 Mensajes</h2>
                    <p>Comunicación interna entre usuarios</p>
                </div>

                <div className="mensajes-grid">
                    {/* ENVIAR MENSAJE */}
                    <div className="mensajes-card">
                        <h3>📤 Enviar mensaje</h3>

                        <form onSubmit={enviarMensaje} className="mensaje-form">
                            <select
                                value={receptorId}
                                onChange={(e) => setReceptorId(e.target.value)}
                                required
                            >
                                <option value="">Seleccione usuario</option>

                                {usuarios
                                    .filter((u) => u.id !== user.id)
                                    .map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.usuario}
                                        </option>
                                    ))}
                            </select>

                            <textarea
                                placeholder="Escribe tu mensaje..."
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                required
                            />

                            <button type="submit">
                                Enviar mensaje
                            </button>
                        </form>
                    </div>

                    {/* BANDEJA */}
                    <div className="mensajes-card">
                        <h3>📥 Mensajes recibidos</h3>

                        {mensajes.length === 0 ? (
                            <div className="empty-state">
                                <p>No tienes mensajes</p>
                            </div>
                        ) : (
                            <div className="mensajes-lista">
                                {mensajes.map((m) => (
                                    <div key={m.id} className="mensaje-item">
                                        <div className="mensaje-top">
                                            <span className="mensaje-emisor">
                                                {m.emisor}
                                            </span>

                                            <span className="mensaje-fecha">
                                                {new Date(m.fecha).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="mensaje-texto">
                                            {m.mensaje}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Mensajes;