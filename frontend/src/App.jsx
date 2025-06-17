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
    ];

    const rotaSemHeader =
      rotasSemHeader.includes(location.pathname) ||
      location.pathname.startsWith("/pacientes/"); // Para rotas dinâmicas

    setShowHeader(!rotaSemHeader);
  }, [location]);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/agendar-exames" element={<AgendarExames />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard-usuario" element={<DashboardUsuario />} />
        <Route path="/dashboard-medico" element={<DashboardMedico />} />
        <Route path="/ficha" element={<Ficha />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/:nome" element={<PacienteDetalhes />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/resultados" element={<Resultados />} />
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
