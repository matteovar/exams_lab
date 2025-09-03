import HeaderMedico from "./HeaderMedico";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Calendar, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Agenda = () => {
  const [agenda, setAgenda] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const abrirFicha = (agendamentoId, pacienteId, pacienteNome, exames) => {
    navigate("/ficha", {
      state: {
        agendamentoId,
        pacienteId,
        pacienteNome,
        exames,
      },
    });
  };

  // Função única e corrigida para buscar os agendamentos
  const fetchAgenda = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      // CORREÇÃO: A URL agora envia a data selecionada como parâmetro
      // CORREÇÃO: A chamada fetch é aguardada (await) e seu resultado atribuído a 'response'
      const response = await fetch(`http://localhost:5000/api/agendamento/agendamentos-do-dia?data=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ msg: "Erro de comunicação com o servidor" }));
        throw new Error(errorData.msg || "Erro ao buscar agendamentos do dia");
      }

      const data = await response.json();

      // Filtra apenas os agendamentos com status relevantes para a tela do médico
      const agendamentosColetados = data.filter(item =>
        item.status === "coletado" || item.status === "laudado" || item.todos_concluidos
      );

      setAgenda(agendamentosColetados);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // O useEffect agora chama a função corrigida sempre que a data mudar
  useEffect(() => {
    fetchAgenda();
  }, [selectedDate]);

  const formatarData = (dataString) => {
    if (!dataString) return "Data não disponível";
    try {
      const data = new Date(dataString);
      // Adiciona ajuste de fuso horário para garantir que a data não mude
      const dataAjustada = new Date(data.valueOf() + data.getTimezoneOffset() * 60000);
      return dataAjustada.toLocaleDateString('pt-BR');
    } catch {
      return dataString;
    }
  };

  const formatarHora = (dataString) => {
    if (!dataString) return "Hora não disponível";
    try {
      const data = new Date(dataString);
      return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dataString;
    }
  };

  return (
    <>
      <HeaderMedico />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Agenda - Exames Coletados</h1>

        {/* Seletor de Data */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-2">
            Selecione a data:
          </label>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="date"
              id="data"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchAgenda}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Tentar Novamente
            </button>
          </div>
        ) : agenda.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <Calendar className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-yellow-700">Nenhum exame coletado para {formatarData(selectedDate)}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-700 font-medium">
                Mostrando {agenda.length} agendamento(s) para {formatarData(selectedDate)}
              </p>
            </div>

            {agenda.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
              >
                {/* Cabeçalho do paciente */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <User className="w-5 h-5 text-blue-600 mr-2" />
                      <h2 className="text-lg font-bold text-gray-800">
                        {item.paciente_nome || item.paciente?.nome || "Paciente não informado"}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatarData(item.data_coleta)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatarHora(item.data_coleta)}</span>
                      </div>
                    </div>

                    {item.local_coleta && (
                      <p className="text-sm text-gray-500 mt-1">
                        Local: {item.local_coleta}
                      </p>
                    )}

                    <div className="mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'coletado' || item.todos_concluidos
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {item.status === 'coletado' || item.todos_concluidos ? 'Coletado' : 'Pendente'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(item._id)}
                    className="ml-4 p-2 hover:bg-gray-100 rounded-full"
                  >
                    {expanded === item._id ? (
                      <ChevronUp className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-blue-600" />
                    )}
                  </button>
                </div>

                {/* Conteúdo expandido */}
                {expanded === item._id && (
                  <div className="mt-4 animate-fadeIn border-t pt-4">
                    <h3 className="font-semibold text-gray-700 mb-3">
                      Exames Realizados:
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {item.exames.map((ex, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border ${ex.concluido || item.todos_concluidos
                              ? 'bg-green-50 border-green-200'
                              : 'bg-yellow-50 border-yellow-200'
                            }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{ex.nome}</span>
                            {ex.concluido || item.todos_concluidos ? (
                              <span className="text-green-600 text-sm">✓ Concluído</span>
                            ) : (
                              <span className="text-yellow-600 text-sm">Pendente</span>
                            )}
                          </div>
                          {ex.especialidade && (
                            <p className="text-sm text-gray-500 mt-1">{ex.especialidade}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          abrirFicha(
                            item._id,
                            item.cpf_usuario,
                            item.paciente_nome || item.paciente?.nome,
                            item.exames
                          )
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
                        disabled={!item.todos_concluidos && item.status !== 'coletado'}
                      >
                        Preencher Resultado
                      </button>
                    </div>

                    {!item.todos_concluidos && item.status !== 'coletado' && (
                      <p className="text-sm text-red-500 mt-2 text-center">
                        Aguardando conclusão de todos os exames para preenchimento do resultado.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Agenda;