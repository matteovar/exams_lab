import { useNavigate } from "react-router-dom";

const HeaderTecnico = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white p-1 items-center">
      <div className="mx-auto flex h-20 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/painel-coleta")}>
          Painel de Coleta
        </h1>
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