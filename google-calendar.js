// Google Calendar API Integration
const GOOGLE_API_KEY = 'AIzaSyBcpcu73o1yR60Z5MLrly31-nzEi09-mf0';
const CALENDAR_ID = 'primary'; // Usar calendário primário do usuário
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

// Variáveis de estado
let gapi;
let google;
let isCalendarConnected = false;
let tokenClient;

// Inicializar Google Calendar API
async function initializeGoogleCalendar() {
    try {
        // Inicializar gapi
        await new Promise((resolve) => {
            gapi.load('client', resolve);
        });

        await gapi.client.init({
            apiKey: GOOGLE_API_KEY,
            discoveryDocs: [DISCOVERY_DOC]
        });

        // Verificar se há Client ID configurado
        const CLIENT_ID = '801226449583-2vpjrtpbhh9ek30fd01g3jlds2p42br9.apps.googleusercontent.com';
        
        if (CLIENT_ID !== 'YOUR_CLIENT_ID') {
            // Inicializar Google Identity Services apenas se Client ID estiver configurado
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        onCalendarConnected();
                    } else {
                        onCalendarDisconnected();
                    }
                }
            });
        } else {
            console.log('Client ID não configurado. Google Calendar funcionará em modo limitado.');
        }

        console.log('Google Calendar API inicializada');
        
        // Só mostrar status se Client ID estiver configurado
        if (CLIENT_ID !== 'YOUR_CLIENT_ID') {
            updateCalendarStatus(false);
        } else {
            hideCalendarStatus();
        }
        
    } catch (error) {
        console.error('Erro ao inicializar Google Calendar API:', error);
        showAlert('Erro ao conectar com Google Calendar: ' + error.message);
    }
}

// Conectar com Google Calendar
function connectToGoogleCalendar() {
    if (!tokenClient) {
        showAlert('Para usar o Google Calendar, configure o Client ID seguindo as instruções no arquivo GOOGLE_CALENDAR_SETUP.md');
        return;
    }

    try {
        // Solicitar autorização
        tokenClient.requestAccessToken({prompt: 'consent'});
    } catch (error) {
        console.error('Erro ao conectar:', error);
        showAlert('Erro ao conectar com Google Calendar');
    }
}

// Callback quando conectado
function onCalendarConnected() {
    isCalendarConnected = true;
    updateCalendarStatus(true);
    loadCalendarEvents();
    showAlert('Conectado ao Google Calendar com sucesso!');
}

// Callback quando desconectado
function onCalendarDisconnected() {
    isCalendarConnected = false;
    updateCalendarStatus(false);
}

// Atualizar status da conexão
function updateCalendarStatus(connected) {
    const statusElement = document.getElementById('calendar-connection-status');
    if (!statusElement) return;

    statusElement.style.display = 'flex';
    if (connected) {
        statusElement.className = 'status-connected';
        statusElement.innerHTML = '<i class="fas fa-wifi"></i><span>Google Calendar: Conectado</span>';
    } else {
        statusElement.className = 'status-disconnected';
        statusElement.innerHTML = '<i class="fas fa-wifi"></i><span>Google Calendar: Desconectado</span>';
    }
}

// Esconder status da conexão
function hideCalendarStatus() {
    const statusElement = document.getElementById('calendar-connection-status');
    if (statusElement) {
        statusElement.style.display = 'none';
    }
}

// Carregar eventos do Google Calendar
async function loadCalendarEvents() {
    if (!isCalendarConnected) {
        console.log('Não conectado ao Google Calendar');
        return;
    }

    const loadingElement = document.getElementById('calendar-loading');
    const eventsContainer = document.getElementById('calendar-events-container');
    
    if (loadingElement) loadingElement.style.display = 'flex';

    try {
        const now = new Date();
        const timeMin = now.toISOString();
        const timeMax = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString(); // 30 dias

        const response = await gapi.client.calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: timeMin,
            timeMax: timeMax,
            showDeleted: false,
            singleEvents: true,
            maxResults: 20,
            orderBy: 'startTime',
            q: 'culto OR mídia OR igreja OR escala' // Filtrar eventos relacionados à igreja
        });

        const events = response.result.items || [];
        displayGoogleCalendarEvents(events);

    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        showAlert('Erro ao carregar eventos do Google Calendar');
    } finally {
        if (loadingElement) loadingElement.style.display = 'none';
    }
}

// Exibir eventos do Google Calendar
function displayGoogleCalendarEvents(events) {
    const eventsContainer = document.getElementById('calendar-events-container');
    if (!eventsContainer) return;

    // Limpar eventos anteriores
    eventsContainer.innerHTML = '';

    if (events.length === 0) {
        eventsContainer.innerHTML = `
            <div class="no-events-message">
                <i class="fas fa-calendar-times"></i>
                <p>Nenhum evento encontrado no Google Calendar</p>
                <small>Eventos com palavras-chave: culto, mídia, igreja, escala</small>
            </div>
        `;
        return;
    }

    events.forEach(event => {
        const eventElement = createGoogleEventElement(event);
        eventsContainer.appendChild(eventElement);
    });
}

// Criar elemento HTML para evento do Google Calendar
function createGoogleEventElement(event) {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'escala-item google-event';

    const startTime = new Date(event.start.dateTime || event.start.date);
    const endTime = new Date(event.end.dateTime || event.end.date);

    // Formatação da data
    const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    
    const dayName = dayNames[startTime.getDay()];
    const day = startTime.getDate();
    const month = monthNames[startTime.getMonth()];
    const hour = startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    eventDiv.innerHTML = `
        <div class="escala-date">
            <div class="day">${dayName}</div>
            <div class="date">${day}</div>
            <div class="month">${month}</div>
        </div>
        <div class="escala-details">
            <h4>${event.summary} - ${hour} <span class="event-source">(Google Calendar)</span></h4>
            <div class="escala-roles">
                ${event.description ? parseEventDescription(event.description) : '<span class="role"><i class="fas fa-info-circle"></i> Sem detalhes de escala</span>'}
            </div>
            ${event.location ? `<div class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</div>` : ''}
        </div>
        <div class="escala-actions">
            <button class="btn-edit" onclick="editGoogleEvent('${event.id}')">
                <i class="fas fa-external-link-alt"></i>
            </button>
            <button class="btn-delete" onclick="deleteGoogleEvent('${event.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    return eventDiv;
}

// Processar descrição do evento para extrair informações de escala
function parseEventDescription(description) {
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

// Criar novo evento no Google Calendar
async function createGoogleCalendarEvent(eventData) {
    if (!isCalendarConnected) {
        showAlert('Conecte-se ao Google Calendar primeiro');
        return false;
    }

    try {
        const startDateTime = new Date(`${eventData.date}T${eventData.time}`);
        const endDateTime = new Date(startDateTime.getTime() + (eventData.duration * 60 * 1000));

        const event = {
            summary: eventData.title,
            description: eventData.description,
            location: eventData.location,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: 'America/Sao_Paulo'
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: 'America/Sao_Paulo'
            },
            colorId: '4' // Cor azul para eventos da igreja
        };

        const response = await gapi.client.calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: event
        });

        showAlert('Evento criado no Google Calendar com sucesso!');
        loadCalendarEvents(); // Recarregar eventos
        return true;

    } catch (error) {
        console.error('Erro ao criar evento:', error);
        showAlert('Erro ao criar evento no Google Calendar');
        return false;
    }
}

// Editar evento do Google Calendar (abre no Google Calendar)
function editGoogleEvent(eventId) {
    const url = `https://calendar.google.com/calendar/r/eventedit/${eventId}`;
    window.open(url, '_blank');
}

// Deletar evento do Google Calendar
async function deleteGoogleEvent(eventId) {
    if (!confirm('Tem certeza que deseja excluir este evento do Google Calendar?')) {
        return;
    }

    try {
        await gapi.client.calendar.events.delete({
            calendarId: CALENDAR_ID,
            eventId: eventId
        });

        showAlert('Evento excluído do Google Calendar');
        loadCalendarEvents(); // Recarregar eventos

    } catch (error) {
        console.error('Erro ao excluir evento:', error);
        showAlert('Erro ao excluir evento do Google Calendar');
    }
}

// Adicionar estilos CSS para elementos específicos do Google Calendar
function addGoogleCalendarStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .no-events-message {
            text-align: center;
            padding: 40px;
            color: var(--gray-medium);
        }
        
        .no-events-message i {
            font-size: 2rem;
            margin-bottom: 10px;
            color: var(--secondary-color);
        }
        
        .event-location {
            margin-top: 8px;
            color: var(--gray-medium);
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .event-location i {
            color: var(--secondary-color);
        }
    `;
    document.head.appendChild(style);
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    addGoogleCalendarStyles();
    
    // Aguardar APIs do Google carregarem com timeout
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos
    
    const checkGoogleAPIs = setInterval(() => {
        attempts++;
        
        if (typeof gapi !== 'undefined' && typeof google !== 'undefined') {
            clearInterval(checkGoogleAPIs);
            initializeGoogleCalendar();
        } else if (attempts >= maxAttempts) {
            clearInterval(checkGoogleAPIs);
            console.log('APIs do Google não carregaram. Funcionando em modo local.');
            hideCalendarStatus();
        }
    }, 100);
});

// Exportar funções para uso global
window.connectToGoogleCalendar = connectToGoogleCalendar;
window.loadCalendarEvents = loadCalendarEvents;
window.createGoogleCalendarEvent = createGoogleCalendarEvent;
window.editGoogleEvent = editGoogleEvent;
window.deleteGoogleEvent = deleteGoogleEvent; 