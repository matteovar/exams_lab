import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "./components/Header";
import AgendarExames from "./components/AgendarExames";
import MeusAgendamentos from "./components/MeusAgendamentos";
import Reagendar from "./components/Reagendar";
import Cancelar from "./components/Cancelar";
import Login from "./components/Login";
import DashboardMedico from "./components/DashboardMedico";
import Ficha from "./components/Ficha";

// Componente wrapper para acessar location dentro do Router
const AppWrapper = () => {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const rotasSemHeader = ["/dashboard-medico", "/dashboard-usuario","/ficha"];
    setShowHeader(!rotasSemHeader.includes(location.pathname));
  }, [location]);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/agendar" element={<AgendarExames />} />
        <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
        <Route path="/reagendar" element={<Reagendar />} />
        <Route path="/cancelar" element={<Cancelar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard-medico" element={<DashboardMedico />} />
        <Route path="/ficha" element={<Ficha />} />
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
