/**
 * CPM - Página de Inscrição com Sistema de Etapas
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * - Sistema de etapas com navegação intuitiva
 * - Upload de imagem PNG/JPG/WebP
 * - Validação completa de formulário
 * - Geração automática de PDF com logo
 * - Redirecionamento para WhatsApp
 * - Interface moderna e responsiva
 */

// Configurações
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const WHATSAPP_NUMBER = '+5511986724226';

// Estado da aplicação
let currentStep = 1;
let totalSteps = 4;
let inscriptionData = null;

// Elementos do DOM
const logoInput = document.getElementById('logoInput');
const logoPreview = document.getElementById('logoPreview');
const chooseFile = document.getElementById('chooseFile');
const changeFile = document.getElementById('changeFile');
const removeFile = document.getElementById('removeFile');
const logoError = document.getElementById('logoError');
const uploadContent = document.querySelector('.upload-content');
const uploadPreview = document.getElementById('uploadPreview');

const teamForm = document.getElementById('teamForm');
const playersEl = document.getElementById('players');
const addPlayerBtn = document.getElementById('addPlayer');
const playersCounter = document.getElementById('playersCounter');
const submitBtn = document.getElementById('submitBtn');
const formError = document.getElementById('formError');

const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const sendToWhatsApp = document.getElementById('sendToWhatsApp');

// Elementos de navegação
const progressFill = document.getElementById('progressFill');
const steps = document.querySelectorAll('.step');

// Botões de navegação
const nextStep1 = document.getElementById('nextStep1');
const nextStep2 = document.getElementById('nextStep2');
const nextStep3 = document.getElementById('nextStep3');
const prevStep2 = document.getElementById('prevStep2');
const prevStep3 = document.getElementById('prevStep3');
const prevStep4 = document.getElementById('prevStep4');

// Debug: verificar se todos os elementos foram encontrados
console.log('Elementos encontrados:', {
    logoInput: !!logoInput,
    logoPreview: !!logoPreview,
    chooseFile: !!chooseFile,
    changeFile: !!changeFile,
    removeFile: !!removeFile,
    logoError: !!logoError,
    uploadContent: !!uploadContent,
    uploadPreview: !!uploadPreview,
    teamForm: !!teamForm,
    playersEl: !!playersEl,
    addPlayerBtn: !!addPlayerBtn,
    playersCounter: !!playersCounter,
    submitBtn: !!submitBtn,
    formError: !!formError,
    modal: !!modal,
    closeModal: !!closeModal,
    sendToWhatsApp: !!sendToWhatsApp,
    progressFill: !!progressFill,
    steps: steps.length,
    nextStep1: !!nextStep1,
    nextStep2: !!nextStep2,
    nextStep3: !!nextStep3,
    prevStep2: !!prevStep2,
    prevStep3: !!prevStep3,
    prevStep4: !!prevStep4
});

// Helpers
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'flex';
    }
}

function hideError(element) {
    if (element) {
        element.style.display = 'none';
    }
}

function updateProgress() {
    if (progressFill) {
        const progress = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
        console.log('Progresso atualizado:', progress + '%');
    }
}

function updateSteps() {
    if (steps && steps.length > 0) {
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('completed');
            }
        });
        console.log('Etapas atualizadas, etapa atual:', currentStep);
    }
}

function showStep(stepNumber) {
    console.log('Mostrando etapa:', stepNumber);
    
    // Esconder todas as etapas
    const allSteps = document.querySelectorAll('.form-step');
    allSteps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Mostrar etapa atual
    const currentStepEl = document.getElementById(`step${stepNumber}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
        console.log('Etapa', stepNumber, 'ativada');
    } else {
        console.error('Etapa', stepNumber, 'não encontrada');
    }
    
    // Atualizar estado
    currentStep = stepNumber;
    updateProgress();
    updateSteps();
}

function validateStep(stepNumber) {
    console.log('Validando etapa:', stepNumber);
    
    switch (stepNumber) {
        case 1:
            return validateLogo();
        case 2:
            return validateClubData();
        case 3:
            return validatePlayers();
        default:
            return true;
    }
}

function validateLogo() {
    if (!logoInput || !logoInput.files[0]) {
        showError(logoError, 'A logo do clube é obrigatória.');
        return false;
    }
    
    const file = logoInput.files[0];
    if (!ACCEPTED_TYPES.includes(file.type)) {
        showError(logoError, 'Tipo de arquivo inválido. Use PNG, JPG ou WebP.');
        return false;
    }
    
    if (file.size > MAX_FILE_SIZE) {
        showError(logoError, 'Arquivo muito grande. Máximo 5MB.');
        return false;
    }
    
    hideError(logoError);
    return true;
}

function validateClubData() {
    let isValid = true;
    
    const name = document.getElementById('clubName')?.value?.trim();
    const owner = document.getElementById('owner')?.value?.trim();
    const captain = document.getElementById('captain')?.value?.trim();
    
    if (!name) {
        showError(document.getElementById('clubNameError'), 'Nome do clube é obrigatório');
        isValid = false;
    } else {
        hideError(document.getElementById('clubNameError'));
    }
    
    if (!owner) {
        showError(document.getElementById('ownerError'), 'Nome do dono é obrigatório');
        isValid = false;
    } else {
        hideError(document.getElementById('ownerError'));
    }
    
    if (!captain) {
        showError(document.getElementById('captainError'), 'Nome do capitão é obrigatório');
        isValid = false;
    } else {
        hideError(document.getElementById('captainError'));
    }
    
    return isValid;
}

function validatePlayers() {
    if (!playersEl) return false;
    
    const count = playersEl.children.length;
    if (count < 6 || count > 10) {
        return false;
    }
    
    for (const card of playersEl.children) {
        const inputs = card.querySelectorAll('input[type="text"]');
        const id = inputs[0]?.value?.trim();
        const nick = inputs[1]?.value?.trim();
        const checkboxes = card.querySelectorAll('input[type="checkbox"]');
        const anyPos = Array.from(checkboxes).some(cb => cb.checked);
        
        if (!id || !nick || !anyPos) {
            return false;
        }
    }
    
    return true;
}

// Upload de arquivo
if (chooseFile) {
    chooseFile.addEventListener('click', () => logoInput?.click());
}
if (changeFile) {
    changeFile.addEventListener('click', () => logoInput?.click());
}
if (logoInput) {
    logoInput.addEventListener('change', handleFileSelect);
}

if (removeFile) {
    removeFile.addEventListener('click', () => {
        if (logoInput) logoInput.value = '';
        if (uploadContent) uploadContent.style.display = 'flex';
        if (uploadPreview) uploadPreview.style.display = 'none';
        hideError(logoError);
        if (nextStep1) nextStep1.disabled = true;
    });
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!ACCEPTED_TYPES.includes(file.type)) {
        showError(logoError, 'Tipo de arquivo inválido. Use PNG, JPG ou WebP.');
        logoInput.value = '';
        if (nextStep1) nextStep1.disabled = true;
        return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
        showError(logoError, 'Arquivo muito grande. Máximo 5MB.');
        logoInput.value = '';
        if (nextStep1) nextStep1.disabled = true;
        return;
    }
    
    hideError(logoError);
    if (nextStep1) nextStep1.disabled = false;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
        if (logoPreview) logoPreview.src = ev.target.result;
        if (uploadContent) uploadContent.style.display = 'none';
        if (uploadPreview) uploadPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Drag and drop
if (uploadContent) {
    uploadContent.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadContent.style.borderColor = '#2563eb';
        uploadContent.style.background = '#ffffff';
    });

    uploadContent.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadContent.style.borderColor = '#e5e7eb';
        uploadContent.style.background = '#f9fafb';
    });

    uploadContent.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadContent.style.borderColor = '#e5e7eb';
        uploadContent.style.background = '#f9fafb';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            if (logoInput) logoInput.files = files;
            handleFileSelect({ target: { files } });
        }
    });
}

// Navegação entre etapas
if (nextStep1) {
    nextStep1.addEventListener('click', () => {
        if (validateStep(1)) {
            showStep(2);
        }
    });
}

if (nextStep2) {
    nextStep2.addEventListener('click', () => {
        if (validateStep(2)) {
            showStep(3);
        }
    });
}

if (nextStep3) {
    nextStep3.addEventListener('click', () => {
        if (validateStep(3)) {
            showStep(4);
            populateReview();
        }
    });
}

if (prevStep2) {
    prevStep2.addEventListener('click', () => showStep(1));
}
if (prevStep3) {
    prevStep3.addEventListener('click', () => showStep(2));
}
if (prevStep4) {
    prevStep4.addEventListener('click', () => showStep(3));
}

// Validação em tempo real para etapa 2
const clubNameEl = document.getElementById('clubName');
const ownerEl = document.getElementById('owner');
const captainEl = document.getElementById('captain');

if (clubNameEl) {
    clubNameEl.addEventListener('input', () => {
        const isValid = validateClubData();
        if (nextStep2) nextStep2.disabled = !isValid;
    });
}

if (ownerEl) {
    ownerEl.addEventListener('input', () => {
        const isValid = validateClubData();
        if (nextStep2) nextStep2.disabled = !isValid;
    });
}

if (captainEl) {
    captainEl.addEventListener('input', () => {
        const isValid = validateClubData();
        if (nextStep2) nextStep2.disabled = !isValid;
    });
}

// Gerenciamento de jogadores
function createPlayerCard(index, data = { id: '', nick: '', positions: [] }) {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.dataset.index = index;
    
    card.innerHTML = `
        <div class="player-header">
            <div class="player-number">${index + 1}</div>
            <button type="button" class="remove-player-btn" title="Remover jogador">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="player-fields">
            <div class="form-group">
                <label class="form-label">ID <span class="required">*</span></label>
                <input type="text" class="form-input" placeholder="ID do jogador" value="${data.id || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Nick <span class="required">*</span></label>
                <input type="text" class="form-input" placeholder="Nick do jogador" value="${data.nick || ''}" required>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Posições <span class="required">*</span></label>
            <div class="player-positions">
                <label class="position-checkbox">
                    <input type="checkbox" value="GL" ${data.positions && data.positions.includes('GL') ? 'checked' : ''}>
                    <span>GL</span>
                </label>
                <label class="position-checkbox">
                    <input type="checkbox" value="VL" ${data.positions && data.positions.includes('VL') ? 'checked' : ''}>
                    <span>VL</span>
                </label>
                <label class="position-checkbox">
                    <input type="checkbox" value="PV" ${data.positions && data.positions.includes('PV') ? 'checked' : ''}>
                    <span>PV</span>
                </label>
            </div>
        </div>
    `;
    
    // Adicionar evento de remoção
    const removeBtn = card.querySelector('.remove-player-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => removePlayer(card));
    }
    
    // Adicionar validação em tempo real
    const inputs = card.querySelectorAll('input[type="text"]');
    const checkboxes = card.querySelectorAll('input[type="checkbox"]');
    
    inputs.forEach(input => {
        input.addEventListener('input', validatePlayersStep);
    });
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validatePlayersStep);
    });
    
    return card;
}

function validatePlayersStep() {
    const isValid = validatePlayers();
    if (nextStep3) nextStep3.disabled = !isValid;
}

function updatePlayersCount() {
    if (playersCounter && playersEl) {
        const count = playersEl.children.length;
        playersCounter.textContent = `${count} de 10`;
        if (addPlayerBtn) addPlayerBtn.disabled = count >= 10;
        validatePlayersStep();
    }
}

function addPlayer(data) {
    if (!playersEl) return;
    
    const count = playersEl.children.length;
    if (count >= 10) return;
    
    const playerCard = createPlayerCard(count, data);
    playersEl.appendChild(playerCard);
    updatePlayersCount();
}

function removePlayer(card) {
    if (!playersEl) return;
    
    const count = playersEl.children.length;
    if (count <= 6) {
        alert('É necessário ao menos 6 jogadores.');
        return;
    }
    
    card.remove();
    
    // Reindexar
    Array.from(playersEl.children).forEach((child, i) => {
        child.dataset.index = i;
        const numberEl = child.querySelector('.player-number');
        if (numberEl) numberEl.textContent = i + 1;
    });
    
    updatePlayersCount();
}

if (addPlayerBtn) {
    addPlayerBtn.addEventListener('click', () => addPlayer());
}

// Inicializar com 6 jogadores vazios
if (playersEl) {
    for (let i = 0; i < 6; i++) {
        addPlayer();
    }
}

// Populate review
function populateReview() {
    console.log('Populando revisão...');
    
    // Logo
    const reviewLogoEl = document.getElementById('reviewLogo');
    if (reviewLogoEl && logoPreview) {
        reviewLogoEl.src = logoPreview.src;
    }
    
    // Dados do clube
    const reviewNameEl = document.getElementById('reviewName');
    const reviewOwnerEl = document.getElementById('reviewOwner');
    const reviewCaptainEl = document.getElementById('reviewCaptain');
    
    if (reviewNameEl && clubNameEl) {
        reviewNameEl.textContent = clubNameEl.value.trim();
    }
    if (reviewOwnerEl && ownerEl) {
        reviewOwnerEl.textContent = ownerEl.value.trim();
    }
    if (reviewCaptainEl && captainEl) {
        reviewCaptainEl.textContent = captainEl.value.trim();
    }
    
    const coachEl = document.getElementById('coach');
    const reviewCoachEl = document.getElementById('reviewCoach');
    const reviewCoachItemEl = document.getElementById('reviewCoachItem');
    
    if (coachEl && reviewCoachEl && reviewCoachItemEl) {
        const coach = coachEl.value.trim();
        if (coach) {
            reviewCoachEl.textContent = coach;
            reviewCoachItemEl.style.display = 'flex';
        }
    }
    
    const notesEl = document.getElementById('notes');
    const reviewNotesEl = document.getElementById('reviewNotes');
    const reviewNotesItemEl = document.getElementById('reviewNotesItem');
    
    if (notesEl && reviewNotesEl && reviewNotesItemEl) {
        const notes = notesEl.value.trim();
        if (notes) {
            reviewNotesEl.textContent = notes;
            reviewNotesItemEl.style.display = 'flex';
        }
    }
    
    // Jogadores
    const reviewPlayersEl = document.getElementById('reviewPlayers');
    if (reviewPlayersEl && playersEl) {
        reviewPlayersEl.innerHTML = '';
        
        Array.from(playersEl.children).forEach((card, index) => {
            const inputs = card.querySelectorAll('input[type="text"]');
            const id = inputs[0]?.value?.trim() || '';
            const nick = inputs[1]?.value?.trim() || '';
            const positions = Array.from(card.querySelectorAll('input[type="checkbox"]'))
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            const playerDiv = document.createElement('div');
            playerDiv.className = 'review-player';
            playerDiv.innerHTML = `
                <div class="review-player-info">
                    <div class="review-player-name">${index + 1}. ${nick} (ID: ${id})</div>
                    <div class="review-player-positions">Posições: ${positions.join(', ')}</div>
                </div>
            `;
            
            reviewPlayersEl.appendChild(playerDiv);
        });
    }
}

// Geração de PDF com logo
async function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurações
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;
    
    try {
        // Adicionar logo se disponível
        if (data.logo) {
            const logoDataUrl = await getLogoDataUrl(data.logo);
            if (logoDataUrl) {
                // Adicionar logo no topo
                doc.addImage(logoDataUrl, 'JPEG', margin, yPosition, 40, 40);
                yPosition += 50; // Espaço para a logo
            }
        }
        
        // Título
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('CPM - Inscrição de Time', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 20;
        
        // Subtítulo
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('Campeonato Paulista de MamoBall - Temporada 2025', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 25;
        
        // Dados do clube
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Dados do Clube', margin, yPosition);
        yPosition += 15;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nome: ${data.name}`, margin, yPosition);
        yPosition += 10;
        doc.text(`Dono: ${data.owner}`, margin, yPosition);
        yPosition += 10;
        doc.text(`Capitão: ${data.captain}`, margin, yPosition);
        yPosition += 10;
        
        if (data.coach) {
            doc.text(`Técnico: ${data.coach}`, margin, yPosition);
            yPosition += 10;
        }
        
        if (data.notes) {
            doc.text(`Observações: ${data.notes}`, margin, yPosition);
            yPosition += 15;
        }
        
        // Jogadores
        yPosition += 10;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Jogadores', margin, yPosition);
        yPosition += 15;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        
        data.players.forEach((player, index) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 30;
            }
            
            doc.text(`${index + 1}. ID: ${player.id} | Nick: ${player.nick} | Posições: ${player.positions.join(', ')}`, margin, yPosition);
            yPosition += 10;
        });
        
        // Data e hora
        yPosition += 15;
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
        doc.text(`Inscrição realizada em: ${dateStr}`, margin, yPosition);
        
        return doc;
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        throw error;
    }
}

function getLogoDataUrl(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

// Envio do formulário
if (teamForm) {
    teamForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError(formError);
        
        if (!validateStep(4)) return;
        
        // Construir array de jogadores
        const players = [];
        if (playersEl) {
            Array.from(playersEl.children).forEach(card => {
                const inputs = card.querySelectorAll('input[type="text"]');
                const id = inputs[0]?.value?.trim() || '';
                const nick = inputs[1]?.value?.trim() || '';
                const positions = Array.from(card.querySelectorAll('input[type="checkbox"]'))
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);
                
                players.push({ id, nick, positions });
            });
        }
        
        // Preparar dados para PDF
        inscriptionData = {
            name: clubNameEl?.value?.trim() || '',
            owner: ownerEl?.value?.trim() || '',
            captain: captainEl?.value?.trim() || '',
            coach: document.getElementById('coach')?.value?.trim() || '',
            notes: document.getElementById('notes')?.value?.trim() || '',
            players: players,
            logo: logoInput?.files[0]
        };
        
        // Mostrar modal de sucesso
        openModal('Inscrição finalizada!', 'Seus dados foram processados com sucesso! Um PDF foi gerado e você será redirecionado para o WhatsApp para enviar a inscrição.');
    });
}

// Modal
function openModal(title, message) {
    const modalTitleEl = document.getElementById('modalTitle');
    const modalMsgEl = document.getElementById('modalMsg');
    
    if (modalTitleEl) modalTitleEl.textContent = title;
    if (modalMsgEl) modalMsgEl.textContent = message;
    if (modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeModalFn() {
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }
}

if (closeModal) {
    closeModal.addEventListener('click', closeModalFn);
}

// Enviar para WhatsApp
if (sendToWhatsApp) {
    sendToWhatsApp.addEventListener('click', async () => {
        if (!inscriptionData) {
            alert('Erro: dados da inscrição não encontrados.');
            return;
        }
        
        try {
            // Gerar PDF
            const doc = await generatePDF(inscriptionData);
            
            // Converter PDF para blob
            const pdfBlob = doc.output('blob');
            
            // Criar URL do blob
            const pdfUrl = URL.createObjectURL(pdfBlob);
            
            // Preparar mensagem para WhatsApp (simplificada)
            const message = `Quero inscrever meu time "${inscriptionData.name}" na CPM.`;
            
            // Codificar mensagem para URL
            const encodedMessage = encodeURIComponent(message);
            
            // Redirecionar para WhatsApp
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
            
            // Fechar modal
            closeModalFn();
            
            // Limpar formulário
            if (teamForm) teamForm.reset();
            if (logoInput) logoInput.value = '';
            if (uploadContent) uploadContent.style.display = 'flex';
            if (uploadPreview) uploadPreview.style.display = 'none';
            if (playersEl) {
                playersEl.innerHTML = '';
                for (let i = 0; i < 6; i++) {
                    addPlayer();
                }
            }
            
            // Limpar dados
            inscriptionData = null;
            
            // Voltar para primeira etapa
            showStep(1);
            
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar PDF. Tente novamente.');
        }
    });
}

// Fechar modal ao clicar no backdrop
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFn();
        }
    });
}

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
        closeModalFn();
    }
});

// Inicialização
(function init() {
    console.log('Inicializando sistema de etapas...');
    
    // Aguardar um pouco para garantir que o DOM está carregado
    setTimeout(() => {
        updateProgress();
        updateSteps();
        showStep(1);
        console.log('Sistema de etapas inicializado!');
    }, 100);
})();