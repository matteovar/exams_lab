import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderUsuario from "./HeaderUsuario";
import { Check, Clock, Calendar as CalendarIcon, AlertCircle, Loader2, X } from "lucide-react";

const AgendarExames = () => {
  const [examesDisponiveis, setExamesDisponiveis] = useState([]);
  const [filtro, setFiltro] = useState(""); // Estado para filtro de busca
  const [examesSelecionados, setExamesSelecionados] = useState([]);
  const [dataExame, setDataExame] = useState("");
  const [horario, setHorario] = useState("");
  const [loading, setLoading] = useState({
    exames: true,
    agendamento: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [requisitos, setRequisitos] = useState(null);
  const [localColeta, setLocalColeta] = useState("Sede Principal");
  const navigate = useNavigate();

  const hoje = new Date().toISOString().split("T")[0];
  const token = localStorage.getItem("token");

  // Verificar autenticação
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  // Carregar exames disponíveis
  useEffect(() => {
    const fetchExames = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/exames/disponiveis");
        
        if (!response.ok) {
          throw new Error("Erro ao carregar exames disponíveis");
        }

        const data = await response.json();
        
        if (data.success) {
          setExamesDisponiveis(data.exames);
        } else {
          throw new Error(data.error || "Erro ao carregar exames");
        }
      } catch (err) {
        console.error("Erro ao carregar exames:", err);
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, exames: false }));
      }
    };
    
    fetchExames();
  }, []);

  // Filtra exames pelo nome, ignorando maiúsculas/minúsculas
  const examesFiltrados = examesDisponiveis.filter(exame =>
    exame.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  // Selecionar/Deselecionar exame
  const toggleExame = (exame) => {
    setExamesSelecionados(prev => {
      const alreadySelected = prev.some(e => e.codigo === exame.codigo);
      if (alreadySelected) {
        return prev.filter(e => e.codigo !== exame.codigo);
      } else {
        return [...prev, exame];
      }
    });
  };

  // Verificar requisitos dos exames selecionados
  const verificarRequisitos = () => {
    const preparos = [...new Set(examesSelecionados.map(e => e.preparo))];
    setRequisitos(preparos);
  };

  // Limpar formulário
  const limparFormulario = () => {
    setExamesSelecionados([]);
    setDataExame("");
    setHorario("");
    setRequisitos(null);
    setError("");
    setFiltro(""); // Limpa também o filtro
  };

  // Submeter agendamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(prev => ({ ...prev, agendamento: true }));

    if (examesSelecionados.length === 0) {
      setError("Selecione pelo menos um exame");
      setLoading(prev => ({ ...prev, agendamento: false }));
      return;
    }

    if (!dataExame || !horario) {
      setError("Selecione data e horário");
      setLoading(prev => ({ ...prev, agendamento: false }));
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/agendamento/agendar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            exames: examesSelecionados.map(e => e.codigo),
            data_coleta: `${dataExame}T${horario}:00`,
            local_coleta: localColeta
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Erro ao agendar exame");
      }

      setSuccess(true);
      limparFormulario();
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate("/dashboard-usuario");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, agendamento: false }));
    }
  };

  // Locais de coleta disponíveis
  const locaisColeta = [
    "Sede Principal",
    "Unidade Centro",
    "Unidade Zona Norte",
    "Unidade Zona Sul",
    "Domicílio (Agendado)"
  ];

  return (
    <>
      <HeaderUsuario />
      <div className="p-6 max-w-6xl mx-auto max-h-[80vh] overflow-y-auto"> 
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Agendar Exames</h1>
        
        {loading.exames ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
            <p className="text-gray-600">Carregando exames disponíveis...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Selecione os Exames</h2>

            {/* Barra de pesquisa */}
            <input
              type="text"
              placeholder="Buscar exame..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="mb-6 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {examesFiltrados.length > 0 ? (
                examesFiltrados.map((exame) => (
                  <div
                    key={exame.codigo}
                    onClick={() => toggleExame(exame)}
                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      examesSelecionados.some(e => e.codigo === exame.codigo)
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-full">
                        <h3 className="font-semibold text-gray-900 text-lg">{exame.nome}</h3>
                        <p className="text-sm text-gray-600 mt-1">{exame.especialidade}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {exame.prazo}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            R$ {exame.valor.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {examesSelecionados.some(e => e.codigo === exame.codigo) && (
                        <div className="ml-3 bg-blue-500 text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full">Nenhum exame encontrado.</p>
              )}
            </div>

            {examesSelecionados.length > 0 && (
              <div className="space-y-8">
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Exames Selecionados</h2>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {examesSelecionados.length} selecionado(s)
                    </span>
                  </div>
                  
                  {/* Área com scroll para os exames selecionados */}
                  <div className="max-h-96 overflow-y-auto pr-2 mb-6">
                    <div className="space-y-3">
                      {examesSelecionados.map((exame) => (
                        <div 
                          key={exame.codigo} 
                          className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{exame.nome}</p>
                            <p className="text-sm text-gray-600 mt-1">{exame.preparo}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExame(exame);
                            }}
                            className="ml-4 text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={verificarRequisitos}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors"
                  >
                    <AlertCircle className="mr-2" size={16} />
                    Ver requisitos dos exames selecionados
                  </button>
                  
                  {requisitos && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
                        <AlertCircle className="mr-2" size={18} />
                        Atenção aos requisitos:
                      </h4>
                      <ul className="list-disc pl-5 space-y-2 text-yellow-700">
                        {requisitos.map((req, i) => (
                          <li key={i} className="text-sm">{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800">Informações do Agendamento</h2>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data da Coleta
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={dataExame}
                            onChange={(e) => setDataExame(e.target.value)}
                            min={hoje}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-12 text-gray-700"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Horário
                        </label>
                        <select
                          value={horario}
                          onChange={(e) => setHorario(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        >
                          <option value="">Selecione um horário</option>
                          {["07:00", "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"].map((hora) => (
                            <option key={hora} value={hora}>{hora}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Local de Coleta
                        </label>
                        <select
                          value={localColeta}
                          onChange={(e) => setLocalColeta(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        >
                          {locaisColeta.map((local) => (
                            <option key={local} value={local}>{local}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={limparFormulario}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center"
                      >
                        <X className="h-5 w-5 mr-2" />
                        Cancelar
                      </button>
                      
                      <button
                        type="submit"
                        disabled={loading.agendamento}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-medium flex items-center shadow-md"
                      >
                        {loading.agendamento ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                            Agendando...
                          </>
                        ) : (
                          <>
                            <Check className="h-5 w-5 mr-2" />
                            Confirmar Agendamento
                          </>
                        )}
                      </button>
                    </div>

                    {success && (
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-3" />
                          <div>
                            <p className="text-green-700 font-medium">
                              Agendamento realizado com sucesso!
                            </p>
                            <p className="text-green-600 text-sm mt-1">
                              Você será redirecionado em breve para seu dashboard.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AgendarExames;
