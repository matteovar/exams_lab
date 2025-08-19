import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMedico from "./HeaderMedico";
import { CreditCard, Calendar, User } from "lucide-react";

const PacienteDetalhes = () => {
  const { nome } = useParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("fichas");

  useEffect(() => {
    const fetchExamesPaciente = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/medico/pacientes/${encodeURIComponent(nome)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Erro ao carregar dados do paciente");
        const data = await response.json();
        setDados(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamesPaciente();
  }, [nome]);

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return "Não informada";
    
    try {
      const nascimento = new Date(dataNascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mes = hoje.getMonth() - nascimento.getMonth();
      
      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      
      return `${idade} anos`;
    } catch {
      return "Data inválida";
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "Data não disponível";
    try {
      const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dataString).toLocaleDateString('pt-BR', options);
    } catch {
      return dataString;
    }
  };

  const formatarResultados = (resultados) => {
    if (!resultados || typeof resultados !== 'object') {
      return <p className="text-gray-500">Nenhum resultado disponível</p>;
    }
    
    return (
      <div className="space-y-2">
        {Object.entries(resultados).map(([campo, valor]) => (
          <div key={campo} className="flex justify-between border-b pb-2">
            <span className="font-medium">{campo}:</span>
            <span>{valor || "-"}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <HeaderMedico />
        <div className="p-8 bg-gray-100 min-h-screen">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderMedico />
        <div className="p-8 bg-gray-100 min-h-screen">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center text-red-500">
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Voltar
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderMedico />
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <span className="mr-2">←</span>
            Voltar para lista de pacientes
          </button>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Cabeçalho do paciente */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <span className="text-white">👤</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{nome}</h1>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <div className="flex items-center">
                      <span className="mr-1">📅</span>
                      <span>Idade: {calcularIdade(dados?.paciente?.data_nascimento)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">📋</span>
                      <span>Total de exames: {dados?.fichas?.length || 0}</span>
                    </div>
                    {dados?.paciente?.nome_convenio && (
                      <div className="flex items-center">
                        <span className="mr-1">🏥</span>
                        <span>Convênio: {dados.paciente.nome_convenio}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Abas */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("fichas")}
                  className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === "fichas" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <span className="mr-2">📄</span>
                  Fichas de Exames
                </button>
                <button
                  onClick={() => setActiveTab("info")}
                  className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === "info" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <span className="mr-2">ℹ️</span>
                  Informações
                </button>
              </nav>
            </div>

            {/* Conteúdo das abas */}
            <div className="p-6">
              {activeTab === "info" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h2 className="font-semibold text-lg mb-4">Dados Pessoais</h2>
                      <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Data de Nascimento:</span>
                          <span>
                            {dados?.paciente?.data_nascimento 
                              ? new Date(dados.paciente.data_nascimento).toLocaleDateString('pt-BR') 
                              : "Não informada"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Idade:</span>
                          <span>{calcularIdade(dados?.paciente?.data_nascimento)}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">CPF:</span>
                          <span>{dados?.paciente?.cpf || "Não informado"}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Telefone:</span>
                          <span>{dados?.paciente?.telefone || "Não informado"}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Email:</span>
                          <span>{dados?.paciente?.email || "Não informado"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h2 className="font-semibold text-lg mb-4">Histórico Médico</h2>
                      <div className="space-y-3">
                        <div className="border-b pb-2">
                          <h4 className="text-gray-600 mb-1">Problemas de saúde:</h4>
                          <p className="whitespace-pre-line">
                            {dados?.paciente?.problemas_saude || "Não informado"}
                          </p>
                        </div>
                        <div className="border-b pb-2">
                          <h4 className="text-gray-600 mb-1">Medicações em uso:</h4>
                          <p className="whitespace-pre-line">
                            {dados?.paciente?.medicacoes || "Não informado"}
                          </p>
                        </div>
                        <div className="border-b pb-2">
                          <h4 className="text-gray-600 mb-1">Endereço:</h4>
                          <p className="whitespace-pre-line">
                            {dados?.paciente?.endereco || "Não informado"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seção Convênio Médico */}
                  {dados?.paciente?.nome_convenio && (
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <h2 className="font-semibold text-lg mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                        Informações do Convênio
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Plano de Saúde</h4>
                          <p className="text-gray-900">{dados.paciente.nome_convenio}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Número da Carteirinha</h4>
                          <p className="text-gray-900">{dados.paciente.numero_carteirinha}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Validade</h4>
                          <p className="text-gray-900">
                            {dados.paciente.validade_carteirinha 
                              ? new Date(dados.paciente.validade_carteirinha).toLocaleDateString('pt-BR') 
                              : "Não informada"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Tipo de Plano</h4>
                          <p className="text-gray-900">{dados.paciente.plano}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Histórico de Exames</h2>
                  
                  {dados?.fichas?.length > 0 ? (
                    <div className="space-y-4">
                      {dados.fichas.map((ficha) => (
                        <div key={ficha._id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-lg">{ficha.exame_nome}</h3>
                              <p className="text-sm text-gray-500 flex items-center">
                                <span className="mr-1">📅</span>
                                {formatarData(ficha.data_preenchimento)}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              ficha.status === 'concluido' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {ficha.status === 'concluido' ? 'Concluído' : 'Pendente'}
                            </span>
                          </div>
                          
                          <div className="p-5">
                            <div className="mb-5">
                              <h4 className="font-medium mb-2 text-gray-700">Resultados:</h4>
                              {formatarResultados(ficha.resultados)}
                            </div>
                            
                            <div className="mb-5">
                              <h4 className="font-medium mb-2 text-gray-700">Conclusão:</h4>
                              <p className="whitespace-pre-line">{ficha.conclusao}</p>
                            </div>
                            
                            {ficha.observacoes && (
                              <div>
                                <h4 className="font-medium mb-2 text-gray-700">Observações:</h4>
                                <p className="whitespace-pre-line">{ficha.observacoes}</p>
                              </div>
                            )}
                            
                            {ficha.laudo_completo && (
                              <div className="mt-4">
                                <h4 className="font-medium mb-2 text-gray-700">Laudo Completo:</h4>
                                <div className="bg-gray-50 p-3 rounded whitespace-pre-line">
                                  {ficha.laudo_completo}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <span className="mx-auto text-gray-400 text-4xl">📄</span>
                      <p className="mt-3 text-gray-500">Nenhum exame registrado para este paciente.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PacienteDetalhes;