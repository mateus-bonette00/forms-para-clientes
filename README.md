# 🚀 Formulário & Coleta de Briefing para Clientes (Alta Resolução)

Plataforma completa para agências e desenvolvedores receberem informações, textos institucionais e fotos de clientes em **qualidade máxima original**, sem a compressão destrutiva do WhatsApp.

Construído com **React (Vite) + Tailwind CSS**, **Node.js Express (Serverless)** e **PostgreSQL (Prisma ORM)**, pronto para ser hospedado na **Vercel**.

---

## ✨ Funcionalidades Principais

- **📸 Fotos em Alta Resolução (Sem Compressão):**
  - Permite aos clientes enviarem fotos pesadas de produtos, equipe, espaço e serviços mantendo 100% da resolução original.
  - Upload de logotipo em vetor/PNG com transparência.
  - Identificação de categorias e legendas para cada imagem.

- **📝 Formulário Completo & Flexível:**
  - 6 etapas intuitivas com barra de progresso (Contato, Marca, Institucional, Serviços, Fotos HD e Referências).
  - Campos não obrigatórios para não travar o cliente.
  - Design moderno, fluido e adaptado para celular e computador.

- **🔒 Painel do Desenvolvedor (Área Administrativa):**
  - Login seguro via JWT.
  - Listagem com busca e filtros por status (*Novo*, *Em Análise*, *Em Andamento*, *Concluído*).
  - **Copiar com 1 Clique:** Botões para copiar qualquer texto diretamente para a área de transferência.
  - **Exportar Resumo:** Botão para copiar todo o briefing em formato Markdown formatado para colar no Notion, Figma ou IDE.
  - **Download em Lote (.ZIP):** Botão que compacta e baixa todas as fotos originais do cliente de uma vez.
  - Link de compartilhamento direto para enviar ao cliente pelo WhatsApp.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Sonner (Notificações), JSZip & FileSaver.
- **Back-end:** Node.js, Express, TypeScript, JWT, CORS.
- **Banco de Dados:** PostgreSQL gerenciado com Prisma ORM.
- **Hospedagem:** Vercel (SPA + API Serverless integrados via `vercel.json`).

---

## 💻 Como Rodar Localmente

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```
Preencha a sua conexão do PostgreSQL:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/forms_clientes"
ADMIN_USER="admin"
ADMIN_PASSWORD="sua_senha_secreta"
```

### 3. Sincronizar o Banco de Dados
```bash
npx prisma db push
```

### 4. Iniciar o Projeto (Frontend + Backend simultâneos)
```bash
npm run dev
```

- **Formulário do Cliente:** `http://localhost:3000/#/`
- **Painel do Desenvolvedor:** `http://localhost:3000/#/admin/login`
- **API Backend:** `http://localhost:3001/api/health`

---

## ☁️ Como Hospedar na Vercel

1. **Crie um Banco PostgreSQL Gratuito:**
   - Crie uma conta no [Supabase](https://supabase.com) ou [Neon](https://neon.tech).
   - Copie a `DATABASE_URL` do seu banco PostgreSQL.

2. **Execute a migração inicial no banco:**
   ```bash
   npx prisma db push
   ```

3. **Deploy na Vercel:**
   - Suba o código para o seu GitHub.
   - Importe o repositório na [Vercel](https://vercel.com).
   - Em **Environment Variables**, adicione:
     - `DATABASE_URL`: URL de conexão do seu PostgreSQL.
     - `ADMIN_USER`: `admin` (ou seu usuário preferido).
     - `ADMIN_PASSWORD`: `sua_senha_forte`.
     - `JWT_SECRET`: uma chave aleatória e segura.
     - *(Opcional)* `CLOUDINARY_CLOUD_NAME` e `CLOUDINARY_UPLOAD_PRESET` caso queira armazenamento direto no Cloudinary.
   - Clique em **Deploy**. A Vercel executará o build do React e das funções serverless automaticamente!

---

## 🔑 Credenciais Padrão do Painel

- **Usuário:** `admin`
- **Senha:** `admin123` *(Altere no `.env` para produção)*

