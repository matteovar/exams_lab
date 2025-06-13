import Header from "./Header";
import HeaderUsuario from "./HeaderUsuario";

const AgendarExames = () => {
  return (
    <>
      <HeaderUsuario />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Agendar Exames</h1>
        <p className="text-lg text-gray-700 mb-4">
          Aqui você pode agendar seus exames.
        </p>
        {/* Aqui você pode adicionar mais conteúdo relacionado ao agendamento de exames */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">
            Formulário de Agendamento
          </h2>
          <form>
            <label className="block mb-2">
              Nome do Exame:
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            <label className="block mb-2">
              Data do Exame:
              <input
                type="date"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Agendar
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AgendarExames;
