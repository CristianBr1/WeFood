# WeFood

Sistema completo de gerenciamento de restaurantes e delivery de alimentos, desenvolvido com arquitetura em três camadas: interface administrativa, aplicação cliente e API backend.

## Documentação e Diagramas

A pasta `Diagramas/` na raiz do projeto contém toda a documentação técnica do sistema:

- **Diagrama Entidade-Relacionamento (DER)**: Modelagem completa do banco de dados
- **Diagramas de Classes**: Estrutura das entidades e relacionamentos 
- **Diagramas de Caso de Uso**: Como atores irão atuar no sistema
- **Documentação Técnica**: Especificações e decisões de design

## Visão Geral

WeFood é uma plataforma de delivery que conecta restaurantes e clientes através de uma interface moderna e intuitiva. O sistema oferece:

- **Painel Administrativo**: Gerenciamento completo de produtos, categorias, banners, pedidos e usuários
- **Aplicação Cliente**: Interface para navegação, busca de produtos, carrinho de compras e finalização de pedidos
- **API Backend**: Servidor REST com autenticação, controle de acesso e persistência de dados

## Arquitetura do Projeto

```
WeFood/
├── admin/          # Painel administrativo (React)
├── client/         # Interface do cliente (React)
└── backend/        # API REST (Spring Boot)
```

### Estrutura de Pastas

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
└── src/main/java/com/PraTi/Backend/
    ├── BackendApplication.java     # Classe principal
    ├── models/                     # Entidades JPA
    │   ├── User.java               # Usuário (classe base)
    │   ├── Cliente.java            # Cliente (herda User)
    │   ├── Admin.java              # Administrador (herda User)
    │   ├── Gerente.java            # Gerente (herda User)
    │   ├── Restaurante.java        # Restaurante
    │   ├── Item.java               # Produto/Item
    │   ├── Pedido.java             # Pedido
    │   └── PedidoItem.java         # Itens do pedido
    └── repositories/               # Repositórios JPA
        ├── UserRepository.java
        ├── AdminRepository.java
        ├── RestauranteRepository.java
        └── ...
```

## Tecnologias Utilizadas

### Frontend (Admin e Client)

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| React | 19.1.1 | Biblioteca para construção de interfaces |
| React Router DOM | 7.8.2 - 7.9.4 | Roteamento de páginas |
| Vite | 7.1.2 - 7.1.7 | Build tool e dev server |
| TailwindCSS | 4.1.12 - 4.1.16 | Framework CSS utilitário |
| Material-UI | 7.3.2 - 7.3.4 | Componentes React Material Design |
| React Icons | 5.5.0 | Biblioteca de ícones |
| Swiper | 12.0.2 | Carrossel/slider (client) |
| UUID | 13.0.0 | Geração de IDs únicos (client) |
| ESLint | 9.33.0 - 9.36.0 | Linter JavaScript |

### Backend

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| Java | 21 | Linguagem de programação |
| Spring Boot | 3.5.5 | Framework Java |
| Spring Data JPA | 3.5.5 | Persistência de dados |
| Spring Security | 3.5.5 | Autenticação e autorização |
| OAuth2 Authorization Server | 3.5.5 | Servidor de autenticação |
| PostgreSQL | Latest | Banco de dados relacional |
| Maven | 3.x | Gerenciador de dependências |

### Ferramentas de Desenvolvimento

- **Node.js**: Requerido para executar o frontend
- **Java Development Kit (JDK)**: Versão 21
- **PostgreSQL**: Banco de dados
- **Git**: Controle de versão

## Pré-requisitos

Certifique-se de ter instalado:

- Node.js (versão 18 ou superior)
- Java JDK 21
- PostgreSQL (versão 12 ou superior)
- Maven 3.x (ou use o Maven Wrapper incluído)
- Git

## Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/CristianBr1/WeFood.git
cd WeFood
```

### 2. Configurar o Banco de Dados

Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE wefood;
CREATE USER wefood_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE wefood TO wefood_user;
```

### 3. Configurar o Backend

Navegue até a pasta backend:

```bash
cd backend
```

Edite o arquivo `src/main/resources/application.properties`:

```properties
spring.application.name=Backend

# Configuração do Banco de Dados
spring.datasource.url=jdbc:postgresql://localhost:5432/wefood
spring.datasource.username=wefood_user
spring.datasource.password=sua_senha

# Configuração JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Configuração do Servidor
server.port=8080
```

Instale as dependências e compile:

```bash
# Windows
mvnw.cmd clean install

# Linux/Mac
./mvnw clean install
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

## Executando a Aplicação

### Iniciar o Backend

Na pasta `backend`:

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
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

#### Backend
```bash
cd backend
mvnw.cmd test
```

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

3. **Teste de API**:
   - Use ferramentas como Postman ou Insomnia
   - Endpoints principais:
     - `GET /api/products` - Listar produtos
     - `GET /api/categories` - Listar categorias
     - `POST /api/auth/login` - Login
     - `POST /api/orders` - Criar pedido

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

## Scripts Disponíveis

### Admin e Client

```bash
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Cria build de produção
npm run preview   # Preview do build de produção
npm run lint      # Executa verificação de código
```

### Backend

```bash
mvnw.cmd spring-boot:run    # Executa a aplicação
mvnw.cmd clean install      # Compila e instala dependências
mvnw.cmd test               # Executa testes
mvnw.cmd clean package      # Gera arquivo JAR
```

## Funcionalidades Principais

### Painel Administrativo
- Dashboard com métricas e estatísticas
- CRUD completo de produtos e categorias
- Gerenciamento de banners promocionais
- Controle de pedidos e status
- Gerenciamento de usuários e permissões
- Upload de imagens e logotipos

### Interface do Cliente
- Navegação por categorias
- Busca de produtos
- Carrossel de banners promocionais
- Carrinho de compras persistente
- Sistema de autenticação (login/registro)
- Perfil do usuário
- Finalização de pedidos
- Tema claro/escuro

### API Backend
- Autenticação JWT e OAuth2
- Controle de acesso baseado em roles
- CRUD de entidades
- Relacionamentos JPA complexos
- Herança de entidades (User → Cliente/Admin/Gerente)
- Validações e tratamento de erros

## Build para Produção

### Frontend (Admin e Client)

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/` e podem ser servidos por qualquer servidor web (Nginx, Apache, etc.).

### Backend

```bash
mvnw.cmd clean package
```

O arquivo JAR será gerado em `target/Backend-0.0.1-SNAPSHOT.jar` e pode ser executado com:

```bash
java -jar target/Backend-0.0.1-SNAPSHOT.jar
```

## Variáveis de Ambiente

Para produção, configure as seguintes variáveis:

### Backend
```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://seu-host:5432/wefood
SPRING_DATASOURCE_USERNAME=usuario
SPRING_DATASOURCE_PASSWORD=senha
SERVER_PORT=8080
JWT_SECRET=sua_chave_secreta
```

### Frontend
Configure os endpoints da API nos arquivos de serviço em `src/services/`.

## Solução de Problemas

### Erro de conexão com banco de dados
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais em `application.properties`
- Verifique se o banco de dados foi criado

### Porta já em uso
- Backend: Altere `server.port` em `application.properties`
- Frontend: O Vite sugerirá automaticamente outra porta

### Dependências não instaladas
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
mvnw.cmd clean install -U
```

## Licença

Este projeto é de propriedade privada. Todos os direitos reservados.
