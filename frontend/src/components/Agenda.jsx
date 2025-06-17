import HeaderMedico from "./HeaderMedico";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, FileEdit } from "lucide-react";
import { useNavigate } from "react-router-dom";



const Agenda = () => {
  const [agenda, setAgenda] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgenda();
  }, [data]);

  const fetchAgenda = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/medico/agenda?data=${data}`
      );
      const dataResponse = await response.json();
      setAgenda(dataResponse);
    } catch (error) {
      console.error("Erro ao carregar agenda:", error);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const abrirFicha = (pacienteId, pacienteNome, exame) => {
    navigate(`/ficha`, {
      state: {
        pacienteId: pacienteId,
        pacienteNome: pacienteNome,
        exameNome: exame.nome,
      },
    });
  };

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
                <th className="px-4 py-2 text-left">Paciente</th>
                <th className="px-4 py-2 text-center">Data</th>
                <th className="px-4 py-2 text-center">Hora</th>
                <th className="px-4 py-2 text-center">Exames</th>
              </tr>
            </thead>
            <tbody>
              {agenda.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6">
                    Nenhuma consulta ou exame para esta data.
                  </td>
                </tr>
              ) : (
                agenda.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{item.paciente}</td>
                      <td className="px-4 py-3 text-center">{item.data}</td>
                      <td className="px-4 py-3 text-center">{item.horario}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="transition-transform"
                        >
                          {expanded === item.id ? (
                            <ChevronUp className="w-6 h-6 text-blue-600" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-blue-600" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {expanded === item.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="px-6 py-4">
                          <h3 className="font-semibold mb-2">
                            Exames para realizar:
                          </h3>
                          <ul className="list-disc list-inside space-y-2">
                            {item.exames.map((exame, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span>
                                  <strong>{exame.nome}</strong>
                                  {exame.resultado
                                    ? ` — Resultado: ${exame.resultado}`
                                    : ""}
                                </span>
                                <button
                                  onClick={() =>
                                    abrirFicha(item.id, item.paciente, exame)
                                  }
                                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                  <FileEdit className="w-4 h-4" />
                                  Abrir Ficha
                                </button>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Agenda;
