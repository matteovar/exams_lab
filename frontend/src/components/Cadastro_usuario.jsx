import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, IdCard, Calendar, HeartPulse, Pill, CreditCard } from "lucide-react";

const CadastroUsuario = () => {
    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
        data_nascimento: "",
        problemas_saude: "",
        medicacoes: "",
        endereco: "",
        senha: "",
        confirma_senha: "",
        tipo: "usuario",
        possui_convenio: false,
        nome_convenio: "",
        numero_carteirinha: "",
        validade_carteirinha: "",
        plano: ""
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validarEmail = (email) => email.includes("@");
    const validarTelefone = (tel) => {
        const digitos = tel.replace(/\D/g, "");
        return digitos.length === 10 || digitos.length === 11;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        if (!validarEmail(formData.email)) {
            setMsg("E-mail inválido. Deve conter '@'.");
            setLoading(false);
            return;
        }

        if (!validarTelefone(formData.telefone)) {
            setMsg("Telefone inválido. Deve conter 10 ou 11 dígitos.");
            setLoading(false);
            return;
        }

        if (formData.senha !== formData.confirma_senha) {
            setMsg("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        const payload = {
            ...formData,
            cpf: formData.cpf.replace(/\D/g, ""),
            telefone: formData.telefone.replace(/\D/g, ""),
            // Se não possui convênio, não envia os campos de convênio
            ...(!formData.possui_convenio && {
                nome_convenio: undefined,
                numero_carteirinha: undefined,
                validade_carteirinha: undefined,
                plano: undefined
            })
        };

        try {
            const response = await fetch("http://localhost:5000/api/usuario/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setMsg("Usuário cadastrado com sucesso!");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setMsg(data.msg || data.message || "Erro ao cadastrar.");
            }
        } catch (err) {
            setMsg("Erro de conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    const formatCPF = (value) => {
        const cleaned = value.replace(/\D/g, "");
        let formatted = cleaned;
        if (cleaned.length > 3) formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
        if (cleaned.length > 6) formatted = `${formatted.slice(0, 7)}.${formatted.slice(7)}`;
        if (cleaned.length > 9) formatted = `${formatted.slice(0, 11)}-${formatted.slice(11, 13)}`;
        return formatted.slice(0, 14);
    };

    const formatTelefone = (value) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 11);
        if (cleaned.length <= 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        } else {
            return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-xl mb-16">
                <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Crie sua conta</h2>

                <form onSubmit={handleCadastro}>
                    {msg && (
                        <div className={`mb-4 text-center text-sm font-medium px-4 py-2 rounded 
                            ${msg.includes("sucesso") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {msg}
                        </div>
                    )}

                    {/* Campos básicos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nome */}
                        <div className="relative mb-4 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                <User className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    placeholder="Seu nome completo"
                                    className="w-full focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* CPF */}
                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                <IdCard className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formatCPF(formData.cpf)}
                                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                    placeholder="000.000.000-00"
                                    className="w-full focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Data de Nascimento */}
                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    type="date"
                                    name="data_nascimento"
                                    value={formData.data_nascimento}
                                    onChange={handleChange}
                                    className="w-full focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email e Telefone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email */}
                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="exemplo@email.com"
                                    className="w-full focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Telefone */}
                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    type="tel"
                                    name="telefone"
                                    value={formatTelefone(formData.telefone)}
                                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                    placeholder="(00) 00000-0000"
                                    className="w-full focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Problemas de Saúde */}
                    <div className="relative mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Problemas de Saúde (opcional)</label>
                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                            <HeartPulse className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="text"
                                name="problemas_saude"
                                value={formData.problemas_saude}
                                onChange={handleChange}
                                placeholder="Ex: Diabetes, Hipertensão"
                                className="w-full focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Medicações */}
                    <div className="relative mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicações em Uso (opcional)</label>
                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                            <Pill className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="text"
                                name="medicacoes"
                                value={formData.medicacoes}
                                onChange={handleChange}
                                placeholder="Ex: Metformina 500mg, Losartana 50mg"
                                className="w-full focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="relative mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço (opcional)</label>
                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                            <input
                                type="text"
                                name="endereco"
                                value={formData.endereco}
                                onChange={handleChange}
                                placeholder="Rua, número, bairro, cidade"
                                className="w-full focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Seção Convênio Médico - Versão Aprimorada */}
                    <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                                Convênio Médico
                            </h3>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Possui convênio?</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="possui_convenio"
                                        checked={formData.possui_convenio}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition-colors ${formData.possui_convenio ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.possui_convenio ? 'transform translate-x-6' : ''
                                        }`}></div>
                                </div>
                            </label>
                        </div>

                        {formData.possui_convenio && (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Nome do Convênio */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Plano de Saúde <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                            <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                                            <input
                                                type="text"
                                                name="nome_convenio"
                                                value={formData.nome_convenio}
                                                onChange={handleChange}
                                                placeholder="Ex: Amil, Unimed, Bradesco Saúde"
                                                className="w-full focus:outline-none"
                                                required={formData.possui_convenio}
                                            />
                                        </div>
                                    </div>

                                    {/* Número da Carteirinha */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nº Carteirinha <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                            <IdCard className="w-4 h-4 text-gray-400 mr-2" />
                                            <input
                                                type="text"
                                                name="numero_carteirinha"
                                                value={formData.numero_carteirinha}
                                                onChange={handleChange}
                                                placeholder="Número completo"
                                                className="w-full focus:outline-none"
                                                required={formData.possui_convenio}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Validade */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Validade <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                            <input
                                                type="date"
                                                name="validade_carteirinha"
                                                value={formData.validade_carteirinha}
                                                onChange={handleChange}
                                                className="w-full focus:outline-none"
                                                required={formData.possui_convenio}
                                            />
                                        </div>
                                    </div>

                                    {/* Plano */}
                                    <div className="relative md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipo de Plano <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                            <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                                            <select
                                                name="plano"
                                                value={formData.plano}
                                                onChange={handleChange}
                                                className="w-full focus:outline-none bg-transparent"
                                                required={formData.possui_convenio}
                                            >
                                                <option value="">Selecione o plano</option>
                                                <option value="Enfermaria">Enfermaria</option>
                                                <option value="Apartamento">Apartamento</option>
                                                <option value="VIP">VIP</option>
                                                <option value="Premium">Premium</option>
                                                <option value="Outro">Outro</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Dados do Titular (caso não seja o paciente) */}
                                <div className="mt-4 border-t pt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                        <User className="w-4 h-4 text-gray-400 mr-2" />
                                        Dados do Titular (se diferente do paciente)
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Titular</label>
                                            <input
                                                type="text"
                                                name="titular_convenio"
                                                value={formData.titular_convenio || ''}
                                                onChange={handleChange}
                                                placeholder="Nome completo do titular"
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF do Titular</label>
                                            <input
                                                type="text"
                                                name="cpf_titular"
                                                value={formatCPF(formData.cpf_titular || '')}
                                                onChange={(e) => setFormData({ ...formData, cpf_titular: e.target.value })}
                                                placeholder="CPF do titular"
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Senhas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Senha */}
                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                <Lock className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    type="password"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleChange}
                                    placeholder="Senha"
                                    className="w-full focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Confirmar Senha */}
                        <div className="relative mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                <Lock className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    type="password"
                                    name="confirma_senha"
                                    value={formData.confirma_senha}
                                    onChange={handleChange}
                                    placeholder="Confirme sua senha"
                                    className="w-full focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botão */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-600 text-white py-2 rounded-md font-semibold transition 
                            ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                    >
                        {loading ? (
                            <div className="flex justify-center items-center gap-2">
                                <div className="loader border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                                Cadastrando...
                            </div>
                        ) : (
                            "Cadastrar"
                        )}
                    </button>

                    {/* Link para login */}
                    <p className="mt-6 text-sm text-center text-gray-600">
                        Já tem uma conta?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Faça login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default CadastroUsuario;