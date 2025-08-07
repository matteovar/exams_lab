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
    {nome: "Hemograma", especialidade: "Patologia Clínica"},
    {nome: "Raio-X", especialidade: "Radiologia"},
    {nome: "Ultrassom", especialidade: "Ultrassonografia"},
    {nome: "Ressonância Magnética", especialidade: "Radiologia"},
    {nome: "Consulta Clínica", especialidade: "Clínica Médica"},
    {nome: "Eletrocardiograma", especialidade: "Cardiologia"},
    {nome: "Tomografia Computadorizada", especialidade: "Radiologia"},
    {nome: "Mamografia", especialidade: "Radiologia"},
    {nome: "Colonoscopia", especialidade: "Gastroenterologia"},
    {nome: "Endoscopia Digestiva", especialidade: "Gastroenterologia"},
    {nome: "Teste de Esforço", especialidade: "Cardiologia"},
    {nome: "Ecocardiograma", especialidade: "Cardiologia"},
    {nome: "Papanicolau", especialidade: "Ginecologia"},
    {nome: "Exame de Urina (EAS)", especialidade: "Patologia Clínica"},
    {nome: "Glicemia em Jejum", especialidade: "Endocrinologia"},
    {nome: "TSH e T4 Livre", especialidade: "Endocrinologia"},
    {nome: "Exame de Fezes", especialidade: "Patologia Clínica"},
    {nome: "Audiometria", especialidade: "Otorrinolaringologia"},
    {nome: "Espirometria", especialidade: "Pneumologia"},
    {nome: "Sorologia para HIV", especialidade: "Infectologia"},
    {nome: "Sorologia para Hepatites", especialidade: "Infectologia"},
    {nome: "Colesterol Total e Frações", especialidade: "Endocrinologia"},
    {nome: "Beta HCG", especialidade: "Ginecologia"},
    {nome: "Densitometria Óssea", especialidade: "Reumatologia"},
    {nome: "Ureia e Creatinina", especialidade: "Nefrologia"},
    {nome: "Proteinúria de 24 horas", especialidade: "Nefrologia"},
    {nome: "Gasometria arterial", especialidade: "Patologia Clínica"},
    {nome: "VHS", especialidade: "Patologia Clínica"},
    {nome: "PCR (Proteína C Reativa)", especialidade: "Patologia Clínica"},
    {nome: "Tipagem Sanguínea e Fator Rh", especialidade: "Imuno-hematologia"},
    {nome: "TP e TTPa", especialidade: "Hematologia"},
    {nome: "Coagulograma completo", especialidade: "Hematologia"},
    {nome: "EEG (Eletroencefalograma)", especialidade: "Neurologia"},
    {nome: "Potenciais Evocados", especialidade: "Neurologia"},
    {nome: "MAPA", especialidade: "Cardiologia"},
    {nome: "Holter 24h", especialidade: "Cardiologia"},
    {nome: "Cateterismo Cardíaco", especialidade: "Cardiologia"},
    {nome: "Radiografia de Tórax", especialidade: "Radiologia"},
    {nome: "Radiografia de Coluna", especialidade: "Radiologia"},
    {nome: "Urografia Excretora", especialidade: "Urologia"},
    {nome: "Histerossalpingografia", especialidade: "Ginecologia"},
    {nome: "Artrografia", especialidade: "Radiologia"},
    {nome: "Cintilografia Óssea", especialidade: "Medicina Nuclear"},
    {nome: "Teste do Pezinho", especialidade: "Genética"},
    {nome: "Cariótipo", especialidade: "Genética"},
    {nome: "PCR para COVID-19", especialidade: "Biologia Molecular"},
    {nome: "Exame de DNA", especialidade: "Genética"},
    {nome: "Exoma completo", especialidade: "Genética"},
    {nome: "Ultrassom Obstétrico", especialidade: "Obstetrícia"},
    {nome: "Ultrassom Transvaginal", especialidade: "Ginecologia"},
    {nome: "Doppler Fetal", especialidade: "Obstetrícia"},
    {nome: "Colposcopia", especialidade: "Ginecologia"},
    {nome: "Biópsia de Colo do Útero", especialidade: "Ginecologia"},
    {nome: "Triagem Auditiva Neonatal", especialidade: "Neonatologia"},
    {nome: "Triagem Oftalmológica Neonatal", especialidade: "Neonatologia"},
    {nome: "Tonometria", especialidade: "Oftalmologia"},
    {nome: "Mapeamento de Retina", especialidade: "Oftalmologia"},
    {nome: "Campimetria Visual", especialidade: "Oftalmologia"},
    {nome: "Fundoscopia", especialidade: "Oftalmologia"},
    {nome: "Nasofibrolaringoscopia", especialidade: "Otorrinolaringologia"},
    {nome: "Teste de Impedância Acústica", especialidade: "Otorrinolaringologia"},
    {nome: "BERA", especialidade: "Otorrinolaringologia"},
    {nome: "Polissonografia", especialidade: "Pneumologia"},
    {nome: "Teste de Caminhada de 6 minutos", especialidade: "Pneumologia"},
    {nome: "Ressonância de Joelho", especialidade: "Ortopedia"},
    {nome: "Ressonância de Ombro", especialidade: "Ortopedia"},
    {nome: "Artrocentese", especialidade: "Reumatologia"},
    {nome: "FAN (Fator Antinuclear)", especialidade: "Reumatologia"},
    {nome: "Fator Reumatoide", especialidade: "Reumatologia"},
    {nome: "Anti-CCP", especialidade: "Reumatologia"},
    {nome: "Teste rápido de Dengue", especialidade: "Infectologia"},
    {nome: "Teste rápido de Zika", especialidade: "Infectologia"},
    {nome: "Teste rápido de Chikungunya", especialidade: "Infectologia"},
    {nome: "ELISA para HIV", especialidade: "Infectologia"},
    {nome: "ELISA para Sífilis", especialidade: "Infectologia"},
    {nome: "ELISA para Hepatites", especialidade: "Infectologia"},
    {nome: "IgG e IgM para Rubéola", especialidade: "Imunologia"},
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (dataExame < hoje) {
      setError("Data inválida. Escolha uma data igual ou posterior a hoje.");
      return;
    }

    setLoading(true);

    try {
      // Busca a especialidade do exame selecionado
      const exameSelecionado = examesDisponiveis.find((ex) => ex.nome === nomeExame);
      const especialidade = exameSelecionado ? exameSelecionado.especialidade : "";

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
            especialidade, // Envie a especialidade junto!
            data_exame: `${dataExame}T${horario}:00`,
            observacoes,
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