import { Link } from "react-router-dom";

function Navbar() {
    const user = JSON.parse(localStorage.getItem("usuarioLogueado"));

    const handleLogout = () => {
        localStorage.removeItem("usuarioLogueado");
        window.location.href = "/";
    };

    return (
        <nav style={{
            backgroundColor: "#1f2937",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}>

            {/* 🔥 MENÚ IZQUIERDO */}
            <div>
                <Link to="/dashboard" style={linkStyle}>Inicio</Link>

                {/* ADMIN / BIBLIOTECARIO */}
                {(user?.rol === "admin" || user?.rol === "bibliotecario") && (
                    <Link to="/libros" style={linkStyle}>Libros</Link>
                )}

                {/* ESTUDIANTE */}
                {user?.rol === "estudiante" && (
                    <Link to="/catalogo" style={linkStyle}>Catálogo</Link>
                )}

                {user?.rol !== "estudiante" && (
                    <Link to="/prestamos" style={linkStyle}>
                        Préstamos
                    </Link>
                )}

                {/* NO ESTUDIANTES */}
                {user?.rol !== "estudiante" && (
                    <>
                        <Link to="/reportes" style={linkStyle}>Reportes</Link>
                        <Link to="/mensajes" style={linkStyle}>Mensajes</Link>
                    </>
                )}

                {/* SOLO ADMIN */}
                {user?.rol === "admin" && (
                    <>
                        <Link to="/usuarios" style={linkStyle}>Crear Usuario</Link>
                        <Link to="/gestionar-usuarios" style={linkStyle}>Gestionar Usuarios</Link>
                    </>
                )}
                {user?.rol === "estudiante" && (
                    <>
                        <Link to="/solicitudes-prestamo" style={linkStyle}>
                            Solicitud Préstamo
                        </Link>

                        <Link to="/estado-prestamo" style={linkStyle}>
                            Estado Préstamo
                        </Link>
                    </>
                )}
            </div>

            {/* 🔥 LADO DERECHO */}
            <div>
                <span style={{ color: "white", marginRight: "15px" }}>
                    {user?.usuario} ({user?.rol})
                </span>

                <button onClick={handleLogout} style={buttonStyle}>
                    Cerrar sesión
                </button>
            </div>

        </nav>
    );
}

const linkStyle = {
    color: "white",
    marginRight: "15px",
    textDecoration: "none",
    fontWeight: "bold"
};

const buttonStyle = {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px"
};

export default Navbar;