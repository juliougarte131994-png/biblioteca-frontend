import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { BibliotecaProvider } from "./context/BibliotecaContext"


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BibliotecaProvider>
      <App />
    </BibliotecaProvider>
  </React.StrictMode>
)


