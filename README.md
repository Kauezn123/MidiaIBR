# 🏛️ Sistema de Mídia da Igreja

Sistema simples de gestão para a equipe de mídia da igreja, desenvolvido com HTML, CSS e JavaScript puro.

## 🎨 Design

- **Cores**: Preto (primária) e Laranja (secundária)
- **Layout**: Responsivo e moderno
- **Ícones**: Font Awesome
- **Tipografia**: Segoe UI

## 🔐 Sistema de Login

O sistema possui diferentes níveis de acesso:

### Usuários Disponíveis:

| Usuário | Senha | Perfil | Nome |
|---------|-------|--------|------|
| `admin` | `123456` | Administrador | Administrador |
| `lider` | `lider123` | Líder | Líder de Mídia |
| `membro1` | `membro123` | Membro | João Silva |
| `membro2` | `membro123` | Membro | Maria Santos |
| `membro3` | `membro123` | Membro | Pedro Costa |

## 📱 Seções do Sistema

### 1. 🏠 Início (Dashboard)
- **Próxima Escala**: Informações do próximo serviço
- **Membros Ativos**: Contador da equipe
- **Status Equipamentos**: Situação dos equipamentos
- **Avisos Importantes**: Comunicados da equipe

### 2. 📅 Escala
- **Calendário de Serviços**: Visualização das escalas
- **Gerenciamento**: Adicionar, editar e remover escalas
- **Funções**: Som, Vídeo, Slides
- **Navegação por Mês**: Controles de mês anterior/próximo

### 3. 👥 Membros
- **Lista da Equipe**: Cards com informações dos membros
- **Contatos**: Telefone e email
- **Especialidades**: Habilidades de cada membro
- **Gerenciamento**: Adicionar, editar e remover membros

## 🚀 Como Usar

1. **Abrir o Sistema**
   - Abra o arquivo `index.html` no navegador

2. **Fazer Login**
   - Use um dos usuários disponíveis na tabela acima
   - O sistema lembra do login até fazer logout

3. **Navegar**
   - Use o menu superior para alternar entre seções
   - Clique no botão "Sair" para fazer logout

4. **Funcionalidades**
   - Botões de ação (adicionar, editar, excluir) mostram alertas
   - Sistema responsivo para mobile e desktop

## 🛠️ Funcionalidades Técnicas

- **Autenticação**: Sistema simples com localStorage
- **Navegação SPA**: Single Page Application
- **Responsivo**: Funciona em mobile e desktop
- **Animações**: Transições suaves entre seções
- **Persistência**: Login mantido no localStorage

## 📂 Estrutura de Arquivos

```
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Funcionalidades JavaScript
└── README.md           # Documentação
```

## 🎯 Próximas Funcionalidades

- [ ] Formulários completos para adicionar escalas
- [ ] Formulários completos para adicionar membros
- [ ] Sistema de notificações
- [ ] Integração com calendário
- [ ] Backup/exportação de dados
- [ ] Sistema de permissões por usuário

## 💡 Personalização

Para personalizar as cores, edite as variáveis CSS no arquivo `styles.css`:

```css
:root {
    --primary-color: #000000;     /* Preto */
    --secondary-color: #ff8500;   /* Laranja */
    --accent-color: #ffad33;      /* Laranja claro */
}
```

## 📱 Compatibilidade

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile (iOS/Android)

## 🤝 Suporte

Para dúvidas ou sugestões, contate a equipe de desenvolvimento.

---

**Desenvolvido para a Mídia da Igreja** 🎵 📹 🎤 