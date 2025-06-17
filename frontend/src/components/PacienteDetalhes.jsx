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
        const response = await fetch(
          `http://localhost:5000/api/medico/pacientes/${nome}`
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
                {dados?.fichas?.map((ficha) => (
                  <div key={ficha.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Ficha {ficha.id}</h3>
                        <p className="text-sm text-gray-500">
                          Aberta em {ficha.data_de_abertura || "Sem data"}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:underline">
                          Todos os exames
                        </button>
                        <button className="text-blue-600 hover:underline">
                          Laudo evolutivo
                        </button>
                        <button className="text-blue-600 hover:underline">
                          Imprimir
                        </button>
                        <button className="text-blue-600 hover:underline">
                          PDF-PT
                        </button>
                      </div>
                    </div>

                    {ficha.exames.length > 0 ? (
                      <div className="mt-4 pl-4">
                        <h4 className="font-medium mb-2">
                          Exames desta ficha:
                        </h4>
                        <ul className="space-y-2">
                          {ficha.exames.map((exame, idx) => (
                            <li key={idx} className="border-b pb-2">
                              <p>
                                <strong>{exame.nome}</strong> -{" "}
                                {exame.resultado || "Resultado não disponível"}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="mt-4 pl-4 text-gray-500">
                        Nenhum exame nesta ficha
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PacienteDetalhes;
