import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getLibros } from "../services/libro.services";
import "./LibrosEstudiante.css";

function LibrosEstudiante() {
    const [libros, setLibros] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [carrito, setCarrito] = useState([]);

    useEffect(() => {
        loadLibros();

        // 🔥 cargar carrito si existe
        const data = JSON.parse(localStorage.getItem("carritoPrestamos")) || [];
        setCarrito(data);
    }, []);

    const loadLibros = async () => {
        try {
            const data = await getLibros();
            setLibros(data);
        } catch (error) {
            console.error(error);
        }
    };

    // 🔍 FILTRO
    const librosFiltrados = libros.filter((libro) =>
        libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        libro.autor.toLowerCase().includes(busqueda.toLowerCase())
    );

    // 🛒 AGREGAR AL CARRITO
    const agregarAlCarrito = (libro) => {
        // obtener usuario logueado
        const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

        console.log("Usuario:", usuario);

        // validar si existe usuario
        if (!usuario) {
            alert("No hay usuario logueado");
            return;
        }

        // validar habilitado
        if (usuario.habilitado === 0 || usuario.habilitado === "0") {
            alert("Tu usuario está deshabilitado");
            return;
        }

        const existe = carrito.some((l) => l.id === libro.id);

        if (existe) {
            alert("El libro ya está agregado");
            return;
        }

        const nuevoCarrito = [...carrito, libro];

        setCarrito(nuevoCarrito);

        localStorage.setItem(
            "carritoPrestamos",
            JSON.stringify(nuevoCarrito)
        );
    };

    // ❌ ELIMINAR DEL CARRITO
    const eliminarDelCarrito = (id) => {
        const nuevoCarrito = carrito.filter((l) => l.id !== id);

        setCarrito(nuevoCarrito);

        localStorage.setItem(
            "carritoPrestamos",
            JSON.stringify(nuevoCarrito)
        );
    };

    // 🚀 IR A SOLICITUDES
    const irAPrestamos = () => {
        window.location.href = "/solicitudes-prestamo";
    };

    return (
        <div>
            <Navbar />

            <div className="librosestudiante-container">

                <div className="libros-header">
                    <h2>📚 Catálogo de Libros</h2>
                    <p>Busca libros y agrégalos a tu solicitud</p>
                </div>

                {/* BUSCADOR */}
                <div className="buscador-box">
                    <input
                        type="text"
                        placeholder="Buscar por título o autor..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="buscador-input"
                    />
                </div>

                <div className="catalogo-layout">

                    {/* LIBROS */}
                    <div className="catalogo-card">

                        <div className="section-header">
                            <h3>Libros disponibles</h3>
                        </div>

                        <div className="table-wrapper">
                            <table className="libros-table">
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Autor</th>
                                        <th>Disponibles</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {librosFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="empty-row">
                                                No se encontraron libros
                                            </td>
                                        </tr>
                                    ) : (
                                        librosFiltrados.map((libro) => (
                                            <tr key={libro.id}>
                                                <td>{libro.titulo}</td>
                                                <td>{libro.autor}</td>

                                                <td>
                                                    <span
                                                        className={
                                                            libro.cantidad_disponible > 0
                                                                ? "stock-ok"
                                                                : "stock-empty"
                                                        }
                                                    >
                                                        {libro.cantidad_disponible}
                                                    </span>
                                                </td>

                                                <td>
                                                    <button
                                                        className={
                                                            libro.cantidad_disponible > 0
                                                                ? "btn-agregar"
                                                                : "btn-disabled"
                                                        }
                                                        onClick={() => agregarAlCarrito(libro)}
                                                        disabled={libro.cantidad_disponible <= 0}
                                                    >
                                                        {libro.cantidad_disponible <= 0
                                                            ? "Sin stock"
                                                            : "Agregar"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* CARRITO */}
                    <div className="carrito-card">

                        <div className="section-header">
                            <h3>🛒 Solicitudes</h3>
                        </div>

                        {carrito.length === 0 ? (
                            <div className="empty-cart">
                                <p>No hay libros seleccionados</p>
                            </div>
                        ) : (
                            <>
                                <div className="carrito-list">
                                    {carrito.map((libro) => (
                                        <div className="carrito-item" key={libro.id}>
                                            <span>{libro.titulo}</span>

                                            <button
                                                className="btn-remove"
                                                onClick={() => eliminarDelCarrito(libro.id)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="btn-solicitar"
                                    onClick={irAPrestamos}
                                >
                                    Continuar Solicitud
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LibrosEstudiante;