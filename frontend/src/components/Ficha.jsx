import HeaderMedico from "./HeaderMedico";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const valoresReferencia = {
  Hemograma: "Normal: Hemoglobina (12-16 g/dL), Hematócrito (36-46%)",
  Glicemia: "Normal: 70-99 mg/dL (Jejum)",
  Colesterol: "Desejável: < 200 mg/dL",
  Triglicerídeos: "Desejável: < 150 mg/dL",
  Creatinina: "0.6 a 1.3 mg/dL",
  // Adiciona outros exames conforme necessário
};


const Ficha = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { pacienteId, pacienteNome, exameNome } = location.state || {};

  const [resultado, setResultado] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ficha = {
      pacienteId,
      pacienteNome,
      exameNome,
      resultado,
      observacoes,
      dataPreenchimento: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/medico/fichas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ficha),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboardmedico"); // Volta para o dashboard ou onde quiser
        }, 1500);
      } else {
        console.error("Erro ao salvar ficha");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderMedico />
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Ficha de Exame</h1>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Dados do Paciente</h2>
            <p>
              <strong>Paciente:</strong> {pacienteNome}
            </p>
            <p>
              <strong>Exame:</strong> {exameNome}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">
                Resultado do Exame:
              </label>
              <input
                type="text"
                value={resultado}
                onChange={(e) => setResultado(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Ex: 110 mg/dL, Normal, Alterado..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">
                Observações (opcional):
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full border p-2 rounded"
                rows={4}
                placeholder="Informações adicionais, anomalias, considerações..."
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">
                Valor de Referência:
              </label>
              <p className="bg-gray-100 p-2 rounded border">
                {valoresReferencia[exameNome] ||
                  "Valor de referência não cadastrado."}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Salvando..." : "Salvar Ficha"}
            </button>

            {success && (
              <p className="text-green-600 mt-4">
                ✅ Ficha salva com sucesso! Redirecionando...
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Ficha;
