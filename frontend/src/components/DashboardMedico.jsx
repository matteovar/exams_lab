import HeaderMedico from "./HeaderMedico";
import { useEffect, useState } from "react";

const DashboardMedico = () => {
  // Mock dos dados, pode ser substituído por fetch em backend real
  const [metrics, setMetrics] = useState({
    fichasAbertas: 12,
    fichasEmAnalise: 7,
    resultadosLiberados: 15,
  });

  // Aqui poderia ter useEffect para buscar os dados reais, exemplo:
  // useEffect(() => {
  //   fetch('/api/medico/metrics').then(res => res.json()).then(data => setMetrics(data));
  // }, []);

  return (
    <>
      <HeaderMedico />
      <div className="mx-auto max-w-screen-xl p-8">
        <h1 className="text-3xl font-bold text-[#0058CD]">Dashboard</h1>
        <p className="mt-4 text-lg">Bem-vindo, doutor!</p>

        {/* Resumo */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Resumo</h2>
          <p>Número de fichas abertas: <strong>{metrics.fichasAbertas}</strong></p>
          <p>Exames pendentes (fichas em análise): <strong>{metrics.fichasEmAnalise}</strong></p>
          <p>Laudos emitidos (resultados liberados): <strong>{metrics.resultadosLiberados}</strong></p>
        </section>

        {/* Cards */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-600">
            <h3 className="text-lg font-semibold mb-2">Fichas Abertas</h3>
            <p className="text-3xl font-bold text-blue-600">{metrics.fichasAbertas}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold mb-2">Fichas em Análise</h3>
            <p className="text-3xl font-bold text-yellow-600">{metrics.fichasEmAnalise}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-600">
            <h3 className="text-lg font-semibold mb-2">Resultados Liberados</h3>
            <p className="text-3xl font-bold text-green-600">{metrics.resultadosLiberados}</p>
          </div>
        </section>
      </div>
    </>
  );
};

export default DashboardMedico;
