import HeaderUsuario from "./HeaderUsuario";
import React, { useEffect, useState } from "react";

const Resultados = () => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfDia, setPdfDia] = useState(null);

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, []);

  // Agrupa exames por data (dia)
  const examesPorDia = {};
  resultados.forEach((ficha) => {
    const dia = ficha.data_preenchimento
      ? new Date(ficha.data_preenchimento).toLocaleDateString("pt-BR")
      : "Sem data";
    if (!examesPorDia[dia]) examesPorDia[dia] = [];
    if (ficha.exames && ficha.exames.length > 0) {
      ficha.exames.forEach((exam) => {
        examesPorDia[dia].push({ ...exam, ficha });
      });
    }
  });

  // Função para abrir o PDF do dia
  const handlePdfDia = (dia) => {
    setPdfDia(dia);
    setShowPdf(true);
  };

  return (
    <>
      <HeaderUsuario />
      <div className="pt-10 pb-28 max-w-7xl mx-auto h-screen flex">
        {/* Lista lateral agrupada por dia */}
        <div className="w-1/3 pr-6 border-r overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Resultado de Exames</h1>
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : Object.keys(examesPorDia).length === 0 ? (
            <p>Você ainda não possui resultados disponíveis.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(examesPorDia).map(([dia, exames]) => (
                <div key={dia} className="border rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800">{dia}</h2>
                    <button
                      className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      onClick={() => handlePdfDia(dia)}
                    >
                      PDF do Dia
                    </button>
                  </div>
                  <div className="divide-y">
                    {exames.map((exam, idx) => (
                      <div
                        key={exam.ficha._id + "_" + idx}
                        onClick={() => setSelectedExam(exam)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedExam?.ficha?._id === exam.ficha._id && selectedExam.nome === exam.nome
                          ? "bg-blue-50"
                          : "bg-white"
                          }`}
                      >
                        <h3 className="font-semibold">{exam.nome}</h3>
                        <p className="text-sm text-gray-500">
                          {exam.ficha.data_preenchimento
                            ? new Date(exam.ficha.data_preenchimento).toLocaleTimeString("pt-BR")
                            : ""}
                        </p>
                        <button className="mt-2 text-sm px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                          Compartilhar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalhes do exame */}
        <div className="w-2/3 pl-6 overflow-y-auto">
          {selectedExam ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">{selectedExam.nome}</h2>
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                  Concluído
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Resultados</h3>
                <ul className="space-y-1">
                  {selectedExam.resultados &&
                    Object.entries(selectedExam.resultados).map(([key, value]) => (
                      <li key={key} className="flex justify-between border-b py-1">
                        <span className="text-gray-600">{key}</span>
                        <span className="font-medium">{value}</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Laudo Médico</h3>
                <p className="whitespace-pre-line text-sm text-gray-800">
                  {selectedExam.laudo_completo}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Selecione um exame à esquerda para ver os detalhes</p>
          )}
        </div>
      </div>

      {/* Modal PDF do dia */}
      {showPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full">
            <button className="mb-2 text-red-600" onClick={() => setShowPdf(false)}>Fechar</button>
            <iframe
              src={`http://localhost:5000/api/medico/pdf-dia?data=${encodeURIComponent(pdfDia)}&access_token=${localStorage.getItem("token")}`}
              title="PDF do Dia"
              width="100%"
              height="600px"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Resultados;