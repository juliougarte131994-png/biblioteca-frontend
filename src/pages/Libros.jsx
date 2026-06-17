import { useContext, useEffect, useState } from "react"
import { BibliotecaContext } from "../context/BibliotecaContext"
import Navbar from "../components/Navbar"
import "./Libros.css"

function Libros() {
    const { libros, setLibros } = useContext(BibliotecaContext)

    const [titulo, setTitulo] = useState("")
    const [autor, setAutor] = useState("")
    const [cantidadTotal, setCantidadTotal] = useState("")
    const [cantidadDisponible, setCantidadDisponible] = useState("")
    const [editandoId, setEditandoId] = useState(null)

    // 🔥 Cargar libros desde backend
    useEffect(() => {
        cargarLibros()
    }, [])

    const cargarLibros = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/libros")
            const data = await response.json()

            setLibros(data)
        } catch (error) {
            console.error("Error al cargar libros:", error)
        }
    }

    // 🔥 AGREGAR LIBRO
    const agregarLibro = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch("http://localhost:3001/api/libros", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    titulo: titulo.trim(),
                    autor: autor.trim(),
                    cantidad_total: Number(cantidadTotal)
                })
            })

            if (!response.ok) {
                throw new Error("Error al guardar libro")
            }

            const nuevoLibro = await response.json()

            setLibros([...libros, nuevoLibro])

            alert("Libro agregado correctamente")

            limpiarFormulario()

        } catch (error) {
            console.error(error)
            alert("Error al agregar libro")
        }
    }

    // 🔥 ELIMINAR
    const eliminarLibro = async (id) => {
        const confirmar = window.confirm("¿Eliminar libro?")

        if (!confirmar) return

        try {
            const response = await fetch(
                `http://localhost:3001/api/libros/${id}`,
                {
                    method: "DELETE"
                }
            )

            if (!response.ok) {
                throw new Error("Error al eliminar")
            }

            setLibros(libros.filter(libro => libro.id !== id))

            alert("Libro eliminado")

        } catch (error) {
            console.error(error)
            alert("Error al eliminar libro")
        }
    }

    // 🔥 EDITAR
    const iniciarEdicion = (libro) => {
        setEditandoId(libro.id)
        setTitulo(libro.titulo)
        setAutor(libro.autor)
        setCantidadTotal(libro.cantidad_total)
        setCantidadDisponible(libro.cantidad_disponible)
    }

    // 🔥 GUARDAR
    const guardarEdicion = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/api/libros/${editandoId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        titulo,
                        autor,
                        cantidad_total: Number(cantidadTotal),
                        cantidad_disponible: Number(cantidadDisponible)
                    })
                }
            )

            if (!response.ok) {
                throw new Error("Error al actualizar")
            }

            const librosActualizados = libros.map(libro =>
                libro.id === editandoId
                    ? {
                        ...libro,
                        titulo,
                        autor,
                        cantidad_total: Number(cantidadTotal),
                        cantidad_disponible: Number(cantidadDisponible)
                    }
                    : libro
            )

            setLibros(librosActualizados)

            alert("Libro actualizado")

            limpiarFormulario()

        } catch (error) {
            console.error(error)
            alert("Error al actualizar libro")
        }
    }

    const limpiarFormulario = () => {
        setEditandoId(null)
        setTitulo("")
        setAutor("")
        setCantidadTotal("")
        setCantidadDisponible("")
    }

    return (
        <div>
            <Navbar />

            <div className="libros-container">
                <div className="libros-header">
                    <h2>📚 Gestión de Libros</h2>
                    <p>Administra el catálogo de libros disponibles</p>
                </div>

                {/* FORMULARIO */}
                <div className="libros-form-card">
                    <h3>
                        {editandoId ? "Editar libro" : "Agregar nuevo libro"}
                    </h3>

                    <form
                        onSubmit={editandoId ? (e) => e.preventDefault() : agregarLibro}
                        className="libros-form"
                    >
                        <input
                            type="text"
                            placeholder="Título"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Autor"
                            value={autor}
                            onChange={(e) => setAutor(e.target.value)}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Cantidad total"
                            value={cantidadTotal}
                            onChange={(e) => setCantidadTotal(e.target.value)}
                            required
                            min="1"
                        />

                        {editandoId && (
                            <input
                                type="number"
                                placeholder="Cantidad disponible"
                                value={cantidadDisponible}
                                onChange={(e) => setCantidadDisponible(e.target.value)}
                                required
                                min="0"
                            />
                        )}

                        <div className="libros-buttons">
                            {editandoId ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={guardarEdicion}
                                        className="btn-primary"
                                    >
                                        Guardar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={limpiarFormulario}
                                        className="btn-secondary"
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button type="submit" className="btn-primary">
                                    Agregar libro
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* TABLA */}
                <div className="libros-table-card">
                    <h3>Listado de libros</h3>

                    <table className="libros-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Título</th>
                                <th>Autor</th>
                                <th>Total</th>
                                <th>Disponible</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {libros.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-row">
                                        No hay libros registrados
                                    </td>
                                </tr>
                            ) : (
                                libros.map((libro, index) => (
                                    <tr key={libro.id}>
                                        <td>{index + 1}</td>
                                        <td>{libro.titulo}</td>
                                        <td>{libro.autor}</td>
                                        <td>{libro.cantidad_total}</td>
                                        <td>{libro.cantidad_disponible}</td>
                                        <td>
                                            <div className="acciones">
                                                <button
                                                    onClick={() => iniciarEdicion(libro)}
                                                    className="btn-edit"
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    onClick={() => eliminarLibro(libro.id)}
                                                    className="btn-delete"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Libros
