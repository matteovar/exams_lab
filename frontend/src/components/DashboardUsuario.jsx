import HeaderUsuario from "./HeaderUsuario";


const DashboardUsuario = () => {
  return (
    <>
    <HeaderUsuario />
    <div className="dashboard-usuario">
      <h1>Dashboard do Usuário</h1>
      <p>Bem-vindo ao seu painel de controle!</p>
      {/* Aqui você pode adicionar mais componentes ou informações relevantes para o usuário */}
    </div>
    </>
  );
}
export default DashboardUsuario;