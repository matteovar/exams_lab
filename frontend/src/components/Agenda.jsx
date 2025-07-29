import HeaderMedico from "./HeaderMedico";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Agenda = () => {
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [agenda, setAgenda] = useState([]);
  const [medicos, setMedicos] = useState({}); // objeto chaveado por cpf
  const [expanded, setExpanded] = useState(null);
  const [data, setData] = useState(getToday());
  const navigate = useNavigate();

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const abrirFicha = (id, cpf, item) => {
    navigate("/ficha", {
      state: {
        pacienteId: cpf,
        pacienteNome: cpf, // ajuste se tiver o nome
        exameNome: item.tipo_exame,
      },
    });
  };

  const verFicha = (fichaId) => {
    navigate(`/ver-ficha/${fichaId}`);
  };

  // Busca agenda do backend
  const fetchAgenda = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/agendamento/agendamento${data ? `?data=${data}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Erro ao buscar agenda");

      const dataAgenda = await response.json();
      setAgenda(dataAgenda);
    } catch (error) {
      console.error("Erro ao buscar agenda:", error);
    }
  };

  const fetchMedicos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/medico/lista`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar médicos");

      const data = await response.json();
      const medicosMap = {};
      data.forEach((m) => {
        medicosMap[m.cpf] = m.nome;
      });
      setMedicos(medicosMap);
    } catch (error) {
      console.error("Erro ao buscar médicos:", error);
    }
  };

  useEffect(() => {
    fetchAgenda();
    fetchMedicos();
  }, [data]);

  return (
    <>
      <HeaderMedico />
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Agenda do Dia</h1>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Data:</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Paciente (CPF)</th>
                <th className="px-4 py-2 text-center">Data</th>
                <th className="px-4 py-2 text-center">Hora</th>
                <th className="px-4 py-2 text-center">Exame</th>
                <th className="px-4 py-2 text-center">Médico Responsável</th>
                <th className="px-4 py-2 text-center">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {agenda.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    Nenhuma consulta ou exame para esta data.
                  </td>
                </tr>
              ) : (
                agenda.map((item) => {
                  const [dataExame, horaExame] = item.data_exame
                    ? item.data_exame.split("T")
                    : ["", ""];

                  const cpfMedico =
                    item.medico_responsavel || item.cpf_medico || "";

                  return (
                    <React.Fragment key={item._id}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{item.cpf_usuario}</td>
                        <td className="px-4 py-3 text-center">{dataExame}</td>
                        <td className="px-4 py-3 text-center">
                          {horaExame ? horaExame.substring(0, 5) : ""}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.tipo_exame}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {medicos[cpfMedico] || cpfMedico || "Não informado"}
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
                          <td colSpan="6" className="px-6 py-4">
                            <h3 className="font-semibold mb-2">Observações:</h3>
                            <p>{item.observacoes || "Nenhuma observação."}</p>
                            <h3 className="font-semibold mt-4 mb-2">
                              Status do Agendamento:
                            </h3>
                            <p>{item.status}</p>
                            {item.status === "concluído" && item.ficha_id ? (
                              <button
                                onClick={() => verFicha(item.ficha_id)}
                                className="mt-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                              >
                                Ver Ficha
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  abrirFicha(item._id, item.cpf_usuario, item)
                                }
                                className="mt-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                              >
                                Abrir Ficha
                              </button>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Agenda;