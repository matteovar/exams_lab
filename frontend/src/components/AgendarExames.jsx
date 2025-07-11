import { useState, useEffect } from "react";
import HeaderUsuario from "./HeaderUsuario";

const AgendarExames = () => {
  const [nomeExame, setNomeExame] = useState("");
  const [dataExame, setDataExame] = useState("");
  const [horario, setHorario] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [medicos, setMedicos] = useState([]);
  const [medicoSelecionado, setMedicoSelecionado] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const examesDisponiveis = [
    { nome: "Hemograma" },
    { nome: "Raio-X" },
    { nome: "Ultrassom" },
    { nome: "Ressonância Magnética" },
    { nome: "Consulta Clínica" },
    { nome: "Eletrocardiograma" },
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
  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/medico/lista", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar médicos");
        return res.json();
      })
      .then((data) => setMedicos(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (dataExame < hoje) {
      setError("Data inválida. Escolha uma data igual ou posterior a hoje.");
      return;
    }
    if (!medicoSelecionado) {
      setError("Selecione um médico responsável.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/agendamento/agendamento",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tipo_exame: nomeExame,
            data_exame: `${dataExame}T${horario}:00`,
            observacoes,
            cpf_medico: medicoSelecionado, 
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Erro ao agendar exame");
      }

      setSuccess(true);
      setNomeExame("");
      setDataExame("");
      setHorario("");
      setObservacoes("");
      setMedicoSelecionado("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              <label className="block mb-1">Médico Responsável:</label>
              <select
                value={medicoSelecionado}
                onChange={(e) => setMedicoSelecionado(e.target.value)}
                required
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione um médico</option>
                {medicos.map((medico) => (
                  <option key={medico.cpf} value={medico.cpf}>
                    {medico.nome} — {medico.cpf}
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
                !medicoSelecionado ||
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
