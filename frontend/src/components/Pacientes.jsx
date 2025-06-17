import HeaderMedico from "./HeaderMedico";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado. Faça login novamente.");
        const response = await fetch(
          "http://localhost:5000/api/medico/pacientes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Erro ao carregar pacientes");
        const data = await response.json();
        setPacientes(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAgendamentos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado. Faça login novamente.");
        const response = await fetch("http://localhost:5000/api/medico/agenda", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Erro ao carregar agendamentos");
        const data = await response.json();
        setAgendamentos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
    fetchAgendamentos();
  }, []);

  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFichasCount = (paciente) => {
    const agendamento = agendamentos.find((ag) => ag.paciente === paciente);
    return agendamento && agendamento.fichas ? agendamento.fichas.length : 0;
  };

  return (
    <>
      <HeaderMedico />
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Pacientes</h1>
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 border rounded w-full"
            />
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Paciente</th>
                  <th className="px-4 py-2 text-center">Últimos Exames</th>
                  <th className="px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPacientes.map((paciente, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{paciente}</td>
                    <td className="px-4 py-3 text-center">
                      {getFichasCount(paciente)} ficha
                      {getFichasCount(paciente) !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          navigate(`/pacientes/${encodeURIComponent(paciente)}`)
                        }
                        className="text-blue-600 hover:underline"
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Pacientes;