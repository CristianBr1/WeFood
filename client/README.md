# WEFood Client

## Visão Geral da Arquitetura

### Camada de Serviços
O aplicativo utiliza uma arquitetura baseada em serviços para gerenciar a comunicação com a API:
- `services/endpoints/` - Contém módulos de serviço para domínios específicos (carrinho, endereço, autenticação, etc.)
- `services/api.js` - Configuração base da API e interceptores
- `services/apiService.js` - Wrappers genéricos para métodos HTTP

### Contextos e Hooks
O gerenciamento de estado é feito através do React Context e hooks personalizados:

#### Contextos:
- `AuthContext` - Estado e métodos de autenticação do usuário
- `CartContext` - Estado e operações do carrinho de compras
- `AddressContext` - Gerenciamento e seleção de endereços
- `ThemeContext` - Preferências de tema claro/escuro
- `SearchContext` - Estado da funcionalidade de busca

#### Hooks Personalizados:
- `useAddress` - Gerenciamento e seleção da lista de endereços
- `useCart` - Operações e estado do carrinho
- `useProducts` - Busca e cache de produtos
- `useCategories` - Gerenciamento de categorias
- `useAuth` - Estado e métodos de autenticação

### Proteção de Rotas
As rotas protegidas são implementadas de duas formas:
1. Componente `ProtectedRoute` - Proteção a nível de rota

### Funcionalidades
- Suporte a tema claro/escuro
- Atualizações otimistas para operações de carrinho/endereço
- Refresh silencioso para evitar flashes na UI
- Estados de carregamento e spinners
- Tratamento de erros e feedback para o usuário
- Guardas de rota do lado do cliente

### Stack Tecnológica
- React + Vite
- Componentes MUI
- React Router v6
- Context API para gerenciamento de estado
- Jest + Testing Library

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

VITE_API_BASE=http://localhost:8000
VITE_API_URL=http://localhost:8000/api
