import HeaderUsuario from "./HeaderUsuario";
import { Calendar, UserCircle, Settings } from "lucide-react";

const DashboardUsuario = () => {
  return (
    <>
      <HeaderUsuario />
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo ao seu painel de controle</h1>
          <p className="text-gray-600 mb-8">Aqui você pode acessar suas informações e funcionalidades principais.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <UserCircle className="text-blue-600 w-6 h-6" />
                <h2 className="text-lg font-semibold text-gray-800">Meu Perfil</h2>
              </div>
              <p className="text-sm text-gray-600">Visualize e atualize suas informações pessoais.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <Calendar className="text-green-600 w-6 h-6" />
                <h2 className="text-lg font-semibold text-gray-800">Agendamentos</h2>
              </div>
              <p className="text-sm text-gray-600">Veja seu histórico de exames e marque novas consultas.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <Settings className="text-purple-600 w-6 h-6" />
                <h2 className="text-lg font-semibold text-gray-800">Configurações</h2>
              </div>
              <p className="text-sm text-gray-600">Ajuste preferências, notificações e segurança.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardUsuario;
