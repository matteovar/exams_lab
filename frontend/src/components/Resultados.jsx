import HeaderUsuario from "./HeaderUsuario";
import React, { useEffect, useState } from "react";

const Resultados = () => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [groupedResults, setGroupedResults] = useState({});
  const [expandedExams, setExpandedExams] = useState({});

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/medico/resultados-paciente", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar resultados");
        }

        const data = await response.json();
        setResultados(data);
        
        // Agrupa os resultados por data
        const grouped = data.reduce((acc, result) => {
          const date = new Date(result.data_preenchimento).toLocaleDateString('pt-BR');
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(result);
          return acc;
        }, {});
        
        setGroupedResults(grouped);
        
        // Inicializa todos os exames como recolhidos
        const initialExpandedState = {};
        data.forEach(exam => {
          initialExpandedState[exam._id] = false;
        });
        setExpandedExams(initialExpandedState);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, []);

  const toggleExpand = (examId) => {
    setExpandedExams(prev => ({
      ...prev,
      [examId]: !prev[examId]
    }));
  };

  return (
    <>
      <HeaderUsuario />
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Resultados dos Exames</h1>
        <p className="text-lg text-gray-700 mb-6">
          Aqui você pode visualizar todos os resultados dos seus exames. Clique em um exame para ver os detalhes.
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Carregando resultados...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p className="font-bold">Erro</p>
            <p>{error}</p>
          </div>
        ) : resultados.length === 0 ? (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
            <p>Você ainda não possui resultados disponíveis.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedResults).map(([date, exams]) => (
              <div key={date} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Exames realizados em {date}
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {exams.map((res) => (
                    <div key={res._id} className="hover:bg-gray-50 transition-colors">
                      <button
                        onClick={() => toggleExpand(res._id)}
                        className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${expandedExams[res._id] ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {res.exame_nome}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(res.data_preenchimento).toLocaleTimeString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                            Concluído
                          </span>
                          {expandedExams[res._id] ? (
                            <span className="text-gray-500">▲</span>  // Seta para cima Unicode
                          ) : (
                            <span className="text-gray-500">▼</span>  // Seta para baixo Unicode
                          )}
                        </div>
                      </button>

                      {/* Conteúdo expansível */}
                      <div className={`transition-all duration-300 overflow-hidden ${expandedExams[res._id] ? 'max-h-[1000px]' : 'max-h-0'}`}>
                        <div className="p-4 pt-0 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-3 text-gray-700 border-b pb-2">
                                Resultados
                              </h4>
                              <ul className="space-y-2">
                                {res.resultados && Object.entries(res.resultados).map(([key, value]) => (
                                  <li key={key} className="flex justify-between">
                                    <span className="text-gray-600">{key}:</span>
                                    <span className="font-medium">{value}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-3 text-gray-700 border-b pb-2">
                                Laudo Médico
                              </h4>
                              <div className="whitespace-pre-line text-sm">
                                {res.laudo_completo}
                              </div>
                            </div>
                          </div>

                          {res.observacoes && res.observacoes !== "N/A" && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r">
                              <h4 className="font-medium text-yellow-800">Observações:</h4>
                              <p className="text-sm text-yellow-700 mt-1">{res.observacoes}</p>
                            </div>
                          )}

                          <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r">
                            <h4 className="font-medium text-green-800">Conclusão:</h4>
                            <p className="font-semibold text-green-700 mt-1">{res.conclusao}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Resultados;