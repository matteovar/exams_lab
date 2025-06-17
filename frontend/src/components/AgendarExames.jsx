import { useState } from "react";
import HeaderUsuario from "./HeaderUsuario";

const AgendarExames = () => {
  const [nomeExame, setNomeExame] = useState("");
  const [dataExame, setDataExame] = useState("");
  const [horario, setHorario] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const examesDisponiveis = [
    {
      nome: "Hemograma",
      valorReferencia: "Hemoglobina (12-16 g/dL), Hematócrito (36-46%)",
    },
    {
      nome: "Raio-X",
      valorReferencia: "Normal sem alterações visíveis",
    },
    {
      nome: "Ultrassom",
      valorReferencia: "Órgãos sem alterações",
    },
    {
      nome: "Ressonância Magnética",
      valorReferencia: "Imagens normais",
    },
    {
      nome: "Consulta Clínica",
      valorReferencia: "N/A",
    },
    {
      nome: "Eletrocardiograma",
      valorReferencia: "Ritmo sinusal normal",
    },
  ];

  const horariosDisponiveis = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  const hoje = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validação da data (não pode ser passada)
    if (dataExame < hoje) {
      setError("Data inválida. Escolha uma data igual ou posterior a hoje.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/usuario/agendar-exame",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nomeExame,
            dataExame,
            horario,
            observacoes,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setNomeExame("");
        setDataExame("");
        setHorario("");
        setObservacoes("");
      } else {
        setError(data.message || "Erro ao agendar exame.");
      }
    } catch (err) {
      console.error("Erro ao agendar exame:", err);
      setError("Erro ao agendar exame. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const exameSelecionado = examesDisponiveis.find(
    (exame) => exame.nome === nomeExame
  );

  return (
    <>
      <HeaderUsuario />
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-4">Agendar Exames ou Consultas</h1>
        <p className="text-lg text-gray-700 mb-4">
          Preencha os dados abaixo para realizar seu agendamento.
        </p>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Formulário de Agendamento
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Nome do Exame ou Consulta:</label>
              <select
                value={nomeExame}
                onChange={(e) => setNomeExame(e.target.value)}
                required
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                {examesDisponiveis.map((exame) => (
                  <option key={exame.nome} value={exame.nome}>
                    {exame.nome}
                  </option>
                ))}
              </select>
            </div>

        

            <div>
              <label className="block mb-1">Data do Agendamento:</label>
              <input
                type="date"
                value={dataExame}
                onChange={(e) => setDataExame(e.target.value)}
                min={hoje}
                required
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1">Horário:</label>
              <select
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                required
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                {horariosDisponiveis.map((hora) => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Observações (Opcional):</label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Ex.: Levar exames anteriores, jejum, etc."
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={
                loading ||
                !nomeExame ||
                !dataExame ||
                !horario ||
                dataExame < hoje
              }
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Agendando..." : "Agendar"}
            </button>

            {success && (
              <p className="mt-2 text-green-600">
                Agendamento realizado com sucesso!
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AgendarExames;
