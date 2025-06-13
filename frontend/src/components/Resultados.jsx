import HeaderUsuario from "./HeaderUsuario";

const Resultados = () => {
  return (
    <>
    <HeaderUsuario />
    <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Resultados dos Exames</h1>
        <p className="text-lg text-gray-700 mb-4">Aqui você pode visualizar os resultados dos seus exames.</p>
        {/* Aqui você pode adicionar mais conteúdo relacionado aos resultados dos exames */}
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Exame de Sangue</h2>
            <p>Data: 01/01/2023</p>
            <p>Resultado: Normal</p>
        </div>
    </div>
    </>
  );
}

export default Resultados;