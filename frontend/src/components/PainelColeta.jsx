import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderTecnico from "./HeaderTecnico";
import { CheckCircle, AlertCircle, Clipboard, Check, Loader2 } from "lucide-react";

const PainelColeta = () => {
  const [coletasPendentes, setColetasPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColeta, setSelectedColeta] = useState(null);
  const [loadingExame, setLoadingExame] = useState(null); // exame sendo confirmado

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || !user || (user.tipo !== "tecnico" && user.tipo !== "medico")) {
      navigate("/");
    }
  }, [navigate, token, user]);

  useEffect(() => {
    const fetchColetasPendentes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/coleta/pendentes", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Erro ao buscar coletas pendentes");

        const data = await response.json();
        setColetasPendentes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchColetasPendentes();
  }, [token]);

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

      // Atualiza localmente para evitar nova chamada
      setColetasPendentes(prev =>
        prev.map(coleta => {
          if (coleta._id !== agendamentoId) return coleta;
          return {
            ...coleta,
            exames: coleta.exames.map(exame =>
              exame.codigo === exameCodigo ? { ...exame, concluido: true } : exame
            )
          };
        })
      );

      // Se for a coleta selecionada, atualiza ela também
      if (selectedColeta && selectedColeta._id === agendamentoId) {
        setSelectedColeta(prev => ({
          ...prev,
          exames: prev.exames.map(exame =>
            exame.codigo === exameCodigo ? { ...exame, concluido: true } : exame
          )
        }));
      }

    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingExame(null);
    }
  };

  return (
    <>
      <HeaderTecnico />
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Painel de Coleta</h1>

        {loading ? (
          <div className="text-center py-8 flex flex-col items-center">
            <Loader2 className="animate-spin mb-2" size={32} />
            Carregando...
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Coletas Pendentes</h2>

              {coletasPendentes.length === 0 ? (
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  Nenhuma coleta pendente no momento
                </div>
              ) : (
                <div className="space-y-4">
                  {coletasPendentes.map((coleta) => (
                    <div
                      key={coleta._id}
                      onClick={() => setSelectedColeta(coleta)}
                      className={`p-4 bg-white rounded-lg shadow cursor-pointer transition-all ${
                        selectedColeta?._id === coleta._id
                          ? "ring-2 ring-blue-500"
                          : "hover:shadow-md"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{coleta.paciente_nome}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(coleta.data_coleta).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          <Clipboard className="mr-1" size={14} />
                          {coleta.exames.length} exame{coleta.exames.length > 1 ? "s" : ""}
                        </div>
                      </div>

                      <div className="mt-2">
                        <h4 className="text-sm font-medium">Exames:</h4>
                        <ul className="text-sm text-gray-700">
                          {coleta.exames.slice(0, 3).map((exame, i) => (
                            <li key={i}>
                              {exame.nome}{" "}
                              {exame.concluido ? (
                                <span className="text-green-600 font-semibold ml-2 flex items-center">
                                  <Check size={16} /> Concluído
                                </span>
                              ) : null}
                            </li>
                          ))}
                          {coleta.exames.length > 3 && <li>+ {coleta.exames.length - 3} outros</li>}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Detalhes da Coleta</h2>

              {selectedColeta ? (
                <div className="bg-white p-4 rounded-lg shadow space-y-4">
                  <h3 className="font-medium text-lg mb-2">{selectedColeta.paciente_nome}</h3>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Data/Horário:</h4>
                    <p>{new Date(selectedColeta.data_coleta).toLocaleString()}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Local:</h4>
                    <p>{selectedColeta.local_coleta || "Não informado"}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Exames:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {selectedColeta.exames.map((exame, i) => (
                        <li key={i} className="flex justify-between items-center">
                          <span>
                            {exame.nome} ({exame.codigo})
                          </span>
                          {exame.concluido ? (
                            <span className="text-green-600 font-semibold flex items-center">
                              <Check size={16} /> Concluído
                            </span>
                          ) : (
                            <button
                              disabled={loadingExame === exame.codigo}
                              onClick={() => handleConfirmarExame(selectedColeta._id, exame.codigo)}
                              className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              {loadingExame === exame.codigo ? "Confirmando..." : "Confirmar"}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg shadow text-center flex flex-col items-center justify-center h-64">
                  <AlertCircle className="text-gray-400 mb-2" size={24} />
                  <p>Selecione uma coleta para visualizar os detalhes</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PainelColeta;
