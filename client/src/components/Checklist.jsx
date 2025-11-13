import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, Clock } from "lucide-react";
import Navbar from "./Navbar";

/* ======================
   Componentes internos estilizados
====================== */
const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all hover:shadow-xl">
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div className="mt-4 text-gray-700">{children}</div>
);

const Progress = ({ value }) => (
  <div className="w-full h-3 bg-gray-300/40 rounded-full mt-3 overflow-hidden">
    <div
      className="h-3 bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

export default function Checklist() {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

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
        { text: "Integração com pagamentos (real)", done: false },
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

  // Calcular progresso
  const totalTasks = checklist.reduce((acc, s) => acc + s.items.length, 0);
  const doneTasks = checklist.reduce(
    (acc, s) => acc + s.items.filter((i) => i.done).length,
    0
  );
  const progress = Math.round((doneTasks / totalTasks) * 100);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 mt-20! px-4">
        <div className="w-full max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold text-center text-gray-900 drop-shadow-sm">
            📋 Checklist do Projeto WeFood
          </h1>

          <p className="text-center text-gray-600 text-lg">
            Acompanhe o progresso geral do desenvolvimento 🍽️
          </p>

          <Card>
            <p className="text-gray-700 text-lg font-medium">
              Progresso Geral:
            </p>
            <Progress value={progress} />
            <p className="mt-2 text-sm text-gray-500 text-right">
              {doneTasks} de {totalTasks} tarefas concluídas ({progress}%)
            </p>
          </Card>

          {checklist.map((section, index) => (
            <Card key={index}>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection(index)}
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {section.title}
                </h2>

                {openSections[index] ? (
                  <ChevronUp className="text-gray-600" />
                ) : (
                  <ChevronDown className="text-gray-600" />
                )}
              </div>

              {openSections[index] && (
                <CardContent>
                  <ul className="space-y-3 mt-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        {item.done ? (
                          <CheckCircle2
                            className="text-green-500 drop-shadow-sm"
                            size={20}
                          />
                        ) : (
                          <Clock className="text-gray-400" size={20} />
                        )}

                        <span
                          className={`text-base ${
                            item.done
                              ? "line-through text-gray-400"
                              : "text-gray-700"
                          }`}
                        >
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
