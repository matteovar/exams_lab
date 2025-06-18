import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Pegando os dados do usuário

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.tipo !== role) {
    return <Navigate to="/login" replace />; // Ou pode ir para uma página de "Acesso Negado"
  }

  return children;
};

export default RoleRoute;
