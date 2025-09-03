import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

const HeaderTecnico = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white p-1 items-center">
      <div className="mx-auto flex h-20 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/painel-coleta")}>
            Painel de Coleta
          </h1>
          <p className="text-sm opacity-80 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {dataAtual}
          </p>
        </div>
        <nav className="flex flex-1 items-center justify-end">
          <ul className="flex items-center gap-6 text-sm text-xl">
            <li onClick={() => navigate("/painel-coleta")} className="cursor-pointer">
              Coletas
            </li>
            <li onClick={handleLogout} className="cursor-pointer">
              Sair
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderTecnico;