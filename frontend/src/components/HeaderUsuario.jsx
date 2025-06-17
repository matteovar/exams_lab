import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeaderUsuario = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <header className="shadow-lg bg-gradient-to-r from-[#0095FF] via-[#0085E3] to-[#0058CD] text-white p-1 items-center">
      <div className="mx-auto flex h-20 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <h1 onClick={()=> navigate("/dashboard-usuario")} className="text-2xl font-bold cursor-pointer">Painel #nome do usuario</h1>
        <nav className="flex flex-1 items-center justify-end">
          <ul className="flex items-center gap-6 text-sm text-xl">
            <li onClick={()=> navigate("/agendar-exames")} className=" cursor-pointer">Agendamento</li>
            <li onClick={()=> navigate("/resultados")} className=" cursor-pointer">Resultados</li>
            <li onClick={()=> navigate("/")} className=" cursor-pointer">Sair</li>

          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderUsuario;
