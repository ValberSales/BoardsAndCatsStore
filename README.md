# 🎲 Boards and Cats 🐈

Bem-vindo ao **Boards and Cats**, uma plataforma de e-commerce completa para venda de jogos de tabuleiro, desenvolvida como projeto final para a disciplina de Programação para Web.

## 📝 Sobre o Projeto

Este repositório contém o código-fonte tanto do **backend** (API RESTful) quanto do **frontend** de uma loja online fictícia. O objetivo é aplicar os conceitos de desenvolvimento full-stack, criando um sistema seguro e funcional, desde o banco de dados até a interface do usuário.

### ✨ Funcionalidades Principais (Backend)

  * **Autenticação e Autorização:** Sistema seguro de login e registro de usuários utilizando JSON Web Tokens (JWT).
  * **Gerenciamento de Produtos:** API CRUD produtos e categorias.
  * **Gestão de Perfil de Usuário:** Endpoints seguros para que os usuários possam gerenciar seus próprios dados, endereços e métodos de pagamento.
  * **Ciclo de Vida de Pedidos:** Lógica de negócio completa para criar, visualizar, cancelar e alterar o status de pedidos.
  * **Controle de Estoque:** O estoque dos produtos é decrementado na compra e restaurado no cancelamento de um pedido.
  * **Integridade Histórica:** Os dados de pedidos (endereço, preço, etc.) são "congelados" no momento da compra para garantir a integridade do histórico, mesmo que os dados originais sejam alterados ou excluídos.

## 💻 Tecnologias Utilizadas

Este projeto foi construído com um conjunto de tecnologias, separadas entre o backend e o frontend.

### Backend (Implementado)

  * **Java 24**: Linguagem de programação principal.
  * **Spring Boot 3+**: Framework principal para a construção da API REST.
  * **Spring Security**: Para a camada de autenticação e autorização baseada em JWT.
  * **Spring Data JPA & Hibernate**: Para a camada de persistência de dados e comunicação com o banco.
  * **H2 Database**: Banco de dados em memória utilizado para o ambiente de desenvolvimento e testes.
  * **Maven**: Gerenciador de dependências e build do projeto.
  * **Lombok**: Para reduzir código boilerplate em classes de modelo e DTOs.
  * **ModelMapper**: Biblioteca para o mapeamento automático entre objetos DTO e Entidades.
  * **Auth0 Java JWT**: Biblioteca para a criação e validação dos tokens JWT.

### Frontend (Planejado)

  * **React**: Biblioteca para a construção da interface de usuário.
  * **TypeScript**: Superset do JavaScript que adiciona tipagem estática ao código.
  * **Vite**: Ferramenta de build para um ambiente de desenvolvimento rápido.
  * **Axios**: Cliente HTTP para a comunicação com a API do backend.
  * **React Router**: Para o gerenciamento de rotas na aplicação.

## 🚀 Como Executar o Projeto

Siga os passos abaixo para executar a aplicação localmente.

### Pré-requisitos

  * Java JDK 24 ou superior
  * Maven 3.8+
  * Node.js 18+ e npm

### Backend

```bash
# 1. Clone o repositório
git clone <url-do-seu-repositorio>

# 2. Navegue até a pasta do servidor
cd server

# 3. Execute a aplicação Spring Boot
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`. O banco de dados H2 será populado com os dados do arquivo `src/main/resources/data.sql`.

### Frontend

```bash
# 1. Em outro terminal, navegue até a pasta do cliente
cd client # ou 'frontend'

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação frontend estará disponível em `http://localhost:5173` (ou a porta indicada pelo Vite).
