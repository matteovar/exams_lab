import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const Header = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  return (
    <header className="shadow-lg bg-gradient-to-r from-[#0095FF] via-[#0085E3] to-[#0058CD] text-white p-1 items-center">
      <div className="mx-auto flex h-20 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="w-28 h-auto object-contain pt-4"
        />
        <h1 onClick={() => navigate("/")} className="text-3xl cursor-pointer">
          LabAccess
        </h1>
        <nav className="flex flex-1 items-center justify-end">
          <ul className="flex items-center gap-6 text-sm text-xl">
            <li className="cursor-pointer" onClick={() => navigate("/agendar-exames")}>
              Agendar exames
            </li>
            <li className="relative">
              <button onClick={() => setOpen(!open)}>Agendamentos</button>
              {open && (
                <ul className="absolute left-0 mt-2 w-40 bg-white text-[#0085E3] rounded shadow-lg z-10">
                  <li
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 hover:bg-[#e0e1dd] cursor-pointer"
                  >
                    Meus agendamentos
                  </li>
                  <li
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 hover:bg-[#e0e1dd] cursor-pointer"
                  >
                    Reagendar
                  </li>
                  <li
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 hover:bg-[#e0e1dd] cursor-pointer"
                  >
                    Cancelar agendamento
                  </li>
                </ul>
              )}
            </li>
            <li
              className="bg-[#e0e1dd] rounded md:rounded-lg text-[#0085E3] px-4 py-1 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Entrar
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
