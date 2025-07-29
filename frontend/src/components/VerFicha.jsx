import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMedico from "./HeaderMedico";

const valoresReferencia = {
  Hemograma: "Normal: Hemoglobina (12-16 g/dL), Hematócrito (36-46%)",
  Glicemia: "Normal: 70-99 mg/dL (Jejum)",
  Colesterol: "Desejável: < 200 mg/dL",
  Triglicerídeos: "Desejável: < 150 mg/dL",
  Creatinina: "0.6 a 1.3 mg/dL",
  // Adicione outros exames conforme necessário
};

const VerFicha = () => {
  const { fichaId } = useParams();
  const navigate = useNavigate();
  const [ficha, setFicha] = useState(null);

  useEffect(() => {
    const fetchFicha = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/medico/fichas/${fichaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFicha(data);
      }
    };
    fetchFicha();
  }, [fichaId]);

  if (!ficha) {
    return (
      <div className="p-8">
        <HeaderMedico />
        <p>Carregando ficha...</p>
      </div>
    );
  }

  return (
    <>
      <HeaderMedico />
      <div className="p-4 max-w-5xl mx-auto min-h-screen mt-24">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Ficha de Exame</h1>
          <p><strong>Paciente:</strong> {ficha.pacienteNome || ficha.pacienteId}</p>
          <p><strong>Exame:</strong> {ficha.exameNome}</p>
          <div className="my-4">
            <label className="block font-semibold">Resultado do Exame:</label>
            <div className="border rounded p-2 bg-gray-50">{ficha.resultado}</div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Observações:</label>
            <div className="border rounded p-2 bg-gray-50">{ficha.observacoes || "Nenhuma"}</div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Valor de Referência:</label>
            <div className="border rounded p-2 bg-gray-50">
              {valoresReferencia[ficha.exameNome] || "Valor de referência não cadastrado."}
            </div>
          </div>
          <button
            onClick={() => navigate("/agenda")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Voltar para Agenda
          </button>
        </div>
      </div>
    </>
  );
};

export default VerFicha;