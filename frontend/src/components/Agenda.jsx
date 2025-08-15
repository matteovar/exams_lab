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
      const response = await fetch("http://localhost:5000/api/laudo/pendentes", {
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
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Agenda - Exames Coletados</h1>

        {loading ? (
          <p>Carregando exames coletados...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : agenda.length === 0 ? (
          <p>Nenhum exame coletado pendente de resultado.</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Paciente (CPF)</th>
                  <th className="px-4 py-2 text-center">Exames</th>
                  <th className="px-4 py-2 text-center">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {agenda.map((item) => (
                  <React.Fragment key={item._id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{item.cpf_usuario}</td>
                      <td className="px-4 py-3 text-center">
                        {item.exames.map((ex) => ex.nome).join(", ")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleExpand(item._id)}
                          className="transition-transform"
                        >
                          {expanded === item._id ? (
                            <ChevronUp className="w-6 h-6 text-blue-600" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-blue-600" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {expanded === item._id && (
                      <tr className="bg-gray-50">
                        <td colSpan="3" className="px-6 py-4">
                          <h3 className="font-semibold mb-2">Exames Pendentes:</h3>
                          <ul className="list-disc pl-5">
                            {item.exames.map((ex, idx) => (
                              <li key={idx}>{ex.nome}</li>
                            ))}
                          </ul>

                          <button
                            onClick={() =>
                              abrirFicha(
                                item._id,
                                item.cpf_usuario,
                                item.cpf_usuario,
                                item.exames
                              )
                            }
                            className="mt-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                          >
                            Preencher Resultado
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Agenda;