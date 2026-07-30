# 🚗 Sistema Frota Energia

O site oficial está hospedado na Vercel e acessível de qualquer lugar. Porém, os arquivos PDF (CRLV-e) ficam hospedados localmente em uma Máquina Virtual (MV) por questões de espaço e praticidade.

Aqui está o guia definitivo de como configurar e manter a MV rodando.

---

## 🛠️ Passo 1: Preparar a Máquina Virtual (MV)

Antes de rodar o projeto, a MV precisa de 3 programas básicos:

1. **Node.js:** Acesse [nodejs.org](https://nodejs.org) e instale a versão recomendada (LTS).
2. **Git:** Acesse [git-scm.com](https://git-scm.com) e instale.
3. **Ngrok:** 
   - Acesse [ngrok.com](https://ngrok.com), crie uma conta grátis e baixe a versão para Windows.
   - Extraia o arquivo `ngrok.exe` e coloque-o dentro da pasta do projeto ou instale globalmente.
   - Abra o terminal e valide sua conta com o comando que o site fornece: `ngrok config add-authtoken SEU_TOKEN_AQUI`

---

## 📂 Passo 2: Baixar o Projeto na MV

1. Abra o terminal (ou CMD) na MV e baixe o código fonte:
   ```bash
   git clone https://github.com/thiagovsmeireles/frota-energia.git
   ```
2. Entre na pasta do projeto:
   ```bash
   cd frota-energia
   ```
3. **MUITO IMPORTANTE:** Copie a sua pasta **`backend`** (aquela que tem todos os PDFs de 2025 e 2026) e cole ela **dentro** da pasta `frota-energia` recém baixada.

---

## 🚀 Passo 3: Colocar os PDFs na Internet (O Dia a Dia)

Toda vez que a MV reiniciar, ou se você quiser atualizar os PDFs, siga este ritual:

1. Dê dois cliques no arquivo **`iniciar-servidor.bat`**. 
   - Ele vai abrir uma janela servindo a pasta (porta 8080).
   - Ele vai abrir outra janela do Ngrok criando um link seguro.
2. Copie o link do Ngrok (ex: `https://1234-abcd.ngrok-free.app`).
3. Abra o arquivo **`generate_frota.js`** em um bloco de notas ou VS Code e substitua a URL antiga pela nova na linha que diz `const BASE_URL = ...`.
4. No terminal, rode o gerador para atualizar o banco de dados:
   ```bash
   node generate_frota.js
   ```

---

## 🔄 Passo 4: Atualizar o Site Oficial

Como o site oficial (Vercel) precisa saber o novo link do Ngrok, você deve enviar essa atualização para o GitHub:

1. No terminal da MV, digite:
   ```bash
   git add .
   git commit -m "atualizado link ngrok"
   git push
   ```

**Pronto!** Em 1 minuto a Vercel vai baixar essa atualização automaticamente e o site `https://frota-energia.vercel.app/` voltará a abrir os PDFs usando a internet da sua MV.
