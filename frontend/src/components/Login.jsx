import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [tipoAcesso, setTipoAcesso] = useState(null);
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [subTipo, setSubTipo] = useState("medico"); // para medico ou tecnico
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanCpf = cpf.replace(/\D/g, "");

    // tipo enviado: "usuario" ou "medico" ou "tecnico"
    const tipoEnvio = tipoAcesso === "medico-tecnico" ? subTipo : tipoAcesso;

    try {
      const response = await fetch("http://localhost:5000/api/usuario/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf: cleanCpf, senha, tipo: tipoEnvio }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ cpf: cpf, tipo: data.tipo })
        );

        if (data.tipo === "admin") {
          navigate("/cadastro-medico");
        } else if (data.tipo === "medico") {
          navigate("/dashboard-medico");
        } else if (data.tipo === "tecnico") {
          navigate("/painel-coleta");
        } else {
          navigate("/dashboard-usuario");
        }
      } else {
        setError(data.message || "Erro ao fazer login.");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  // Mesma função formatCPF, handleCPFChange...

  const formatCPF = (value) => {
    const cleaned = value.replace(/\D/g, "");

    let formatted = cleaned;
    if (cleaned.length > 3) {
      formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    }
    if (cleaned.length > 6) {
      formatted = `${formatted.slice(0, 7)}.${formatted.slice(7)}`;
    }
    if (cleaned.length > 9) {
      formatted = `${formatted.slice(0, 11)}-${formatted.slice(11, 13)}`;
    }

    return formatted.slice(0, 14);
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  return (
    <div className="flex h-screen overflow-hidden ">
      <div className="w-1/2 flex items-center justify-center bg-white">
        {!tipoAcesso ? (
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
                onClick={() => setTipoAcesso("medico-tecnico")}
                className="w-64 bg-[#0085E3] text-white py-2 rounded hover:bg-[#0058CD] transition"
              >
                Sou Médico ou Técnico
              </button>
            </div>
          </div>
        ) : (
          <form
            className="w-3/4 max-w-md bg-white p-8 rounded shadow-md"
            onSubmit={handleLogin}
          >
            <h2 className="text-2xl font-bold text-[#0058CD] mb-6 text-center">
              Login{" "}
              {tipoAcesso === "usuario"
                ? "do Usuário"
                : tipoAcesso === "medico-tecnico"
                ? subTipo === "medico"
                  ? "do Médico"
                  : "do Técnico"
                : ""}
            </h2>

            {tipoAcesso === "medico-tecnico" && (
              <div className="mb-4">
                <label className="block mb-2">Escolha:</label>
                <select
                  value={subTipo}
                  onChange={(e) => setSubTipo(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="medico">Médico</option>
                  <option value="tecnico">Técnico</option>
                </select>
              </div>
            )}

            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <label className="block text-gray-700 mb-2">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#0085E3]"
              required
            />

            <label className="block text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              className="w-full px-4 py-2 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-[#0085E3]"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0085E3] text-white py-2 rounded hover:bg-[#0058CD] transition disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Carregando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>

            {tipoAcesso === "usuario" && (
              <button
                type="button"
                onClick={() => navigate("/cadastro-usuario")}
                className="w-full mt-2 border-2 border-[#0085E3] text-[#0085E3] py-2 rounded bg-transparent hover:bg-[#0085E3] hover:text-white transition"
              >
                Cadastrar-se
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setTipoAcesso(null);
                setError("");
              }}
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
