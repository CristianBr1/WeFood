# 🥡 WeFood

Sistema completo de gerenciamento de restaurantes e delivery de alimentos, desenvolvido com arquitetura em três camadas: **painel administrativo**, **aplicação cliente** e **API backend em Node.js + MongoDB**.

---

## 🌐 Links de Produção

| Módulo | Link Online |
|--------|--------------|
| 🧑‍💼 Painel Administrativo | [https://wefood-two.vercel.app](https://wefood-two.vercel.app) |
| 🍔 Aplicação Cliente | [https://wefood-client.vercel.app](https://we-food-green.vercel.app/) |
| ⚙️ API Backend | [https://wefood.onrender.com/api](https://wefood.onrender.com/api) |

---

## 📖 Visão Geral

WeFood é uma plataforma de delivery que conecta restaurantes e clientes através de uma interface moderna e intuitiva. O sistema oferece:

- **Painel Administrativo**: Gerenciamento completo de produtos, categorias, banners, pedidos e usuários  
- **Aplicação Cliente**: Interface para navegação, busca de produtos, carrinho e checkout  
- **API Backend (Node.js)**: Servidor REST com autenticação JWT, upload de imagens e persistência em MongoDB

---

## 🧱 Arquitetura do Projeto

```
WeFood/
├── admin/ # Painel administrativo (React + MUI)
├── client/ # Interface do cliente (React + Tailwind)
└── backend/ # API REST (Node.js + Express + MongoDB)
```

### 📂 Estrutura de Pastas

**Admin** - Painel de Administração
```
admin/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   │   ├── AdminRoute.jsx      # Proteção de rotas admin
│   │   ├── Header.jsx          # Cabeçalho
│   │   └── Sidebars.jsx        # Menu lateral
│   ├── context/        # Gerenciamento de estado global
│   │   ├── AuthContext.jsx     # Contexto de autenticação
│   │   ├── AuthProvider.jsx    # Provider de autenticação
│   │   └── ThemeProvider.jsx   # Tema claro/escuro
│   ├── pages/          # Páginas da aplicação
│   │   ├── Dashboard.jsx       # Dashboard principal
│   │   ├── Products.jsx        # Listagem de produtos
│   │   ├── AddProducts.jsx     # Adicionar produtos
│   │   ├── Categories.jsx      # Gerenciar categorias
│   │   ├── Banners.jsx         # Gerenciar banners
│   │   ├── Orders.jsx          # Gerenciar pedidos
│   │   ├── Users.jsx           # Gerenciar usuários
│   │   └── Login.jsx           # Login administrativo
│   └── routes/         # Configuração de rotas
```

**Client** - Interface do Cliente
```
client/
├── src/
│   ├── components/     # Componentes da interface
│   │   ├── Navbar.jsx          # Barra de navegação
│   │   ├── HomeSlider.jsx      # Carrossel de banners
│   │   ├── HomeCategory.jsx    # Exibição de categorias
│   │   ├── ProductItem.jsx     # Card de produto
│   │   ├── ProductModal.jsx    # Modal de detalhes do produto
│   │   └── ProtectedRoute.jsx  # Proteção de rotas cliente
│   ├── pages/          # Páginas da aplicação
│   │   ├── Home.jsx            # Página inicial
│   │   ├── Menu.jsx            # Catálogo de produtos
│   │   ├── Cart.jsx            # Carrinho de compras
│   │   ├── Checkout.jsx        # Finalização do pedido
│   │   ├── Perfil.jsx          # Perfil do usuário
│   │   ├── Login.jsx           # Login
│   │   └── Register.jsx        # Cadastro
│   ├── services/       # Comunicação com API
│   └── styles/         # Arquivos CSS customizados
```

**Backend** - API REST
```
backend/
├── src/
│ ├── config/
│ │ ├── db.js # Conexão com o MongoDB
│ │ └── env.js # Variáveis de ambiente
│ ├── controllers/ # Lógica dos endpoints
│ │ ├── productController.js
│ │ ├── categoryController.js
│ │ ├── orderController.js
│ │ └── userController.js
│ ├── models/ # Schemas do Mongoose
│ │ ├── Product.js
│ │ ├── Category.js
│ │ ├── User.js
│ │ └── Order.js
│ ├── routes/ # Definição das rotas
│ │ ├── productRoutes.js
│ │ ├── categoryRoutes.js
│ │ ├── orderRoutes.js
│ │ └── authRoutes.js
│ ├── middlewares/
│ │ ├── authMiddleware.js # Autenticação JWT
│ │ └── errorHandler.js # Tratamento global de erros
│ ├── utils/
│ │ └── upload.js # Upload de imagens (multer)
│ └── server.js # Inicialização do servidor Express
├── .env.example
└── package.json
```

## 🧰 Tecnologias Utilizadas

### Frontend (Admin e Client)

| Tecnologia | Versão | Descrição |
|-------------|---------|-----------|
| React | 19.x | Biblioteca para interfaces |
| React Router DOM | 7.x | Roteamento de páginas |
| Vite | 7.x | Ferramenta de build e dev server |
| TailwindCSS | 4.x | Framework CSS utilitário |
| Material-UI | 7.x | Componentes React Material Design |
| Swiper | 12.x | Carrossel/slider (client) |
| UUID | 13.x | Geração de IDs únicos |
| ESLint | 9.x | Linter JavaScript |

### ⚙️ Backend (Node.js + MongoDB)

| Tecnologia | Versão | Descrição |
|-------------|---------|-----------|
| Node.js | 20.x | Ambiente de execução |
| Express.js | 5.x | Framework web |
| MongoDB | 7.x | Banco de dados NoSQL |
| Mongoose | 8.x | ODM para MongoDB |
| JWT | 9.x | Autenticação baseada em token |
| bcryptjs | 3.x | Criptografia de senhas |
| dotenv | 16.x | Variáveis de ambiente |
| multer | 1.x | Upload de arquivos |
| cors | 2.x | Permitir acesso entre domínios |
| nodemon | 3.x | Hot reload para desenvolvimento |

---

## 🔑 Variáveis de Ambiente (.env)

```bash
PORT=8000
MONGO_URI=mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/wefood
JWT_SECRET=sua_chave_secreta
CLIENT_URL=https://wefood-client.vercel.app
ADMIN_URL=https://wefood-two.vercel.app


## ▶️ Como Rodar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/CristianBr1/WeFood.git
cd WeFood
```

### 2. 💾 Configurar o Banco de Dados

- Crie um banco de dados MongoDB:
- Acesse https://cloud.mongodb.com
- Crie um cluster gratuito
- Adicione um usuário e configure sua senha
- Copie a string de conexão fornecida (exemplo abaixo):

```
MONGO_URI=mongodb+srv://wefood_user:sua_senha@cluster0.xxxxx.mongodb.net/wefood
```

### 3. Configurar o Backend

Navegue até a pasta backend:

```bash
cd ../server
```

Instale as dependências:

```bash
npm install
```



### 4. Configurar o Admin (Painel Administrativo)

Navegue até a pasta admin:

```bash
cd ../admin
```

Instale as dependências:

```bash
npm install
```

### 5. Configurar o Client (Interface do Cliente)

Navegue até a pasta client:

```bash
cd ../client
```

Instale as dependências:

```bash
npm install
```


O servidor estará disponível em: `http://localhost:8080`

### Iniciar o Admin

Na pasta `admin`:

```bash
npm run dev
```

O painel administrativo estará disponível em: `http://localhost:5173` (ou outra porta indicada no terminal)

### Iniciar o Client

Na pasta `client`:

```bash
npm run dev
```

A interface do cliente estará disponível em: `http://localhost:5174` (ou outra porta indicada no terminal)

## Testando a Aplicação

### Testes Manuais

#### Frontend (Admin/Client)
```bash
cd admin  # ou cd client
npm run lint    # Verificar código
npm run build   # Testar build de produção
```

### Fluxo de Teste Completo

1. **Acesso ao Admin**:
   - Acesse `http://localhost:5173/login`
   - Faça login com credenciais de administrador
   - Navegue pelas seções: Dashboard, Produtos, Categorias, Banners, Pedidos, Usuários

2. **Acesso ao Client**:
   - Acesse `http://localhost:5174`
   - Registre um novo usuário
   - Navegue pelo catálogo de produtos
   - Adicione produtos ao carrinho
   - Finalize um pedido
  
💾 **Banco de Dados (MongoDB)**:

   ### Coleções principais:
   - users → administradores e clientes
   - products → itens do cardápio
   - categories → tipos de produtos
   - orders → pedidos e status
   - banners → imagens promocionais

3. **Teste de API**:
   - Use ferramentas como Postman, Insomnia ou MongoDB compass
   - 📡 Endpoints Principais:
     
| Método   | Rota                  | Descrição                |
| -------- | --------------------- | ------------------------ |
| `POST`   | `/api/auth/register`  | Cadastrar novo usuário   |
| `POST`   | `/api/auth/login`     | Login e geração de token |
| `GET`    | `/api/categories`     | Listar categorias        |
| `POST`   | `/api/categories`     | Criar categoria          |
| `PUT`    | `/api/categories/:id` | Atualizar categoria      |
| `DELETE` | `/api/categories/:id` | Excluir categoria        |
| `GET`    | `/api/products`       | Listar produtos          |
| `POST`   | `/api/products`       | Criar produto            |
| `PUT`    | `/api/products/:id`   | Atualizar produto        |
| `DELETE` | `/api/products/:id`   | Excluir produto          |
| `GET`    | `/api/orders`         | Listar pedidos           |
| `POST`   | `/api/orders`         | Criar pedido             |


**📊 Painel Administrativo**
- Dashboard com métricas e estatísticas
- CRUD de produtos, categorias e banners 
- Gerenciamento de pedidos e usuários
- Upload de imagens
- Controle de permissões

## Estrutura de Dados

### Modelo de Entidades

**User (Usuário Base)**
- Hierarquia: User → Cliente/Admin/Gerente
- Autenticação: Local e OAuth2 (AuthProvider)
- Campos: id, email, password, name, authProvider

**Restaurante**
- Relacionamento: 1 Gerente → 1 Restaurante
- Relacionamento: 1 Restaurante → N Itens
- Campos: id, nome, cnpj

**Item (Produto)**
- Relacionamento: N Itens → 1 Restaurante
- Campos: id, nome, preco

**Pedido**
- Relacionamento: N Pedidos → 1 Cliente
- Relacionamento: 1 Pedido → N PedidoItens
- Campos: id, dataHora, valorTotal, status

**PedidoItem**
- Relacionamento: N PedidoItens → 1 Pedido
- Relacionamento: N PedidoItens → 1 Item
- Campos: quantidade, precoUnitario

## Funcionalidades Principais

### 📊 Painel Administrativo
- Dashboard com métricas e estatísticas
- CRUD completo de produtos e categorias
- Gerenciamento de banners promocionais
- Controle de pedidos e status
- Gerenciamento de usuários e permissões
- Upload de imagens e logotipos

🛍️ ### Aplicação Cliente
- Navegação por categorias
- Busca de produtos
- Carrossel de banners promocionais
- Carrinho de compras persistente
- Sistema de autenticação (login/registro)
- Perfil do usuário
- Finalização de pedidos
- Tema claro/escuro

🧠 ### API Backend

- Autenticação JWT segura com expiração de token
- Controle de acesso baseado em roles (usuário comum / admin)
- CRUD completo para categorias, produtos, usuários e pedidos
- Relacionamentos MongoDB (via Mongoose populate)
- Upload de imagens com multer (armazenamento local ou remoto)
- Validações de entrada e tratamento centralizado de erros
- Estrutura modular com separação clara de controllers, models e routes
- Conexão automática com MongoDB Atlas
- Endpoints RESTful com respostas padronizadas
- Compatível com o cliente e painel admin WeFood (React + Vite)

🖼️ ### Upload de Imagens:

- As imagens são enviadas via multipart/form-data
- Armazenadas localmente em backend/uploads
- Servidas automaticamente em /uploads/<nome-do-arquivo>

👤 Usuários e Roles:

| Tipo                   | Permissões                                 |
| ---------------------- | ------------------------------------------ |
| **Usuário comum**      | Criar pedidos, editar perfil, ver produtos |
| **Admin**              | Gerenciar categorias, produtos e pedidos   |
| **Gerente (opcional)** | Controle total + relatórios futuros        |

🧩### Deploy:

| Serviço           | Função                            |
| ----------------- | --------------------------------- |
| **Vercel**        | Hospeda o painel admin e o client |
| **Render**        | Hospeda a API Node.js             |
| **MongoDB Atlas** | Banco de dados em nuvem           |

