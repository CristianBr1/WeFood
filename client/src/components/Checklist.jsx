import React from "react";
import { CheckCircle2, Clock } from "lucide-react";
import Navbar from "./Navbar";

const Progress = ({ value }) => (
  <div className="w-full h-3 bg-gray-300/40 rounded-full mt-3 overflow-hidden">
    <div
      className="h-3 bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

export default function Checklist() {
  const checklist = [
    /* ============================
        🧠 Backend
  ============================ */
    {
      title: "🧠 Backend (API Node + MongoDB)",
      items: [
        { text: "Configurar conexão MongoDB com Mongoose", done: true },
        {
          text: "Modelos: User, Product, Category, Order, Address",
          done: true,
        },
        { text: "Autenticação JWT e middleware de admin", done: true },
        { text: "Endpoints protegidos para CRUD de produtos", done: true },
        { text: "Controle de estoque e decremento automático", done: false },
        { text: "Integração com pagamentos (real)", done: true },
      ],
    },

    /* ============================
        💻 Frontend
  ============================ */
    {
      title: "💻 Frontend (Cliente)",
      items: [
        { text: "Setup com Vite + React + Tailwind", done: true },
        { text: "Tela inicial com banners e produtos", done: true },
        { text: "Sistema de login / registro com JWT", done: true },
        { text: "Sistema de login / registro com Google", done: true },
        { text: "Carrinho de compras e checkout", done: true },
        { text: "Endereços e seleção de entrega", done: true },
        { text: "Confirmação de pedido e acompanhamento", done: true },
      ],
    },

    /* ============================
        🛠️ Painel Administrativo
  ============================ */
    {
      title: "🛠️ Painel Administrativo",
      items: [
        { text: "Dashboard com pedidos recentes", done: true },
        { text: "Gerenciamento de usuários (apenas admin)", done: true },
        { text: "Gerenciamento de produtos e categorias", done: true },
        { text: "Controle de estoque (ingredientes e pratos)", done: false },
        { text: "Edição de status de pedido e pagamento", done: true },
        { text: "Checklist do progresso do projeto", done: true },
      ],
    },

    /* ============================
        ⚡ Performance
  ============================ */
    {
      title: "⚡ Performance",
      items: [
        {
          text: "Paginação nas listagens (produtos, pedidos, usuários)",
          done: false,
        },
        { text: "Implementar lazy loading de imagens", done: false },
        {
          text: "Adicionar cache de requisições (React Query, SWR ou manual)",
          done: false,
        },
      ],
    },

    /* ============================
        🔐 Segurança
  ============================ */
    {
      title: "🛡️ Segurança",
      items: [
        {
          text: "Migrar tokens para HttpOnly cookies (remover token do localStorage)",
          done: true,
        },
        { text: "Implementar proteção contra CSRF", done: false },
        {
          text: "Adicionar rate limiting no backend (evitar brute force)",
          done: false,
        },
        { text: "Forçar HTTPS em produção", done: false },
      ],
    },

    /* ============================
        ♿ Acessibilidade
  ============================ */
    {
      title: "♿ Acessibilidade (A11y)",
      items: [
        { text: "Adicionar labels ARIA nas interações", done: false },
        { text: "Melhorar navegação por teclado (focus states)", done: false },
        { text: "Compatibilidade com leitores de tela", done: false },
      ],
    },

    /* ============================
        🧪 Testes
  ============================ */
    {
      title: "🧪 Testes",
      items: [
        { text: "Criar testes unitários", done: false },
        { text: "Criar testes de integração", done: false },
        { text: "Criar testes E2E (Cypress ou Playwright)", done: false },
      ],
    },

    /* ============================
        📘 TypeScript
  ============================ */
    {
      title: "📘 TypeScript",
      items: [
        { text: "Migrar projeto de JavaScript para TypeScript", done: false },
        { text: "Criar tipos para entidades", done: false },
        { text: "Adicionar ESLint + TS + Prettier", done: false },
      ],
    },

    /* ============================
        🖼️ Otimização de Imagens
  ============================ */
    {
      title: "🖼️ Otimização de Imagens",
      items: [
        { text: "Implementar lazy loading", done: false },
        { text: "Usar formatos modernos (WebP, AVIF)", done: false },
        { text: "Responsive images para mobile", done: false },
      ],
    },

    /* ============================
        📚 Documentação
  ============================ */
    {
      title: "📚 Documentação",
      items: [
        { text: "Criar Storybook para componentes", done: false },
        { text: "Documentar API com Swagger", done: false },
        { text: "Adicionar JSDoc nas funções principais", done: false },
      ],
    },

    /* ============================
        🚀 CI / CD
  ============================ */
    {
      title: "🚀 CI / CD",
      items: [
        { text: "Configurar GitHub Actions", done: false },
        { text: "Testes automáticos no pipeline", done: false },
        { text: "Deploy automático (Vercel / Render / PM2)", done: true },
      ],
    },

    /* ============================
        📈 Monitoramento
  ============================ */
    {
      title: "📈 Monitoramento",
      items: [
        { text: "Integrar Sentry para erros", done: false },
        { text: "Adicionar Google Analytics", done: false },
        { text: "Criar logs estruturados no backend", done: false },
      ],
    },
  ];
  const totalTasks = checklist.reduce((acc, s) => acc + s.items.length, 0);
  const doneTasks = checklist.reduce(
    (acc, s) => acc + s.items.filter((i) => i.done).length,
    0
  );
  const progress = Math.round((doneTasks / totalTasks) * 100);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4 mt-20!">
        <div className="w-full max-w-3xl">
          <h1 className="text-4xl font-bold text-center text-gray-900 drop-shadow-sm">
            📋 Checklist do Projeto WeFood
          </h1>

          <p className="text-center text-gray-600 text-lg mb-6!">
            Acompanhe o progresso geral do desenvolvimento 🍽️
          </p>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6! mb-6!">
            <p className="text-gray-700 text-lg font-medium">Progresso Geral:</p>
            <Progress value={progress} />
            <p className="mt-2! text-sm text-gray-500 text-right">
              {doneTasks} de {totalTasks} tarefas concluídas ({progress}%)
            </p>

            {/* Lista única com seções */}
            <div className="mt-6! space-y-4!">
              {checklist.map((section, i) => (
                <div key={i}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2!">
                    {section.title}
                  </h2>
                  <ul className="space-y-2!">
                    {section.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-center space-x-3! p-2! bg-gray-50 rounded-md"
                      >
                        {item.done ? (
                          <CheckCircle2 className="text-green-500" size={20} />
                        ) : (
                          <Clock className="text-gray-400" size={20} />
                        )}
                        <span
                          className={`${
                            item.done ? "line-through  text-gray-400" : "text-gray-700"
                          }`}
                        >
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
