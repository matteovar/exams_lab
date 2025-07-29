import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "./components/Header";
import AgendarExames from "./components/AgendarExames";
import Login from "./components/Login";
import DashboardMedico from "./components/DashboardMedico";
import Ficha from "./components/Ficha";
import Pacientes from "./components/Pacientes";
import Agenda from "./components/Agenda";
import DashboardUsuario from "./components/DashboardUsuario";
import Resultados from "./components/Resultados";
import PacienteDetalhes from "./components/PacienteDetalhes";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import CadastroUsuario from "./components/Cadastro_usuario";
import VerFicha from "./components/VerFicha";

const AppWrapper = () => {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const rotasSemHeader = [
      "/dashboard-medico",
      "/resultados",
      "/dashboard-usuario",
      "/ficha",
      "/pacientes",
      "/agendar-exames",
      "/agenda",
      "/ver-ficha",
    ];

    const rotaSemHeader =
      rotasSemHeader.includes(location.pathname) ||
      location.pathname.startsWith("/pacientes/") ||
      location.pathname.startsWith("/ver-ficha/") ||
      location.pathname.startsWith("/editar-ficha/");

    setShowHeader(!rotaSemHeader);
  }, [location]);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />

        {/* Usuário comum */}
        <Route
          path="/agendar-exames"
          element={
            <RoleRoute role="usuario">
              <AgendarExames />
            </RoleRoute>
          }
        />
        <Route
          path="/dashboard-usuario"
          element={
            <RoleRoute role="usuario">
              <DashboardUsuario />
            </RoleRoute>
          }
        />
        <Route
          path="/resultados"
          element={
            <RoleRoute role="usuario">
              <Resultados />
            </RoleRoute>
          }
        />

        {/* Médico */}
        <Route
          path="/dashboard-medico"
          element={
            <RoleRoute role="medico">
              <DashboardMedico />
            </RoleRoute>
          }
        />
        <Route
          path="/ficha"
          element={
            <RoleRoute role="medico">
              <Ficha />
            </RoleRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <RoleRoute role="medico">
              <Pacientes />
            </RoleRoute>
          }
        />
        <Route
          path="/pacientes/:nome"
          element={
            <RoleRoute role="medico">
              <PacienteDetalhes />
            </RoleRoute>
          }
        />


        <Route
          path="/agenda"
          element={
            <RoleRoute role="medico">
              <Agenda />
            </RoleRoute>
          }
        />
        <Route
          path="/ver-ficha/:fichaId"
          element={
            <RoleRoute role="medico">
              <VerFicha />
            </RoleRoute>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;