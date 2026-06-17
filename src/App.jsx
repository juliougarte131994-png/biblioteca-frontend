import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Libros from "./pages/Libros"
import Prestamos from "./pages/Prestamos"
import Reportes from "./pages/Reportes"
import Usuarios from "./pages/Usuarios"
import Mensajes from "./pages/Mensajes"
import GestionUsuarios from "./pages/GestionUsuarios";
import LibrosEstudiante from "./pages/LibrosEstudiante";
import SolicitudPrestamo from "./pages/SolicitudPrestamo";
import EstadoPrestamo from "./pages/EstadoPrestamo";



import ProtectedRoute from "./components/ProtectedRoute" // 🔥

import usuariosData from "./data/usuarios.json"
import librosData from "./data/libros.json"

function App() {

    useEffect(() => {
        if (!localStorage.getItem("usuarios")) {
            const usuariosConId = usuariosData.map((u, index) => ({
                id: index + 1,
                usuario: String(u.usuario),
                password: String(u.password),
                rol: u.rol
            }))
            localStorage.setItem("usuarios", JSON.stringify(usuariosConId))
        }

        if (!localStorage.getItem("libros")) {
            const librosConId = librosData.map((l, index) => ({
                id: index + 1,
                titulo: l.titulo,
                autor: l.autor,
                cantidad: Number(l.cantidad)
            }))
            localStorage.setItem("libros", JSON.stringify(librosConId))
        }
    }, [])

    return (
        <BrowserRouter>
            <Routes>

                {/* LOGIN */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />

                {/* 🔒 PROTEGIDAS */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                <Route path="/libros" element={
                    <ProtectedRoute>
                        <Libros />
                    </ProtectedRoute>
                } />

                <Route path="/prestamos" element={
                    <ProtectedRoute>
                        <Prestamos />
                    </ProtectedRoute>
                } />

                <Route path="/reportes" element={
                    <ProtectedRoute>
                        <Reportes />
                    </ProtectedRoute>
                } />

                <Route path="/usuarios" element={
                    <ProtectedRoute>
                        <Usuarios />
                    </ProtectedRoute>
                } />

                <Route path="/mensajes" element={
                    <ProtectedRoute>
                        <Mensajes />
                    </ProtectedRoute>
                } />

                <Route path="/gestionar-usuarios" element={
                    <ProtectedRoute>
                        <GestionUsuarios />
                    </ProtectedRoute>
                } />

                <Route path="/catalogo" element={
                    
                        <LibrosEstudiante />
                    
                } />
                <Route path="/solicitudes-prestamo" element={
                    <SolicitudPrestamo />
                } />
                <Route path="/estado-prestamo" element={
                    <EstadoPrestamo />
                } />

            </Routes>
        </BrowserRouter>
    )
}

export default App