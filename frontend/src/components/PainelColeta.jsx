import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderTecnico from "./HeaderTecnico";
import { CheckCircle, AlertCircle, Clipboard, Check, Loader2, Calendar, User, Clock, BarChart3 } from "lucide-react";

const PainelColeta = () => {
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColeta, setSelectedColeta] = useState(null);
  const [loadingExame, setLoadingExame] = useState(null);
  const [activeTab, setActiveTab] = useState("hoje");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || !user || (user.tipo !== "tecnico" && user.tipo !== "medico")) {
      navigate("/");
    }
  }, [navigate, token, user]);

  const fetchColetas = async (tipo) => {
    try {
      setLoading(true);
      const endpoint = tipo === "hoje" 
        ? "http://localhost:5000/api/coleta/hoje"
        : "http://localhost:5000/api/coleta/pendentes";

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Erro ao buscar coletas");

      const data = await response.json();
      setColetas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchColetas(activeTab);
  }, [token, activeTab]);

  const handleConfirmarExame = async (agendamentoId, exameCodigo) => {
    setLoadingExame(exameCodigo);
    try {
      const response = await fetch(`http://localhost:5000/api/coleta/concluir-exame/${agendamentoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ exameCodigo })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro ao confirmar exame");
      }

      fetchColetas(activeTab);
      
      if (selectedColeta && selectedColeta._id === agendamentoId) {
        const updatedColeta = coletas.find(c => c._id === agendamentoId);
        if (updatedColeta) setSelectedColeta(updatedColeta);
      }

    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingExame(null);
    }
  };

  const estatisticas = {
    total: coletas.length,
    concluidos: coletas.filter(c => c.todos_concluidos).length,
    pendentes: coletas.filter(c => !c.todos_concluidos).length,
    examesTotal: coletas.reduce((total, c) => total + c.total_exames, 0),
    examesConcluidos: coletas.reduce((total, c) => total + c.exames_concluidos, 0)
  };

  return (
    <>
      <HeaderTecnico />
      <div className="min-h-screen bg-gray-100 overflow-y-auto">
        <div className="p-4 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Painel de Coleta</h1>

          {/* Abas */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("hoje")}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === "hoje"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Calendar className="inline mr-2 w-4 h-4" />
              Coletas de Hoje
            </button>
            <button
              onClick={() => setActiveTab("pendentes")}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === "pendentes"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <AlertCircle className="inline mr-2 w-4 h-4" />
              Pendentes
            </button>
          </div>

          {/* Estatísticas */}
          {activeTab === "hoje" && coletas.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-blue-600">{estatisticas.total}</div>
                <div className="text-sm text-gray-600">Total de Coletas</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-green-600">{estatisticas.concluidos}</div>
                <div className="text-sm text-gray-600">Concluídas</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-orange-600">{estatisticas.pendentes}</div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {estatisticas.examesConcluidos}/{estatisticas.examesTotal}
                </div>
                <div className="text-sm text-gray-600">Exames Concluídos</div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 flex flex-col items-center">
              <Loader2 className="animate-spin mb-2" size={32} />
              Carregando...
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Lista de Coletas - 3 colunas */}
              <div className="lg:col-span-3">
                <h2 className="text-xl font-semibold mb-4">
                  {activeTab === "hoje" ? "Coletas de Hoje" : "Coletas Pendentes"}
                </h2>

                {coletas.length === 0 ? (
                  <div className="bg-white p-8 rounded-lg shadow text-center">
                    {activeTab === "hoje" 
                      ? "Nenhuma coleta agendada para hoje" 
                      : "Nenhuma coleta pendente no momento"}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Header da lista */}
                    <div className="bg-gray-50 px-6 py-3 border-b">
                      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                        <div className="col-span-4">Paciente</div>
                        <div className="col-span-2">Horário</div>
                        <div className="col-span-2">Local</div>
                        <div className="col-span-2">Progresso</div>
                        <div className="col-span-2">Status</div>
                      </div>
                    </div>
                    
                    {/* Lista com scroll vertical */}
                    <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                      {coletas.map((coleta) => (
                        <div
                          key={coleta._id}
                          onClick={() => setSelectedColeta(coleta)}
                          className={`p-4 border-b cursor-pointer transition-all hover:bg-gray-50 ${
                            selectedColeta?._id === coleta._id
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : "bg-white"
                          }`}
                        >
                          <div className="grid grid-cols-12 gap-4 items-center">
                            {/* Paciente */}
                            <div className="col-span-4">
                              <h3 className="font-medium text-gray-900">{coleta.paciente_nome}</h3>
                              <p className="text-sm text-gray-600 truncate">{coleta.paciente_telefone || "Sem telefone"}</p>
                            </div>
                            
                            {/* Horário */}
                            <div className="col-span-2">
                              <p className="text-sm font-medium text-gray-900">{coleta.horario_formatado}</p>
                              <p className="text-xs text-gray-600">{coleta.data_formatada}</p>
                            </div>
                            
                            {/* Local */}
                            <div className="col-span-2">
                              <p className="text-sm text-gray-600 truncate">{coleta.local_coleta}</p>
                            </div>
                            
                            {/* Progresso */}
                            <div className="col-span-2">
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${coleta.progresso}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-gray-600">
                                  {coleta.exames_concluidos}/{coleta.total_exames}
                                </span>
                              </div>
                            </div>
                            
                            {/* Status */}
                            <div className="col-span-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                coleta.todos_concluidos 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {coleta.todos_concluidos ? "Concluído" : "Pendente"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Detalhes da Coleta - 1 coluna com scroll */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <h2 className="text-xl font-semibold mb-4">Detalhes da Coleta</h2>

                  {selectedColeta ? (
                    <div className="bg-white p-4 rounded-lg shadow space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                      <h3 className="font-medium text-lg border-b pb-2">{selectedColeta.paciente_nome}</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Horário:</h4>
                          <p className="text-gray-900">{selectedColeta.horario_formatado}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Data:</h4>
                          <p className="text-gray-900">{selectedColeta.data_formatada}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Local:</h4>
                        <p className="text-gray-900">{selectedColeta.local_coleta || "Não informado"}</p>
                      </div>

                      {selectedColeta.paciente_telefone && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Telefone:</h4>
                          <p className="text-gray-900">{selectedColeta.paciente_telefone}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Status:</h4>
                        <span className={`px-2 py-1 rounded text-sm ${
                          selectedColeta.todos_concluidos 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {selectedColeta.todos_concluidos ? "Concluído" : "Pendente"}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Exames:</h4>
                        <div className="space-y-2">
                          {selectedColeta.exames.map((exame, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium text-sm">{exame.nome}</p>
                                <p className="text-xs text-gray-600">{exame.codigo}</p>
                              </div>
                              {exame.concluido ? (
                                <span className="text-green-600 font-semibold flex items-center text-sm">
                                  <Check size={14} /> Concluído
                                </span>
                              ) : (
                                <button
                                  disabled={loadingExame === exame.codigo}
                                  onClick={() => handleConfirmarExame(selectedColeta._id, exame.codigo)}
                                  className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-xs"
                                >
                                  {loadingExame === exame.codigo ? "Confirmando..." : "Confirmar"}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedColeta.todos_concluidos && (
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                          <CheckCircle className="inline mr-2 text-green-600" size={16} />
                          <span className="text-green-800 text-sm">Todos os exames concluídos!</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-lg shadow text-center flex flex-col items-center justify-center h-64">
                      <AlertCircle className="text-gray-400 mb-2" size={24} />
                      <p className="text-gray-600">Selecione uma coleta para visualizar os detalhes</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PainelColeta;