# 🗓️ Configuração do Google Calendar API

Para usar a integração completa com o Google Calendar, você precisa configurar um projeto no Google Cloud Console.

## 🚀 Passo a Passo

### 1. Criar Projeto no Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Criar Projeto" ou selecione um projeto existente
3. Nomeie o projeto (ex: "Igreja Midia Calendar")

### 2. Ativar a API do Google Calendar
1. No menu lateral, vá em **APIs e Serviços** > **Biblioteca**
2. Pesquise por "Google Calendar API"
3. Clique em "Google Calendar API" e depois em **ATIVAR**

### 3. Criar Credenciais
1. Vá em **APIs e Serviços** > **Credenciais**
2. Clique em **+ CRIAR CREDENCIAIS** > **ID do cliente OAuth 2.0**
3. Selecione "Aplicativo da Web"
4. Configure as origens JavaScript autorizadas:
   - `http://localhost:3000` (para desenvolvimento local)
   - `https://seudominio.com` (para produção)

### 4. Configurar o Site
1. Copie o **Client ID** gerado
2. No arquivo `google-calendar.js`, substitua:
   ```javascript
   client_id: 'YOUR_CLIENT_ID'
   ```
   Por:
   ```javascript
   client_id: 'SEU_CLIENT_ID_AQUI'
   ```

## 🔧 Configuração Atual

**API Key**: `AIzaSyBcpcu73o1yR60Z5MLrly31-nzEi09-mf0` ✅ (Já configurada)

**Client ID**: ❌ Precisa ser configuradoimage.png

## 📋 Funcionalidades Disponíveis

### ✅ Com API Key (Apenas Leitura)
- Visualizar eventos públicos
- Buscar eventos específicos

### 🔓 Com OAuth (Leitura + Escrita)
- Criar novos eventos
- Editar eventos existentes
- Excluir eventos
- Acesso ao calendário pessoal

## 🛡️ Segurança

### Escopo de Permissões
```javascript
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
```

Este escopo permite:
- ✅ Criar eventos
- ✅ Editar eventos próprios
- ✅ Excluir eventos próprios
- ❌ Não permite acesso a outros dados do Google

### Dados Locais
O sistema mantém dados locais como fallback:
- Eventos são salvos localmente se o Google Calendar não estiver disponível
- Login/logout funciona independentemente do Google Calendar
- Sistema continua funcionando offline

## 🧪 Testando a Integração

### 1. Sem OAuth (Estado Atual)
- Site mostra status "Desconectado"
- Botão "Nova Escala" cria eventos locais
- Mensagem informa para conectar ao Google Calendar

### 2. Com OAuth Configurado
- Site permite conectar ao Google Calendar
- Eventos são criados no Google Calendar real
- Sincronização bidirecional

## 🔄 Fluxo de Sincronização

1. **Usuário clica "Sincronizar Google"**
2. **Sistema solicita permissões do Google**
3. **Usuário autoriza o acesso**
4. **Site carrega eventos do Google Calendar**
5. **Eventos são exibidos na interface**
6. **Novos eventos são criados diretamente no Google Calendar**

## 📱 Uso Prático

### Cenário Real de Uso:
1. **Líder da mídia** faz login no site
2. **Conecta ao Google Calendar** (uma vez)
3. **Cria escalas** que aparecem no Google Calendar
4. **Membros da equipe** veem no Google Calendar pessoal
5. **Notificações automáticas** do Google para lembretes

## 🆘 Resolução de Problemas

### Erro "API Key Invalid"
- Verifique se a API está ativada no Google Cloud Console
- Confirme se a API Key está correta

### Erro "Client ID Invalid"
- Verifique se o Client ID está configurado
- Confirme se as origens autorizadas estão corretas

### Status "Desconectado"
- Normal se o Client ID não estiver configurado
- Site funciona em modo local até configuração completa

---

**💡 Dica**: O sistema já está funcional mesmo sem OAuth! Os eventos são criados localmente e podem ser migrados posteriormente. 