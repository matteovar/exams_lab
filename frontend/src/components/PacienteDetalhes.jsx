import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMedico from "./HeaderMedico";
import { ArrowLeft } from "lucide-react";

const PacienteDetalhes = () => {
  const { nome } = useParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamesPaciente = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/medico/pacientes/${nome}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Erro ao carregar dados do paciente");
        const data = await response.json();
        setDados(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamesPaciente();
  }, [nome]);

  if (loading) {
    return (
      <>
        <HeaderMedico />
        <div className="p-8 bg-gray-100 min-h-screen">
          <div className="text-center py-8">Carregando...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderMedico />
        <div className="p-8 bg-gray-100 min-h-screen">
          <div className="text-red-500 text-center py-8">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderMedico />
      <div className="p-8 bg-gray-100 min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 mb-4"
        >
          <ArrowLeft className="mr-2" /> Voltar para lista de pacientes
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">{nome}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold mb-2">Informações Pessoais</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold mb-2">Informações Pessoais</h2>
                <p>
                  <strong>Idade:</strong>{" "}
                  {dados?.paciente?.idade || "Não informado"}
                </p>
                <p>
                  <strong>Contato:</strong>{" "}
                  {dados?.paciente?.contato || "Não informado"}
                </p>
                <p>
                  <strong>Problema de Saúde:</strong>{" "}
                  {dados?.paciente?.problema_de_saude || "Não informado"}
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="font-semibold mb-4">Fichas de Exames</h2>
              <div className="space-y-4">
                {dados?.fichas?.length > 0 ? (
                  dados.fichas.map((ficha) => (
                    <div key={ficha._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Exame: {ficha.exameNome}</h3>
                          <p className="text-sm text-gray-500">
                            Data: {ficha.dataPreenchimento
                              ? new Date(ficha.dataPreenchimento).toLocaleString()
                              : "Sem data"}
                          </p>
                        </div>
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => navigate(`/ver-ficha/${ficha._id}`)}
                        >
                          Ver Ficha
                        </button>
                      </div>
                      <div className="mt-2">
                        <p>
                          <strong>Resultado:</strong> {ficha.resultado}
                        </p>
                        <p>
                          <strong>Observações:</strong> {ficha.observacoes || "Nenhuma"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhuma ficha encontrada para este paciente.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PacienteDetalhes;
