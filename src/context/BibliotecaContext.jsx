import { createContext, useEffect, useState } from "react"
import librosIniciales from "../data/libros.json"

export const BibliotecaContext = createContext()

export function BibliotecaProvider({ children }) {
    const [libros, setLibros] = useState(() => {
        const datos = localStorage.getItem("libros")
        return datos ? JSON.parse(datos) : []
    })

    const [prestamos, setPrestamos] = useState(() => {
        const datos = localStorage.getItem("prestamos")
        return datos ? JSON.parse(datos) : []
    })

    // Guardar libros cada vez que cambien
    useEffect(() => {
        localStorage.setItem("libros", JSON.stringify(libros))
    }, [libros])

    // Guardar préstamos cada vez que cambien
    useEffect(() => {
        localStorage.setItem("prestamos", JSON.stringify(prestamos))
    }, [prestamos])

    useEffect(() => {
        const datos = localStorage.getItem("libros")

        if (!datos || JSON.parse(datos).length === 0) {
            localStorage.setItem("libros", JSON.stringify(librosIniciales))
            setLibros(librosIniciales)
        }
    }, [])

    return (
        <BibliotecaContext.Provider
            value={{
                libros,
                setLibros,
                prestamos,
                setPrestamos
            }}
        >
            {children}
        </BibliotecaContext.Provider>
    )
}
