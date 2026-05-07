# ⚙️ Oficina de Integração 2 — Sistema de Controle de Voluntários

O **Sistema de Controle de Voluntários (ELLP)** foi desenvolvido para auxiliar na gestão de voluntários do projeto **ELLP (Ensino de Lógica e Linguagem de Programação)**, uma iniciativa formada por estudantes da Universidade Tecnológica Federal do Paraná (UTFPR), com foco em levar conhecimentos de lógica e programação para jovens do ensino público da região de Cornélio Procópio.

O sistema tem como objetivo facilitar o gerenciamento de voluntários, oficinas e documentação, automatizando processos administrativos e melhorando a organização das atividades do projeto.

# 📋 Requisitos Funcionais do Sistema

O sistema foi planejado para atender às necessidades administrativas do projeto ELLP, automatizando processos relacionados ao gerenciamento dos voluntários e da documentação do projeto.

Abaixo estão os principais requisitos funcionais definidos para a aplicação:

| ID | Funcionalidade | Prioridade |
|---|---|---|
| RF01 | Cadastrar voluntários com dados pessoais e acadêmicos | Alta |
| RF02 | Editar informações cadastrais dos voluntários | Alta |
| RF03 | Registrar data de entrada e saída do voluntário | Alta |
| RF04 | Pesquisar voluntários por nome, CPF ou status | Média |
| RF05 | Visualizar perfil completo do voluntário | Média |
| RF06 | Inativar automaticamente voluntários com data de saída expirada | Baixa |
| RF07 | Registrar vínculo do voluntário com oficinas | Alta |
| RF08 | Gerar automaticamente o Termo de Adesão em PDF | Alta |
| RF09 | Registrar aceite do termo pelo voluntário | Média |
| RF10 | Permitir reemissão de termos atualizados | Baixa |
| RF11 | Realizar upload do termo assinado | Média |
| RF12 | Realizar autenticação com login e senha | Alta |
| RF13 | Diferenciar permissões entre administrador e voluntário | Média |
| RF14 | Permitir que o voluntário visualize seus próprios dados | Baixa |

---

# 📐 Arquitetura do Projeto e Tecnologias

O sistema foi estruturado utilizando as seguintes tecnologias:

## Front-End

- React
- Next.js
- TypeScript
- Tailwind CSS

A camada de interface é responsável pela experiência do usuário, validações dos formulários e comunicação com as APIs do sistema.

---

## Back-End

- API Routes do Next.js
- Node.js
- TypeScript

Responsável pelo processamento das regras de negócio, autenticação e geração dos documentos PDF.

---

## Banco de Dados e Serviços

### Firebase Authentication

Gerenciamento de login, autenticação e controle de sessão dos usuários.

### Cloud Firestore

Banco de dados NoSQL responsável pelo armazenamento de:

- Voluntários
- Oficinas
- Registros de vínculo
- Informações do sistema

### Firebase Storage

Responsável pelo armazenamento de:

- PDFs gerados
- Termos assinados
- Uploads de documentos

---

## Geração de Documentos

- jsPDF

Biblioteca utilizada para geração automática dos Termos de Adesão em PDF.

---

# 🏗️ Arquitetura do Projeto

O fluxo da aplicação ocorre da seguinte forma:

1. O usuário acessa o sistema pela interface web.
2. A aplicação Next.js realiza validações e envia requisições para as APIs.
3. As API Routes processam as regras de negócio.
4. O Firebase realiza autenticação, armazenamento ou leitura dos dados.
5. O resultado retorna para a aplicação.
6. A interface apresenta a resposta ao usuário.

![Diagrama de Arquitetura](img_readme/Diagrama%20de%20arquitetura.jpg)

---

# 🧪 Estratégia de Automação de Testes

Para garantir a qualidade e confiabilidade do sistema, foi definida uma estratégia de testes automatizados em diferentes níveis da aplicação.

## Testes Unitários

Utilização do **Jest** para validação de funções isoladas, incluindo:

- Validação de CPF
- Regras de negócio
- Processamento de dados

---

## Testes de Integração

Testes responsáveis por validar a comunicação entre:

- Front-end
- Firebase Authentication
- Firestore
- Firebase Storage

---

## Testes End-to-End (E2E)

Utilização do **Cypress** para simular fluxos reais do sistema, como:

- Login
- Cadastro de voluntários
- Upload de documentos
- Geração de PDFs

---

## 🔄 Gerenciamento e Versionamento do Projeto

O desenvolvimento do sistema segue a metodologia ágil **Scrum**, utilizando o **Trello** como ferramenta de organização das tarefas através de quadros Kanban, permitindo o acompanhamento do progresso, divisão das atividades e gerenciamento da equipe.

Para controle de versão e colaboração no desenvolvimento, são utilizados:

- Git
- GitHub
- Trello
