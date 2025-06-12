import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [tipoAcesso, setTipoAcesso] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (tipoAcesso === "medico") {
      navigate("/dashboard-medico");
    } else if (tipoAcesso === "usuario") {
      navigate("/dashboard-usuario");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LADO ESQUERDO */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        {!tipoAcesso ? (
          // Etapa 1: Escolha do tipo de acesso
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-[#0058CD]">Tipo de Acesso</h2>
            <div className="flex flex-col gap-4 items-center">
              <button
                onClick={() => setTipoAcesso("usuario")}
                className="w-64 bg-[#0085E3] text-white py-2 rounded hover:bg-[#0058CD] transition"
              >
                Sou Usuário
              </button>
              <button
                onClick={() => setTipoAcesso("medico")}
                className="w-64 bg-[#0085E3] text-white py-2 rounded hover:bg-[#0058CD] transition"
              >
                Sou Médico
              </button>
            </div>
          </div>
        ) : (
          // Etapa 2: Login
          <form
            className="w-3/4 max-w-md bg-white p-8 rounded shadow-md"
            onSubmit={handleLogin}
          >
            <h2 className="text-2xl font-bold text-[#0058CD] mb-6 text-center">
              Login {tipoAcesso === "usuario" ? "do Usuário" : "do Médico"}
            </h2>

            <label className="block text-gray-700 mb-2">CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#0085E3]"
            />

            <label className="block text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              className="w-full px-4 py-2 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-[#0085E3]"
            />

            <button
              type="submit"
              className="w-full bg-[#0085E3] text-white py-2 rounded hover:bg-[#0058CD] transition"
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => setTipoAcesso(null)}
              className="w-full mt-4 text-[#0058CD] underline"
            >
              Voltar
            </button>
          </form>
        )}
      </div>

      {/* LADO DIREITO */}
      <div className="w-1/2 hidden md:block">
        <img
          src="/assets/medico_paciente.png"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
