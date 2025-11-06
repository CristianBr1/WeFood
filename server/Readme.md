# WEFood Server

## Visão Geral

O backend do WEFood é construído com **Node.js**, **Express** e **MongoDB**, fornecendo APIs REST para o cliente e o painel de administração. Ele gerencia autenticação, produtos, categorias, banners, pedidos e endereços.

---

## Estrutura do Projeto

server/
│
├─ controllers/ # Lógica dos endpoints
├─ models/ # Schemas do Mongoose
├─ routes/ # Rotas da API
├─ middlewares/ # Middlewares (autenticação, erros, logs)
├─ services/ # Serviços auxiliares (pagamento, email, etc.)
├─ utils/ # Funções utilitárias
├─ config/ # Configurações do banco e variáveis de ambiente
├─ app.js # Configuração principal do Express
└─ server.js # Inicialização do servidor


---

## Funcionalidades Principais

### Usuários
- Registro e login (JWT)
- Controle de permissões (Admin / Usuário)
- Proteção de rotas via middleware

### Produtos
- CRUD de produtos
- Gestão de extras e variações
- Upload de imagens

### Categorias e Banners
- CRUD de categorias
- CRUD de banners promocionais

### Pedidos
- Criação de pedidos com cálculo de taxas
- Status de pagamento e entrega
- Histórico de pedidos para clientes e painel Admin

### Endereços
- Adicionar, editar e deletar endereços
- Seleção de endereço padrão

### Administração
- Rotas protegidas para o painel admin
- Gerenciamento completo de produtos, categorias, banners e pedidos

---

## Stack Tecnológica

- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticação
- Dotenv para variáveis de ambiente
- UUID para identificação de pedidos
- Bcrypt para criptografia de senhas

---

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor em modo desenvolvimento
npm run dev

# Executar testes
npm test

# Build (se aplicável)
npm run build


# Crie um arquivo .env com:

PORT=8000
MONGO_URI=mongodb://localhost:27017/wefood
JWT_SECRET=sua_chave_secreta

# variáveis para deploy:
FRONTEND_CLIENT=https://wefood-client.vercel.app
FRONTEND_ADMIN=https://wefood-admin.vercel.app