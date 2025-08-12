import { useState } from "react";
import { User, Mail, Lock, Phone, IdCard, Stethoscope, Calendar, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CadastroProfissional = () => {
  const [step, setStep] = useState(0); // 0 = escolha tipo
  const [tipo, setTipo] = useState(""); // medico | tecnico

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [crm, setCrm] = useState("");
  const [crmEstado, setCrmEstado] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [funcao, setFuncao] = useState(""); // para técnico
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const formatCPF = (value) => {
    const cleaned = value.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 3) formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length > 6) formatted = `${formatted.slice(0, 7)}.${formatted.slice(7)}`;
    if (cleaned.length > 9) formatted = `${formatted.slice(0, 11)}-${formatted.slice(11)}`;
    return formatted.slice(0, 14);
  };

  const formatRG = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 9);
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length > 5) formatted = `${formatted.slice(0, 6)}.${formatted.slice(6)}`;
    if (cleaned.length > 8) formatted = `${formatted.slice(0, 10)}-${formatted.slice(10)}`;
    return formatted;
  };

  const formatTelefone = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length <= 10) return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    if (senha !== confirmaSenha) {
      setMsg("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    setMsg("");

    const payload = {
      nome,
      cpf: cpf.replace(/\D/g, ""),
      rg,
      data_nascimento: dataNascimento,
      email,
      telefone: telefone.replace(/\D/g, ""),
      senha,
      confirma_senha: confirmaSenha,
      tipo,
    };

    if (tipo === "medico") {
      payload.crm = crm;
      payload.crm_estado = crmEstado;
      payload.especialidade = especialidade;
    } else if (tipo === "tecnico") {
      payload.funcao = funcao;
    }

    try {
      const url =
        tipo === "medico"
          ? "http://localhost:5000/api/usuario/register-medico"
          : "http://localhost:5000/api/usuario/register-tecnico";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setMsg(`${tipo === "medico" ? "Médico" : "Técnico"} cadastrado com sucesso!`);
        setTimeout(() => {
          navigate(tipo === "medico" ? "/dashboard-medico" : "/painel-coleta");
        }, 1500);
      } else {
        setMsg(data.msg || data.message || "Erro ao cadastrar.");
      }
    } catch {
      setMsg("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    // Escolha tipo
    if (step === 0) {
      return (
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => { setTipo("medico"); setStep(1); }}
            className="w-64 bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            <Stethoscope className="inline mr-2" /> Cadastrar Médico
          </button>
          <button
            onClick={() => { setTipo("tecnico"); setStep(1); }}
            className="w-64 bg-green-500 text-white py-3 rounded hover:bg-green-600"
          >
            <ClipboardList className="inline mr-2" /> Cadastrar Técnico
          </button>
        </div>
      );
    }

    // Etapa 1: dados pessoais
    if (step === 1) {
      return (
        <>
          {/* Nome */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" className="w-full" required />
            </div>
          </div>
          {/* CPF */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <IdCard className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} placeholder="000.000.000-00" className="w-full" required />
            </div>
          </div>
          {/* RG */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <IdCard className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" value={rg} onChange={(e) => setRg(formatRG(e.target.value))} placeholder="00.000.000-0" className="w-full" required />
            </div>
          </div>
          {/* Data de Nascimento */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="w-full" required />
            </div>
          </div>
          {/* Telefone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <Phone className="w-4 h-4 text-gray-400 mr-2" />
              <input type="tel" value={telefone} onChange={(e) => setTelefone(formatTelefone(e.target.value))} placeholder="(00) 00000-0000" className="w-full" required />
            </div>
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemplo@email.com" className="w-full" required />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => setStep(0)} className="px-4 py-2 bg-gray-300 rounded">Voltar</button>
            <button type="button" onClick={() => setStep(2)} className="px-4 py-2 bg-blue-500 text-white rounded">Próximo</button>
          </div>
        </>
      );
    }

    // Etapa 2: dados profissionais
    if (step === 2) {
      return (
        <>
          {tipo === "medico" ? (
            <>
              {/* CRM */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">CRM</label>
                <div className="flex items-center border border-gray-300 rounded px-3 py-2">
                  <Stethoscope className="w-4 h-4 text-gray-400 mr-2" />
                  <input type="text" value={crm} onChange={(e) => setCrm(e.target.value)} placeholder="CRM" className="w-full" required />
                </div>
              </div>
              {/* Estado CRM */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado do CRM</label>
                <input type="text" value={crmEstado} onChange={(e) => setCrmEstado(e.target.value)} placeholder="Ex: SP" className="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              {/* Especialidade */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                <input type="text" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} placeholder="Especialidade" className="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
            </>
          ) : (
            <>
              {/* Função para técnico */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                <input type="text" value={funcao} onChange={(e) => setFuncao(e.target.value)} placeholder="Ex: Coletor" className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
            </>
          )}
          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-gray-300 rounded">Voltar</button>
            <button type="button" onClick={() => setStep(3)} className="px-4 py-2 bg-blue-500 text-white rounded">Próximo</button>
          </div>
        </>
      );
    }

    // Etapa 3: senha
    if (step === 3) {
      return (
        <>
          {/* Senha */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <Lock className="w-4 h-4 text-gray-400 mr-2" />
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" className="w-full" required />
            </div>
          </div>
          {/* Confirmar Senha */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <Lock className="w-4 h-4 text-gray-400 mr-2" />
              <input type="password" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} placeholder="Confirme sua senha" className="w-full" required />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => setStep(2)} className="px-4 py-2 bg-gray-300 rounded">Voltar</button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded" disabled={loading}>
              {loading ? "Cadastrando..." : "Concluir"}
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-xl mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          {step === 0 ? "Escolher Tipo de Cadastro" : `Cadastro de ${tipo === "medico" ? "Médico" : "Técnico"}`}
        </h2>

        {msg && (
          <div className={`mb-4 text-center text-sm font-medium px-4 py-2 rounded ${msg.includes("sucesso") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {msg}
          </div>
        )}

        {step > 0 ? (
          <form onSubmit={handleCadastro}>
            {renderStep()}
          </form>
        ) : (
          renderStep()
        )}
      </div>
    </div>
  );
};

export default CadastroProfissional;
