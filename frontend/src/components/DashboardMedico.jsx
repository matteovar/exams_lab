import HeaderMedico from "./HeaderMedico";

const DashboardMedico = () => {
  return (
    <>
      <HeaderMedico />
      <div className="mx-auto  h-20 max-w-screen-xl p-8">
        <h1 className="text-3xl font-bold text-[#0058CD]">Dashboard </h1>
        <p className="mt-4">Bem-vindo, doutor!</p>
        <p className="mt-4">Metricas dos seus pacientes</p>
        <p className="mt-4">Consultas faltando</p>
      </div>
    </>
  );
};

export default DashboardMedico