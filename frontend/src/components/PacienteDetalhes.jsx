import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMedico from "./HeaderMedico";
import {
  CreditCard,
  Calendar,
  User,
  ArrowLeft,
  AlertCircle,
  FileText,
  Info,
  WifiOff,
  Database,
  Server,
} from "lucide-react";

const PacienteDetalhes = () => {
  const { nome } = useParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("fichas");
  const [debugInfo, setDebugInfo] = useState({});
  const [openFicha, setOpenFicha] = useState(null);

  const fetchExamesPaciente = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo({});

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado");

      const url = `http://localhost:5000/api/medico/pacientes/${encodeURIComponent(
        nome
      )}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const debugData = {
        url,
        status: response.status,
        statusText: response.statusText,
        hasToken: !!token,
        tokenLength: token.length,
      };

      if (response.status === 401) {
        debugData.message = "Token inválido ou expirado";
        setDebugInfo(debugData);
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        debugData.message = `Erro HTTP: ${response.status}`;
        setDebugInfo(debugData);
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      debugData.responseData = data;
      setDebugInfo(debugData);
      setDados(data);
    } catch (err) {
      setError(err.message);
      setDebugInfo((prev) => ({ ...prev, error: err.message }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dataString).toLocaleDateString("pt-BR", options);
    } catch {
      return dataString;
    }
  };

  const formatarResultados = (resultados) => {
    if (!resultados || typeof resultados !== "object") {
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
        <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderMedico />
        <div className="p-8 bg-gray-100 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar para lista de pacientes
            </button>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-red-600 text-white p-6">
                <div className="flex items-center">
                  <AlertCircle className="w-8 h-8 mr-4" />
                  <h1 className="text-2xl font-bold">Erro ao Carregar Dados</h1>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">
                    Detalhes do Erro:
                  </h2>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">
                    Informações de Depuração:
                  </h2>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <Server className="w-5 h-5 mr-2 text-blue-600" />
                    Verificar Servidor Backend
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <Database className="w-5 h-5 mr-2 text-blue-600" />
                    Verificar Conexão com Banco
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <WifiOff className="w-5 h-5 mr-2 text-blue-600" />
                    Verificar Autenticação
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Verificar Permissões
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={fetchExamesPaciente}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Tentar Novamente
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
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
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para lista de pacientes
          </button>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Cabeçalho do paciente */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <User className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{nome}</h1>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        Idade:{" "}
                        {calcularIdade(dados?.paciente?.data_nascimento)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      <span>Total de exames: {dados?.fichas?.length || 0}</span>
                    </div>
                    {dados?.paciente?.nome_convenio && (
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-1" />
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
                  className={`px-6 py-4 font-medium text-sm flex items-center ${
                    activeTab === "fichas"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Fichas de Exames
                </button>
                <button
                  onClick={() => setActiveTab("info")}
                  className={`px-6 py-4 font-medium text-sm flex items-center ${
                    activeTab === "info"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Informações
                </button>
              </nav>
            </div>

            {/* Conteúdo das abas */}
            <div className="p-6">
              {activeTab === "fichas" ? (
                <div>
                  <h2 className="text-xl font-semibold mb-6">
                    Histórico de Exames
                  </h2>

                  {dados?.fichas?.length > 0 ? (
                    <div className="space-y-4">
                      {dados.fichas.map((ficha, i) => (
                        <div
                          key={i}
                          className="border rounded-lg overflow-hidden shadow-sm"
                        >
                          <button
                            onClick={() =>
                              setOpenFicha(openFicha === i ? null : i)
                            }
                            className="w-full flex justify-between items-center bg-gray-50 px-5 py-3 text-left hover:bg-gray-100"
                          >
                            <div>
                              <h3 className="font-medium text-lg">
                                Ficha #{i + 1}
                              </h3>
                              <p className="text-sm text-gray-500 flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatarData(ficha.data_preenchimento)}
                              </p>
                            </div>
                            <span className="text-sm text-blue-600">
                              {openFicha === i ? "▲ Fechar" : "▼ Ver exames"}
                            </span>
                          </button>

                          {openFicha === i && (
                            <div className="p-5 bg-white">
                              {ficha.exames?.map((exame, idx) => (
                                <div
                                  key={idx}
                                  className="mb-5 border-b pb-4 last:border-b-0"
                                >
                                  <h4 className="font-medium text-lg text-gray-800 mb-2">
                                    {exame.nome}
                                  </h4>
                                  <div className="mb-3">
                                    <h5 className="font-medium text-gray-700">
                                      Resultados:
                                    </h5>
                                    {formatarResultados(exame.resultados)}
                                  </div>
                                  <div className="mb-3">
                                    <h5 className="font-medium text-gray-700">
                                      Conclusão:
                                    </h5>
                                    <p>{exame.conclusao || "Não informada"}</p>
                                  </div>
                                  {exame.observacoes && (
                                    <div className="mb-3">
                                      <h5 className="font-medium text-gray-700">
                                        Observações:
                                      </h5>
                                      <p>{exame.observacoes}</p>
                                    </div>
                                  )}
                                  {exame.laudo_completo && (
                                    <div className="mt-3 bg-gray-50 p-3 rounded">
                                      <h5 className="font-medium text-gray-700">
                                        Laudo Completo:
                                      </h5>
                                      <pre className="whitespace-pre-line">
                                        {exame.laudo_completo}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <FileText className="mx-auto text-gray-400 h-12 w-12 mb-3" />
                      <p className="mt-3 text-gray-500">
                        Nenhum exame registrado para este paciente.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-6">
                    Informações do Paciente
                  </h2>
                  <div className="space-y-4">
                    <p>
                      <strong>CPF:</strong>{" "}
                      {dados?.paciente?.cpf || "Não informado"}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {dados?.paciente?.email || "Não informado"}
                    </p>
                    <p>
                      <strong>Telefone:</strong>{" "}
                      {dados?.paciente?.telefone || "Não informado"}
                    </p>
                    <p>
                      <strong>Endereço:</strong>{" "}
                      {dados?.paciente?.endereco || "Não informado"}
                    </p>
                  </div>
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
