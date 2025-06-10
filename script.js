// Sistema de Autenticação Simples
const users = {
    'admin': { password: '123456', name: 'Administrador', role: 'admin' },
    'lider': { password: 'lider123', name: 'Líder de Mídia', role: 'leader' },
    'membro1': { password: 'membro123', name: 'João Silva', role: 'member' },
    'membro2': { password: 'membro123', name: 'Maria Santos', role: 'member' },
    'membro3': { password: 'membro123', name: 'Pedro Costa', role: 'member' }
};

// Estado da aplicação
let currentUser = null;
let currentSection = 'inicio';

// Elementos DOM
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const userNameSpan = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showApp();
    } else {
        showLogin();
    }

    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Navegação
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Botões das seções
    setupSectionButtons();
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (users[username] && users[username].password === password) {
        currentUser = {
            username: username,
            name: users[username].name,
            role: users[username].role
        };
        
        // Salvar no localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        hideError();
        showApp();
    } else {
        showError('Usuário ou senha incorretos!');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLogin();
}

function showLogin() {
    loginContainer.style.display = 'flex';
    appContainer.style.display = 'none';
    
    // Limpar formulário
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    hideError();
}

function showApp() {
    loginContainer.style.display = 'none';
    appContainer.style.display = 'block';
    
    // Atualizar nome do usuário
    userNameSpan.textContent = currentUser.name;
    
    // Mostrar seção inicial
    showSection('inicio');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function handleNavigation(e) {
    e.preventDefault();
    
    const sectionName = e.currentTarget.getAttribute('data-section');
    showSection(sectionName);
}

function showSection(sectionName) {
    // Atualizar navegação ativa
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        }
    });
    
    // Mostrar seção
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionName + '-section') {
            section.classList.add('active');
        }
    });
    
    currentSection = sectionName;
}

function setupSectionButtons() {
    // Botões de adicionar
    const addEscalaBtn = document.getElementById('add-escala-btn');
    const addMembroBtn = document.getElementById('add-membro-btn');
    const syncCalendarBtn = document.getElementById('sync-calendar-btn');
    
    if (addEscalaBtn) {
        addEscalaBtn.addEventListener('click', openEventModal);
    }
    
    if (addMembroBtn) {
        addMembroBtn.addEventListener('click', () => {
            showAlert('Funcionalidade "Novo Membro" em desenvolvimento!');
        });
    }

    if (syncCalendarBtn) {
        syncCalendarBtn.addEventListener('click', () => {
            if (typeof connectToGoogleCalendar === 'function') {
                connectToGoogleCalendar();
            } else {
                showAlert('Funcionalidade do Google Calendar está sendo carregada...');
            }
        });
    }
    
    // Botões de editar e excluir
    setupActionButtons();
    
    // Navegação do calendário
    setupCalendarNavigation();
    
    // Modal de eventos
    setupEventModal();
}

function setupActionButtons() {
    const editButtons = document.querySelectorAll('.btn-edit');
    const deleteButtons = document.querySelectorAll('.btn-delete');
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showAlert('Funcionalidade de edição em desenvolvimento!');
        });
    });
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('Tem certeza que deseja excluir este item?')) {
                const item = e.target.closest('.escala-item, .membro-card');
                if (item) {
                    item.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => {
                        item.remove();
                        showAlert('Item removido com sucesso!');
                    }, 300);
                }
            }
        });
    });
}

function setupCalendarNavigation() {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthSpan = document.getElementById('current-month');
    
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    let currentMonth = 0; // Janeiro
    let currentYear = 2024;
    
    function updateMonthDisplay() {
        currentMonthSpan.textContent = `${months[currentMonth]} ${currentYear}`;
    }
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateMonthDisplay();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateMonthDisplay();
        });
    }
    
    updateMonthDisplay();
}

function showAlert(message) {
    // Criar elemento de alerta
    const alert = document.createElement('div');
    alert.className = 'custom-alert';
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar estilos
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(alert);
    
    // Remover após 3 segundos
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300);
    }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
    
    .custom-alert .alert-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .custom-alert .alert-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);

// Funcionalidades adicionais para demonstração
function updateDashboardStats() {
    // Simular atualizações em tempo real
    const totalMembros = document.getElementById('total-membros');
    if (totalMembros) {
        const membrosCount = document.querySelectorAll('.membro-card').length;
        totalMembros.textContent = membrosCount;
    }
}

// Simular dados dinâmicos
setInterval(() => {
    updateDashboardStats();
}, 5000);

// Funcionalidade de busca (para futuras implementações)
function searchFunction(query) {
    // Implementar busca quando necessário
    console.log('Buscando por:', query);
}

// Salvar dados no localStorage (para persistência básica)
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Funções do Modal de Eventos
function setupEventModal() {
    const modal = document.getElementById('event-modal');
    const closeBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-event');
    const eventForm = document.getElementById('event-form');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeEventModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeEventModal);
    }

    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmit);
    }

    // Fechar modal clicando fora
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEventModal();
            }
        });
    }
}

function openEventModal() {
    const modal = document.getElementById('event-modal');
    const eventDate = document.getElementById('event-date');
    
    if (modal) {
        modal.style.display = 'flex';
        
        // Definir data padrão para domingo seguinte
        if (eventDate) {
            const nextSunday = getNextSunday();
            eventDate.value = nextSunday.toISOString().split('T')[0];
        }
        
        // Definir horário padrão
        const eventTime = document.getElementById('event-time');
        if (eventTime) {
            eventTime.value = '10:00';
        }
    }
}

function closeEventModal() {
    const modal = document.getElementById('event-modal');
    const form = document.getElementById('event-form');
    
    if (modal) {
        modal.style.display = 'none';
    }
    
    if (form) {
        form.reset();
    }
}

function getNextSunday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7;
    const nextSunday = new Date(today);
    
    if (daysUntilSunday === 0) {
        nextSunday.setDate(today.getDate() + 7); // Próximo domingo se hoje é domingo
    } else {
        nextSunday.setDate(today.getDate() + daysUntilSunday);
    }
    
    return nextSunday;
}

async function handleEventSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const eventData = {
        title: document.getElementById('event-title').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        duration: parseInt(document.getElementById('event-duration').value),
        description: document.getElementById('event-description').value,
        location: document.getElementById('event-location').value
    };

    // Verificar se todos os campos obrigatórios estão preenchidos
    if (!eventData.title || !eventData.date || !eventData.time) {
        showAlert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    // Tentar criar no Google Calendar
    if (typeof createGoogleCalendarEvent === 'function') {
        const success = await createGoogleCalendarEvent(eventData);
        if (success) {
            closeEventModal();
        }
    } else {
        // Fallback: criar evento local
        createLocalEvent(eventData);
        closeEventModal();
    }
}

function createLocalEvent(eventData) {
    // Implementação de backup para criar evento local
    const eventsContainer = document.getElementById('calendar-events-container');
    if (!eventsContainer) return;

    const eventElement = createLocalEventElement(eventData);
    eventsContainer.appendChild(eventElement);
    
    showAlert('Evento criado localmente. Conecte-se ao Google Calendar para sincronizar.');
}

function createLocalEventElement(eventData) {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'escala-item local-event';

    const eventDate = new Date(`${eventData.date}T${eventData.time}`);
    const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    
    const dayName = dayNames[eventDate.getDay()];
    const day = eventDate.getDate();
    const month = monthNames[eventDate.getMonth()];
    const hour = eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    eventDiv.innerHTML = `
        <div class="escala-date">
            <div class="day">${dayName}</div>
            <div class="date">${day}</div>
            <div class="month">${month}</div>
        </div>
        <div class="escala-details">
            <h4>${eventData.title} - ${hour} <span class="event-source">(Local)</span></h4>
            <div class="escala-roles">
                ${eventData.description ? parseLocalEventDescription(eventData.description) : '<span class="role"><i class="fas fa-info-circle"></i> Sem detalhes de escala</span>'}
            </div>
            ${eventData.location ? `<div class="event-location"><i class="fas fa-map-marker-alt"></i> ${eventData.location}</div>` : ''}
        </div>
        <div class="escala-actions">
            <button class="btn-edit" onclick="editLocalEvent(this)">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-delete" onclick="deleteLocalEvent(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    return eventDiv;
}

function parseLocalEventDescription(description) {
    if (!description) return '';
    
    const lines = description.split('\n');
    const roles = [];
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.includes(':')) {
            const [role, person] = trimmed.split(':');
            const iconMap = {
                'som': 'microphone',
                'video': 'video',
                'vídeo': 'video',
                'slide': 'desktop',
                'slides': 'desktop',
                'projeção': 'desktop'
            };
            
            const roleKey = role.toLowerCase().trim();
            const icon = iconMap[roleKey] || 'user';
            
            roles.push(`<span class="role"><i class="fas fa-${icon}"></i> ${role.trim()}: ${person.trim()}</span>`);
        }
    });
    
    return roles.length > 0 ? roles.join('') : `<span class="role"><i class="fas fa-info-circle"></i> ${description}</span>`;
}

function editLocalEvent(button) {
    showAlert('Funcionalidade de edição em desenvolvimento!');
}

function deleteLocalEvent(button) {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
        const eventItem = button.closest('.escala-item');
        if (eventItem) {
            eventItem.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                eventItem.remove();
                showAlert('Evento removido!');
            }, 300);
        }
    }
}

// Exportar funções para uso global se necessário
window.showAlert = showAlert;
window.saveToLocalStorage = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;
window.openEventModal = openEventModal;
window.closeEventModal = closeEventModal;
window.editLocalEvent = editLocalEvent;
window.deleteLocalEvent = deleteLocalEvent; 