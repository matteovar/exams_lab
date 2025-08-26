import HeaderMedico from "./HeaderMedico";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Agenda = () => {
  const [agenda, setAgenda] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const fetchAgenda = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/agendamento/laudos-pendentes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar agenda do médico");
      }

      const dataAgenda = await response.json();
      setAgenda(dataAgenda);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  return (
    <>
      <HeaderMedico />
      <div className="p-6 max-w-6xl mx-auto max-h-[80vh] overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Agenda - Exames Coletados</h1>

        {loading ? (
          <p>Carregando exames coletados...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : agenda.length === 0 ? (
          <p>Nenhum exame coletado pendente de resultado.</p>
        ) : (
          <div className="space-y-4">
            {agenda.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
              >
                {/* Cabeçalho do paciente */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Paciente: {item.paciente_nome}
                    </h2>
                    <p className="text-sm text-gray-500">
                      CPF: {item.cpf_usuario}
                    </p>
                    <p className="text-sm text-gray-500">
                      Exames: {item.exames.length}
                    </p>
                  </div>
                  <button onClick={() => toggleExpand(item._id)}>
                    {expanded === item._id ? (
                      <ChevronUp className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-blue-600" />
                    )}
                  </button>
                </div>

                {/* Conteúdo expandido */}
                {expanded === item._id && (
                  <div className="mt-4 animate-fadeIn">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Exames Pendentes:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {item.exames.map((ex, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1"
                        >
                          {ex.nome}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        abrirFicha(
                          item._id,
                          item.cpf_usuario,      // CPF
                          item.paciente_nome,    // Nome
                          item.exames
                        )
                      }
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      Preencher Resultado
                    </button>
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
