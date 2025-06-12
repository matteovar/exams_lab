const HeaderMedico = () => {
  return (
    <header className="bg-[#0058CD] text-white px-6 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">Painel Médico</h1>
      <nav>
        <ul className="flex gap-6 text-lg">
          <li className="hover:underline cursor-pointer">Pacientes</li>
          <li className="hover:underline cursor-pointer">Agenda</li>
          <li className="hover:underline cursor-pointer">Sair</li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderMedico;
