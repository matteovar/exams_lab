import HeaderMedico from "./HeaderMedico";

const DashboardMedico = () => {
  return (
    <>
      <HeaderMedico />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-[#0058CD]">Dashboard Médico</h1>
        <p className="mt-4">Bem-vindo, doutor(a)!</p>
      </div>
    </>
  );
};

export default DashboardMedico