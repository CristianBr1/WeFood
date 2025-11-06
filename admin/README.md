# WEFood Admin

## Visão Geral da Arquitetura

### Camada de Serviços
O painel de administração utiliza uma arquitetura baseada em serviços para gerenciar a comunicação com a API:

- `services/endpoints/` - Contém módulos de serviço para domínios específicos (pedidos, produtos, categorias, banners, usuários, etc.)
- `services/api.js` - Configuração base da API e interceptores
- `services/apiService.js` - Wrappers genéricos para métodos HTTP

### Contextos e Hooks
O gerenciamento de estado é feito através do React Context e hooks personalizados:

#### Contextos:
- `AuthContext` - Estado e métodos de autenticação do admin
- `ThemeContext` - Preferências de tema claro/escuro
- `SearchContext` - Estado da funcionalidade de busca e filtros

#### Hooks Personalizados:
- `useProducts` - Busca, criação, atualização e deleção de produtos
- `useCategories` - Gerenciamento de categorias
- `useBanners` - Gerenciamento de banners promocionais
- `useOrders` - Acompanhamento e atualização de pedidos
- `useAuth` - Estado e métodos de autenticação do admin

### Proteção de Rotas
As rotas protegidas para o painel de administração são implementadas de duas formas:
1. Componente `ProtectedRoute` - Proteção a nível de rota

### Funcionalidades do Admin
- Painel de pedidos com status de pagamento e entrega
- Gestão de produtos, categorias e banners
- Criação, edição e remoção de itens do cardápio
- Suporte a tema claro/escuro
- Feedback visual para operações (loading, sucesso, erro)
- Filtros e busca avançada

### Stack Tecnológica
- React + Vite
- Componentes MUI
- React Router v6
- Context API para gerenciamento de estado

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Executar testes
npm test

# Build para produção
npm run build

# Crie um arquivo .env com:

VITE_API_URL=http://localhost:8000/api