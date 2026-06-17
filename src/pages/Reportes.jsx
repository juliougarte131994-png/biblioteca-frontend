import { useContext, useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { BibliotecaContext } from "../context/BibliotecaContext"
import * as XLSX from "xlsx"
import "./Reportes.css"

// 📤 EXPORTAR XLSX
const exportarXLSX = (nombreArchivo, datos) => {
    const hoja = XLSX.utils.json_to_sheet(datos)
    const libro = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(libro, hoja, "Datos")
    XLSX.writeFile(libro, nombreArchivo)
}

function Reportes() {
    const { libros } = useContext(BibliotecaContext)

    const [prestamosData, setPrestamosData] = useState([])
    const [busqueda, setBusqueda] = useState("")
    const [resultados, setResultados] = useState([])
    const [buscado, setBuscado] = useState(false)

    // 🔥 CARGAR PRÉSTAMOS DESDE MYSQL
    useEffect(() => {
        cargarPrestamos()
    }, [])

    const cargarPrestamos = async () => {
        try {
            const response = await fetch("https://biblioteca-backend-eb0w.onrender.com/api/prestamos")
            const data = await response.json()

            setPrestamosData(data)
        } catch (error) {
            console.error("Error cargando préstamos:", error)
        }
    }

    // 🔎 BUSCAR
    const buscarPrestamos = () => {
        const texto = busqueda.toLowerCase().trim()

        const filtrados = prestamosData.filter((p) => {
            const usuario = p.usuario?.toLowerCase() || ""
            const libro = p.libro?.toLowerCase() || ""

            const fechaPrestamoRaw = p.fecha_prestamo || ""
            const fechaDevolucionRaw = p.fecha_devolucion || ""

            const fechaPrestamoLocal = fechaPrestamoRaw
                ? new Date(fechaPrestamoRaw).toLocaleDateString()
                : ""

            const fechaDevolucionLocal = fechaDevolucionRaw
                ? new Date(fechaDevolucionRaw).toLocaleDateString()
                : ""

            return (
                usuario.includes(texto) ||
                libro.includes(texto) ||
                fechaPrestamoRaw.includes(texto) ||
                fechaDevolucionRaw.includes(texto) ||
                fechaPrestamoLocal.includes(texto) ||
                fechaDevolucionLocal.includes(texto)
            )
        })

        setResultados(filtrados)
        setBuscado(true)
    }

    // 📊 DATOS GENERALES
    const totalTitulos = libros.length

    const totalEjemplares = libros.reduce(
        (total, libro) => total + Number(libro.cantidad_total || 0),
        0
    )

    const totalDisponibles = libros.reduce(
        (total, libro) => total + Number(libro.cantidad_disponible || 0),
        0
    )

    const librosSinStock = libros.filter(
        (libro) => Number(libro.cantidad_disponible) === 0
    )

    const totalPrestamos = prestamosData.length

    const prestamosPorLibro = prestamosData.reduce((acc, prestamo) => {
        acc[prestamo.libro] = (acc[prestamo.libro] || 0) + 1
        return acc
    }, {})

    const topLibros = Object.entries(prestamosPorLibro)
        .map(([titulo, cantidad]) => ({ titulo, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10)

    return (
        <div>
            <Navbar />

            <div className="reportes-container">
                <div className="reportes-header">
                    <h2>📊 Reportes</h2>
                    <p>Estadísticas y análisis de biblioteca</p>
                </div>

                {/* RESUMEN */}
                <div className="reportes-summary-grid">
                    <div className="summary-card">
                        <h4>Total títulos</h4>
                        <h2>{totalTitulos}</h2>
                    </div>

                    <div className="summary-card">
                        <h4>Total ejemplares</h4>
                        <h2>{totalEjemplares}</h2>
                    </div>

                    <div className="summary-card">
                        <h4>Disponibles</h4>
                        <h2>{totalDisponibles}</h2>
                    </div>

                    <div className="summary-card">
                        <h4>Total préstamos</h4>
                        <h2>{totalPrestamos}</h2>
                    </div>
                </div>

                {/* BUSCADOR */}
                <div className="reportes-search-card">
                    <h3>Buscar préstamos</h3>

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Usuario, libro o fecha..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />

                        <button onClick={buscarPrestamos}>
                            Buscar
                        </button>
                    </div>
                </div>

                {/* CONTENIDO */}
                <div className="reportes-grid">
                    {/* IZQUIERDA */}
                    <div className="reportes-left">
                        {/* LIBROS SIN STOCK */}
                        <div className="report-card">
                            <div className="card-header">
                                <h3>📚 Libros sin stock</h3>

                                <button
                                    className="export-btn"
                                    onClick={() => {
                                        const librosExportar = libros.map((libro, index) => ({
                                            ID: index + 1,
                                            Título: libro.titulo,
                                            Autor: libro.autor,
                                            Total: libro.cantidad_total,
                                            Disponible: libro.cantidad_disponible
                                        }))

                                        exportarXLSX("libros.xlsx", librosExportar)
                                    }}
                                >
                                    Exportar Excel
                                </button>
                            </div>

                            {librosSinStock.length === 0 ? (
                                <p>No hay libros sin stock</p>
                            ) : (
                                <table className="report-table">
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Disponibles</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {librosSinStock.map((libro) => (
                                            <tr key={libro.id}>
                                                <td>{libro.titulo}</td>
                                                <td>{libro.cantidad_disponible}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* TOP LIBROS */}
                        <div className="report-card">
                            <div className="card-header">
                                <h3>📈 Top 10 libros más prestados</h3>

                                <button
                                    className="export-btn"
                                    onClick={() => {
                                        const prestamosExportar = prestamosData.map((prestamo, index) => ({
                                            ID: index + 1,
                                            Usuario: prestamo.usuario,
                                            Libro: prestamo.libro,
                                            "Fecha préstamo": prestamo.fecha_prestamo,
                                            "Fecha devolución": prestamo.fecha_devolucion,
                                            "Fecha devolución real": prestamo.fecha_devolucion_real
                                        }))

                                        exportarXLSX("prestamos.xlsx", prestamosExportar)
                                    }}
                                >
                                    Exportar Excel
                                </button>
                            </div>

                            {topLibros.length === 0 ? (
                                <p>No hay préstamos registrados</p>
                            ) : (
                                <table className="report-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Libro</th>
                                            <th>Préstamos</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {topLibros.map((libro, index) => (
                                            <tr key={libro.titulo}>
                                                <td>{index + 1}</td>
                                                <td>{libro.titulo}</td>
                                                <td>{libro.cantidad}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* DERECHA */}
                    <div className="reportes-right">
                        <div className="report-card">
                            <h3>🔎 Resultados búsqueda</h3>

                            {!buscado ? (
                                <p>Realiza una búsqueda para visualizar resultados.</p>
                            ) : resultados.length === 0 ? (
                                <p className="error-text">
                                    No se encontraron coincidencias
                                </p>
                            ) : (
                                <>
                                    <button
                                        className="export-btn"
                                        onClick={() => {
                                            const resultadosExportar = resultados.map((p, index) => ({
                                                ID: index + 1,
                                                Usuario: p.usuario,
                                                Libro: p.libro,
                                                "Fecha préstamo": p.fecha_prestamo,
                                                "Fecha devolución": p.fecha_devolucion,
                                                "Fecha devolución real": p.fecha_devolucion_real
                                            }))

                                            exportarXLSX(
                                                "resultados_busqueda.xlsx",
                                                resultadosExportar
                                            )
                                        }}
                                    >
                                        Exportar resultados
                                    </button>

                                    <table className="report-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Usuario</th>
                                                <th>Libro</th>
                                                <th>Dev. Real</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {resultados.map((p, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{p.usuario}</td>
                                                    <td>{p.libro}</td>
                                                    <td>
                                                        {p.fecha_devolucion_real
                                                            ? new Date(
                                                                p.fecha_devolucion_real
                                                            ).toLocaleDateString()
                                                            : "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reportes