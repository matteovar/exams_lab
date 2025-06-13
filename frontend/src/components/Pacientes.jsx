import HeaderMedico from "./HeaderMedico";

const Pacientes = () => {
  return (
    <>
      <HeaderMedico />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-[#0058CD] mb-4">Pacientes</h1>
        <p className="text-gray-600 mb-2">
          Aqui você pode gerenciar seus pacientes.
        </p>
        <p className="text-gray-600 mb-2">
          Visualizar informações, agendar consultas e muito mais.
        </p>
        <p className="text-gray-600">
          Use o menu para navegar pelas opções disponíveis.
        </p>
      </div>
    </>
  );
};

export default Pacientes;
