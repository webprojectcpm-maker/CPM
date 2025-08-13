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

// Helpers
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'flex';
}

function hideError(element) {
    element.style.display = 'none';
}

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
}

function updateSteps() {
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum === currentStep) {
            step.classList.add('active');
        } else if (stepNum < currentStep) {
            step.classList.add('completed');
        }
    });
}

function showStep(stepNumber) {
    // Esconder todas as etapas
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Mostrar etapa atual
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Atualizar estado
    currentStep = stepNumber;
    updateProgress();
    updateSteps();
}

function validateStep(stepNumber) {
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
    if (!logoInput.files[0]) {
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
    
    const name = document.getElementById('clubName').value.trim();
    const owner = document.getElementById('owner').value.trim();
    const captain = document.getElementById('captain').value.trim();
    
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
    const count = playersEl.children.length;
    if (count < 6 || count > 10) {
        return false;
    }
    
    for (const card of playersEl.children) {
        const inputs = card.querySelectorAll('input[type="text"]');
        const id = inputs[0].value.trim();
        const nick = inputs[1].value.trim();
        const checkboxes = card.querySelectorAll('input[type="checkbox"]');
        const anyPos = Array.from(checkboxes).some(cb => cb.checked);
        
        if (!id || !nick || !anyPos) {
            return false;
        }
    }
    
    return true;
}

// Upload de arquivo
chooseFile.addEventListener('click', () => logoInput.click());
changeFile.addEventListener('click', () => logoInput.click());
logoInput.addEventListener('change', handleFileSelect);

removeFile.addEventListener('click', () => {
    logoInput.value = '';
    uploadContent.style.display = 'flex';
    uploadPreview.style.display = 'none';
    hideError(logoError);
    nextStep1.disabled = true;
});

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!ACCEPTED_TYPES.includes(file.type)) {
        showError(logoError, 'Tipo de arquivo inválido. Use PNG, JPG ou WebP.');
        logoInput.value = '';
        nextStep1.disabled = true;
        return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
        showError(logoError, 'Arquivo muito grande. Máximo 5MB.');
        logoInput.value = '';
        nextStep1.disabled = true;
        return;
    }
    
    hideError(logoError);
    nextStep1.disabled = false;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
        logoPreview.src = ev.target.result;
        uploadContent.style.display = 'none';
        uploadPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Drag and drop
uploadContent.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadContent.style.borderColor = 'var(--secondary)';
    uploadContent.style.background = 'var(--bg-primary)';
});

uploadContent.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadContent.style.borderColor = 'var(--border)';
    uploadContent.style.background = 'var(--bg-secondary)';
});

uploadContent.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadContent.style.borderColor = 'var(--border)';
    uploadContent.style.background = 'var(--bg-secondary)';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        logoInput.files = files;
        handleFileSelect({ target: { files } });
    }
});

// Navegação entre etapas
nextStep1.addEventListener('click', () => {
    if (validateStep(1)) {
        showStep(2);
    }
});

nextStep2.addEventListener('click', () => {
    if (validateStep(2)) {
        showStep(3);
    }
});

nextStep3.addEventListener('click', () => {
    if (validateStep(3)) {
        showStep(4);
        populateReview();
    }
});

prevStep2.addEventListener('click', () => showStep(1));
prevStep3.addEventListener('click', () => showStep(2));
prevStep4.addEventListener('click', () => showStep(3));

// Validação em tempo real para etapa 2
document.getElementById('clubName').addEventListener('input', () => {
    const isValid = validateClubData();
    nextStep2.disabled = !isValid;
});

document.getElementById('owner').addEventListener('input', () => {
    const isValid = validateClubData();
    nextStep2.disabled = !isValid;
});

document.getElementById('captain').addEventListener('input', () => {
    const isValid = validateClubData();
    nextStep2.disabled = !isValid;
});

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
    removeBtn.addEventListener('click', () => removePlayer(card));
    
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
    nextStep3.disabled = !isValid;
}

function updatePlayersCount() {
    const count = playersEl.children.length;
    playersCounter.textContent = `${count} de 10`;
    addPlayerBtn.disabled = count >= 10;
    validatePlayersStep();
}

function addPlayer(data) {
    const count = playersEl.children.length;
    if (count >= 10) return;
    
    const playerCard = createPlayerCard(count, data);
    playersEl.appendChild(playerCard);
    updatePlayersCount();
}

function removePlayer(card) {
    const count = playersEl.children.length;
    if (count <= 6) {
        alert('É necessário ao menos 6 jogadores.');
        return;
    }
    
    card.remove();
    
    // Reindexar
    Array.from(playersEl.children).forEach((child, i) => {
        child.dataset.index = i;
        child.querySelector('.player-number').textContent = i + 1;
    });
    
    updatePlayersCount();
}

addPlayerBtn.addEventListener('click', () => addPlayer());

// Inicializar com 6 jogadores vazios
for (let i = 0; i < 6; i++) {
    addPlayer();
}

// Populate review
function populateReview() {
    // Logo
    document.getElementById('reviewLogo').src = logoPreview.src;
    
    // Dados do clube
    document.getElementById('reviewName').textContent = document.getElementById('clubName').value.trim();
    document.getElementById('reviewOwner').textContent = document.getElementById('owner').value.trim();
    document.getElementById('reviewCaptain').textContent = document.getElementById('captain').value.trim();
    
    const coach = document.getElementById('coach').value.trim();
    if (coach) {
        document.getElementById('reviewCoach').textContent = coach;
        document.getElementById('reviewCoachItem').style.display = 'flex';
    }
    
    const notes = document.getElementById('notes').value.trim();
    if (notes) {
        document.getElementById('reviewNotes').textContent = notes;
        document.getElementById('reviewNotesItem').style.display = 'flex';
    }
    
    // Jogadores
    const reviewPlayers = document.getElementById('reviewPlayers');
    reviewPlayers.innerHTML = '';
    
    Array.from(playersEl.children).forEach((card, index) => {
        const inputs = card.querySelectorAll('input[type="text"]');
        const id = inputs[0].value.trim();
        const nick = inputs[1].value.trim();
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
        
        reviewPlayers.appendChild(playerDiv);
    });
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
teamForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(formError);
    
    if (!validateStep(4)) return;
    
    // Construir array de jogadores
    const players = Array.from(playersEl.children).map(card => {
        const inputs = card.querySelectorAll('input[type="text"]');
        const id = inputs[0].value.trim();
        const nick = inputs[1].value.trim();
        const positions = Array.from(card.querySelectorAll('input[type="checkbox"]'))
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        return { id, nick, positions };
    });
    
    // Preparar dados para PDF
    inscriptionData = {
        name: document.getElementById('clubName').value.trim(),
        owner: document.getElementById('owner').value.trim(),
        captain: document.getElementById('captain').value.trim(),
        coach: document.getElementById('coach').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        players: players,
        logo: logoInput.files[0]
    };
    
    // Mostrar modal de sucesso
    openModal('Inscrição finalizada!', 'Seus dados foram processados com sucesso! Um PDF foi gerado e você será redirecionado para o WhatsApp para enviar a inscrição.');
});

// Modal
function openModal(title, message) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMsg').textContent = message;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
}

function closeModalFn() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
}

closeModal.addEventListener('click', closeModalFn);

// Enviar para WhatsApp
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
        teamForm.reset();
        logoInput.value = '';
        uploadContent.style.display = 'flex';
        uploadPreview.style.display = 'none';
        playersEl.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            addPlayer();
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

// Fechar modal ao clicar no backdrop
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalFn();
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModalFn();
    }
});

// Inicialização
(function init() {
    updateProgress();
    updateSteps();
    showStep(1);
})();