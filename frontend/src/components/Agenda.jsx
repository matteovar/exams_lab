import HeaderMedico from "./HeaderMedico";

const Agenda = () => {
  return (
    <>
    <HeaderMedico />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Agenda</h1>
      <p className="text-lg text-gray-700">Esta é a página de agenda.</p>
      {/* Aqui você pode adicionar mais conteúdo relacionado à agenda */}
    </div>
    </>
  );
};

export default Agenda;