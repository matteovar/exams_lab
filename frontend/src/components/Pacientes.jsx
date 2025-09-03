import HeaderMedico from "./HeaderMedico";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado. Faça login novamente.");
        const response = await fetch("http://localhost:5000/api/medico/pacientes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Erro ao carregar pacientes");
        const data = await response.json();
        setPacientes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para formatar CPF
  const formatarCPF = (cpf) => {
    if (!cpf) return "Não informado";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  // Função para formatar telefone
  const formatarTelefone = (telefone) => {
    if (!telefone) return "Não informado";
    const cleaned = telefone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return telefone;
  };

  return (
    <>
      <HeaderMedico />
      <div className="p-6 max-w-6xl mx-auto max-h-[80vh] overflow-y-auto"> 
        <h1 className="text-3xl font-bold mb-6">Pacientes</h1>
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
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
                  <th className="px-4 py-2 text-left">CPF</th>
                  <th className="px-4 py-2 text-left">Telefone</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPacientes.map((paciente) => (
                  <tr key={paciente._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{paciente.nome}</td>
                    <td className="px-4 py-3">{formatarCPF(paciente.cpf)}</td>
                    <td className="px-4 py-3">{formatarTelefone(paciente.telefone)}</td>
                    <td className="px-4 py-3">{paciente.email || "Não informado"}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          navigate(`/pacientes/${encodeURIComponent(paciente.nome)}`, {
                            state: { pacienteId: paciente.cpf, pacienteData: paciente }
                          })
                        }
                        className="text-blue-600 hover:underline px-3 py-1 bg-blue-100 rounded hover:bg-blue-200 transition"
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredPacientes.length === 0 && pacientes.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum paciente encontrado com o termo "{searchTerm}"
              </div>
            )}
            
            {pacientes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum paciente cadastrado
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Pacientes;