import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, IdCard } from "lucide-react";

const CadastroUsuario = () => {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [telefone, setTelefone] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validarEmail = (email) => email.includes("@");
    const validarTelefone = (tel) => {
        const digitos = tel.replace(/\D/g, "");
        return digitos.length === 10 || digitos.length === 11;
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        if (!validarEmail(email)) {
            setMsg("E-mail inválido. Deve conter '@'.");
            setLoading(false);
            return;
        }

        if (!validarTelefone(telefone)) {
            setMsg("Telefone inválido. Deve conter 10 ou 11 dígitos.");
            setLoading(false);
            return;
        }

        if (senha !== confirmaSenha) {
            setMsg("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        const payload = {
            nome,
            cpf: cpf.replace(/\D/g, ""),
            senha,
            confirma_senha: confirmaSenha,
            tipo: "usuario",
            email,
            telefone: telefone.replace(/\D/g, ""),
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

                    {/* Campo Nome */}
                    <div className="relative mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Seu nome completo"
                                className="w-full focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Campo CPF */}
                    <div className="relative mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                            <IdCard className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="text"
                                value={cpf}
                                onChange={(e) => setCpf(formatCPF(e.target.value))}
                                placeholder="000.000.000-00"
                                className="w-full focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Campo Email */}
                    <div className="relative mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemplo@email.com"
                                className="w-full focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Campo Telefone */}
                    <div className="relative mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="tel"
                                value={telefone}
                                onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                                placeholder="(00) 00000-0000"
                                className="w-full focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Campo Senha */}
                    <div className="relative mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                            <Lock className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Senha"
                                className="w-full focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Campo Confirmar Senha */}
                    <div className="relative mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                            <Lock className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="password"
                                value={confirmaSenha}
                                onChange={(e) => setConfirmaSenha(e.target.value)}
                                placeholder="Confirme sua senha"
                                className="w-full focus:outline-none"
                                required
                            />
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
