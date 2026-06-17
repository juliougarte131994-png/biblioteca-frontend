import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("usuarioLogueado"));

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;