import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import "./Dashboard.css";

function Dashboard() {
    const [prestamos, setPrestamos] = useState([])
    const [solicitudes, setSolicitudes] = useState([])
    const [libros, setLibros] = useState([])

    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"))

    useEffect(() => {
        if (usuario?.rol === "estudiante") {
            cargarPrestamos()
            cargarSolicitudes()
        }

        if (
            usuario?.rol === "admin" ||
            usuario?.rol === "bibliotecario" ||
            usuario?.rol === "profesor"
        ) {
            cargarPrestamosAdmin()
            cargarLibros()
        }
    }, [])

    const cargarPrestamos = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/api/prestamos?usuario_id=${usuario.id}&rol=estudiante`
            )

const data = await response.json()

if (Array.isArray(data)) {
    setPrestamos(data)
}

        } catch (error) {
    console.error(error)
}
    }

const cargarSolicitudes = async () => {
    try {
        const response = await fetch(
            `http://localhost:3001/api/solicitudes?usuario_id=${usuario.id}`
        )

        const data = await response.json()

        if (Array.isArray(data)) {
            setSolicitudes(data)
        }

    } catch (error) {
        console.error(error)
    }
}

const cargarPrestamosAdmin = async () => {
    try {
        const response = await fetch(
            "http://localhost:3001/api/prestamos"
        )

        const data = await response.json()

        if (Array.isArray(data)) {
            setPrestamos(data)
        }

    } catch (error) {
        console.error(error)
    }
}

const cargarLibros = async () => {
    try {
        const response = await fetch(
            "http://localhost:3001/api/libros"
        )

        const data = await response.json()

        if (Array.isArray(data)) {
            setLibros(data)
        }

    } catch (error) {
        console.error(error)
    }
}

// 📅 Próximas devoluciones estudiante
const proximasDevoluciones = prestamos.filter((p) => {
    if (!p.fecha_devolucion) return false

    const hoy = new Date()
    const devolucion = new Date(p.fecha_devolucion)

    const diferenciaDias = Math.ceil(
        (devolucion - hoy) / (1000 * 60 * 60 * 24)
    )

    return diferenciaDias >= 0 && diferenciaDias <= 3
})

// 📕 Stock nulo
const stockNulo = libros.filter(
    (libro) => Number(libro.cantidad_disponible) === 0
)

// ⏰ Devoluciones atrasadas
const devolucionesAtrasadas = prestamos.filter((p) => {
    if (!p.fecha_devolucion) return false

    const hoy = new Date()
    const devolucion = new Date(p.fecha_devolucion)

    return devolucion < hoy && p.estado !== "devuelto"
})

// 📅 Próximas devoluciones admin
const proximasDevolucionesAdmin = prestamos.filter((p) => {
    if (!p.fecha_devolucion) return false

    const hoy = new Date()
    const devolucion = new Date(p.fecha_devolucion)

    const diferenciaDias = Math.ceil(
        (devolucion - hoy) / (1000 * 60 * 60 * 24)
    )

    return diferenciaDias >= 0 && diferenciaDias <= 3
})

return (
        <div>
            <Navbar />

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>Dashboard</h2>

                    <p className="dashboard-subtitle">
                        {usuario?.rol === "estudiante"
                            ? "Panel principal del estudiante"
                            : "Panel administrativo"}
                    </p>
                </div>

                {/* ===== ESTUDIANTE ===== */}
                {usuario?.rol === "estudiante" && (
                    <>
                        <div className="dashboard-grid">

                            <div className="dashboard-card warning-card">
                                <h3>📅 Próximas devoluciones</h3>

                                {proximasDevoluciones.length === 0 ? (
                                    <p>No tienes devoluciones próximas</p>
                                ) : (
                                    <ul className="dashboard-list">
                                        {proximasDevoluciones.map((p) => (
                                            <li key={p.id}>
                                                <strong>{p.libro}</strong>
                                                <span>
                                                    {new Date(
                                                        p.fecha_devolucion
                                                    ).toLocaleDateString()}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="dashboard-card info-card">
                                <h3>📚 Libros prestados</h3>
                                <h1>{prestamos.length}</h1>
                                <p>Total de libros prestados actualmente.</p>
                            </div>

                            <div className="dashboard-card success-card">
                                <h3>📩 Solicitudes</h3>
                                <h1>{solicitudes.length}</h1>
                                <p>Solicitudes realizadas.</p>
                            </div>
                        </div>
                    </>
                )}

                {/* ===== ADMIN ===== */}
                {(usuario?.rol === "admin" ||
                    usuario?.rol === "bibliotecario" ||
                    usuario?.rol === "profesor") && (
                        <>
                            {/* CARDS */}
                            <div className="dashboard-grid">

                                <div className="dashboard-card danger-card">
                                    <h3>📕 Stock nulo</h3>
                                    <h1>{stockNulo.length}</h1>
                                    <p>Libros sin disponibilidad.</p>
                                </div>

                                <div className="dashboard-card yellow-card">
                                    <h3>⏰ Devoluciones atrasadas</h3>
                                    <h1>{devolucionesAtrasadas.length}</h1>
                                    <p>Préstamos fuera de fecha.</p>
                                </div>

                                <div className="dashboard-card blue-card">
                                    <h3>📅 Próximas devoluciones</h3>
                                    <h1>{proximasDevolucionesAdmin.length}</h1>
                                    <p>Vencen pronto.</p>
                                </div>

                            </div>

                            {/* TABLAS */}
                            <div className="dashboard-table-section">

                                {stockNulo.length > 0 && (
                                    <div className="dashboard-table-card">
                                        <h3>📕 Libros sin stock</h3>

                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Título</th>
                                                    <th>Autor</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {stockNulo.map((libro) => (
                                                    <tr key={libro.id}>
                                                        <td>{libro.id}</td>
                                                        <td>{libro.titulo}</td>
                                                        <td>{libro.autor}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <div className="dashboard-table-card">
                                    <h3>📋 Detalle de devoluciones atrasadas</h3>

                                    {devolucionesAtrasadas.length === 0 ? (
                                        <p>No existen préstamos atrasados.</p>
                                    ) : (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Usuario</th>
                                                    <th>Libro</th>
                                                    <th>Fecha préstamo</th>
                                                    <th>Fecha límite</th>
                                                    <th>Días atrasados</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {devolucionesAtrasadas.map((p, index) => {
                                                    const hoy = new Date()
                                                    const fechaDev = new Date(p.fecha_devolucion)

                                                    const diasAtraso = Math.ceil(
                                                        (hoy - fechaDev) /
                                                        (1000 * 60 * 60 * 24)
                                                    )

                                                    return (
                                                        <tr key={p.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{p.usuario}</td>
                                                            <td>{p.libro}</td>

                                                            <td>
                                                                {new Date(
                                                                    p.fecha_prestamo
                                                                ).toLocaleDateString()}
                                                            </td>

                                                            <td>
                                                                {new Date(
                                                                    p.fecha_devolucion
                                                                ).toLocaleDateString()}
                                                            </td>

                                                            <td className="late-days">
                                                                {diasAtraso} días
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
            </div>
        </div>
    )
}

export default Dashboard
