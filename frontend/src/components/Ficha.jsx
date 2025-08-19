import HeaderMedico from "./HeaderMedico";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Ficha = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { agendamentoId, pacienteId, pacienteNome, exames } = location.state || {};

  const [resultados, setResultados] = useState({});
  const [observacoes, setObservacoes] = useState({});
  const [conclusao, setConclusao] = useState({});
  const [exameAtual, setExameAtual] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [padroes, setPadroes] = useState({});

  // Carregar padrões de exame
  useEffect(() => {
    const carregarPadroes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/exames/padroes");
        if (response.ok) {
          const data = await response.json();
          setPadroes(data.padroes);

          const resultadosIniciais = {};
          exames.forEach((exame) => {
            if (data.padroes[exame.nome]) {
              resultadosIniciais[exame.nome] = {};
              data.padroes[exame.nome].campos.forEach((campo) => {
                resultadosIniciais[exame.nome][campo.nome] = "";
              });
            }
          });
          setResultados(resultadosIniciais);
        }
      } catch (error) {
        console.error("Erro ao carregar padrões:", error);
      }
    };

    if (exames?.length) carregarPadroes();
  }, [exames]);

  const handleCampoChange = (campo, valor) => {
    const exameNome = exames[exameAtual].nome;
    setResultados((prev) => ({
      ...prev,
      [exameNome]: {
        ...prev[exameNome],
        [campo]: valor,
      },
    }));
  };

  const gerarLaudoAutomatico = (exameNome) => {
    if (!padroes[exameNome]?.template) return "";

    let laudo = padroes[exameNome].template;
    const camposResultado = resultados[exameNome] || {};

    Object.entries(camposResultado).forEach(([campo, valor]) => {
      laudo = laudo.replace(`{${campo}}`, valor || "N/A");
    });

    laudo = laudo.replace("{conclusao}", conclusao[exameNome] || "N/A");

    return laudo;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validação de campos obrigatórios
    for (const exame of exames) {
      const campos = resultados[exame.nome] || {};
      const padraoCampos = padroes[exame.nome]?.campos || [];

      for (const campo of padraoCampos) {
        if (!campos[campo.nome]) {
          alert(`Campo "${campo.nome}" do exame "${exame.nome}" está vazio. Preencha ou coloque "N/A".`);
          setLoading(false);
          return;
        }
      }

      if (!conclusao[exame.nome]) {
        alert(`Conclusão do exame "${exame.nome}" está vazia. Preencha ou coloque "N/A".`);
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const laudos = exames.map((exame) => {
        const campos = resultados[exame.nome] || {};
        const camposComValor = {};

        (padroes[exame.nome]?.campos || []).forEach(c => {
          camposComValor[c.nome] = campos[c.nome] || "N/A";
        });

        return {
          nome: exame.nome,
          resultados: camposComValor,
          observacoes: observacoes[exame.nome] || "N/A",
          conclusao: conclusao[exame.nome] || "N/A",
          laudoCompleto: gerarLaudoAutomatico(exame.nome), // <<-- passe o nome correto aqui
        };
      });

      const body = {
        agendamentoId,
        pacienteId,
        pacienteNome,
        exames: laudos,
        dataPreenchimento: new Date().toISOString(),
      };

      console.log("DEBUG body enviado:", JSON.stringify(body, null, 2));

      const response = await fetch("http://localhost:5000/api/medico/fichas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/agenda"), 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erro ao salvar ficha:", errorData.msg || errorData.error || "Erro desconhecido");
        alert("Erro ao salvar ficha: " + (errorData.msg || errorData.error || "Tente novamente"));
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de rede ao salvar ficha. Verifique a API.");
    } finally {
      setLoading(false);
    }
  };

  if (!exames?.length) {
    return (
      <>
        <HeaderMedico />
        <div className="p-8 bg-gray-100 min-h-screen">
          <div className="bg-white shadow rounded-lg p-6">
            <p>Nenhum exame encontrado para este agendamento.</p>
          </div>
        </div>
      </>
    );
  }

  const exameAtualNome = exames[exameAtual].nome;
  const padraoExame = padroes[exameAtualNome] || { campos: [] };

  return (
    <>
      <HeaderMedico />
      <div className="p-8 pb-24 bg-gray-100 h-screen overflow-y-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Laudo Médico</h1>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold">Paciente: {pacienteNome}</h2>
            <p>
              Exame: {exameAtualNome} ({exameAtual + 1}/{exames.length})
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {padraoExame.campos.map((campo, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {campo.nome}
                    </label>
                    <input
                      type="text"
                      value={resultados[exameAtualNome]?.[campo.nome] || ""}
                      onChange={(e) => handleCampoChange(campo.nome, e.target.value)}
                      className="w-full border p-2 rounded"
                      placeholder={`Valor em ${campo.unidade}`}
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <span className="text-sm text-gray-600">
                      VR: {campo.valor_referencia} {campo.unidade}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Observações</label>
              <textarea
                value={observacoes[exameAtualNome] || ""}
                onChange={(e) =>
                  setObservacoes((prev) => ({
                    ...prev,
                    [exameAtualNome]: e.target.value,
                  }))
                }
                className="w-full border p-2 rounded"
                rows={3}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Conclusão</label>
              <textarea
                value={conclusao[exameAtualNome] || ""}
                onChange={(e) =>
                  setConclusao((prev) => ({
                    ...prev,
                    [exameAtualNome]: e.target.value,
                  }))
                }
                className="w-full border p-2 rounded"
                rows={3}
                required
              />
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Pré-visualização do Laudo:</h3>
              <div className="whitespace-pre-line p-3 bg-white border rounded">
                {gerarLaudoAutomatico(exameAtualNome) || "Preencha os campos para gerar o laudo..."}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setExameAtual((prev) => Math.max(0, prev - 1))}
                disabled={exameAtual === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Exame Anterior
              </button>

              <button
                type="button"
                onClick={() => setExameAtual((prev) => Math.min(exames.length - 1, prev + 1))}
                disabled={exameAtual === exames.length - 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Próximo Exame
              </button>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? "Salvando..." : "Salvar Todos os Laudos"}
              </button>
            </div>

            {success && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
                Laudos salvos com sucesso! Redirecionando...
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Ficha;
