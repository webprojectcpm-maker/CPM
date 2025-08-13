/**
 * CPM - Página de Inscrição
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * - Upload de imagem PNG/JPG/WebP
 * - Validação completa de formulário
 * - Geração automática de PDF
 * - Redirecionamento para WhatsApp
 * - Interface moderna e responsiva
 */

// Configurações
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const WHATSAPP_NUMBER = '+5511986724226';

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

// Dados da inscrição para PDF
let inscriptionData = null;

// Helpers
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'flex';
}

function hideError(element) {
    element.style.display = 'none';
}

function enableForm(enable) {
    const elements = teamForm.querySelectorAll('input, textarea, button');
    elements.forEach(el => {
        if (el !== removeFile && el !== changeFile) {
            el.disabled = !enable;
        }
    });
    chooseFile.disabled = !enable;
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
});

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!ACCEPTED_TYPES.includes(file.type)) {
        showError(logoError, 'Tipo de arquivo inválido. Use PNG, JPG ou WebP.');
        logoInput.value = '';
        return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
        showError(logoError, 'Arquivo muito grande. Máximo 5MB.');
        logoInput.value = '';
        return;
    }
    
    hideError(logoError);
    
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
    
    return card;
}

function updatePlayersCount() {
    const count = playersEl.children.length;
    playersCounter.textContent = `${count} de 10`;
    addPlayerBtn.disabled = count >= 10;
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

// Validações
function validateForm() {
    hideError(formError);
    
    // Validar campos obrigatórios
    const name = document.getElementById('clubName').value.trim();
    const owner = document.getElementById('owner').value.trim();
    const captain = document.getElementById('captain').value.trim();
    
    if (!name) {
        showError(document.getElementById('clubNameError'), 'Nome do clube é obrigatório');
        return false;
    } else {
        hideError(document.getElementById('clubNameError'));
    }
    
    if (!owner) {
        showError(document.getElementById('ownerError'), 'Nome do dono é obrigatório');
        return false;
    } else {
        hideError(document.getElementById('ownerError'));
    }
    
    if (!captain) {
        showError(document.getElementById('captainError'), 'Nome do capitão é obrigatório');
        return false;
    } else {
        hideError(document.getElementById('captainError'));
    }
    
    // Validar número de jogadores
    const count = playersEl.children.length;
    if (count < 6 || count > 10) {
        showError(formError, 'Número de jogadores inválido (6–10).');
        return false;
    }
    
    // Validar cada jogador
    for (const card of playersEl.children) {
        const inputs = card.querySelectorAll('input[type="text"]');
        const id = inputs[0].value.trim();
        const nick = inputs[1].value.trim();
        const checkboxes = card.querySelectorAll('input[type="checkbox"]');
        const anyPos = Array.from(checkboxes).some(cb => cb.checked);
        
        if (!id || !nick) {
            showError(formError, 'Cada jogador precisa de ID e Nick.');
            return false;
        }
        
        if (!anyPos) {
            showError(formError, 'Marque ao menos uma posição para cada jogador.');
            return false;
        }
    }
    
    // Validar logo
    if (!logoInput.files[0]) {
        showError(formError, 'A logo do clube é obrigatória.');
        return false;
    }
    
    const file = logoInput.files[0];
    if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
        showError(formError, 'Arquivo inválido. Veja os requisitos da logo.');
        return false;
    }
    
    return true;
}

// Geração de PDF
function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurações
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = 30;
    
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
}

// Envio do formulário
teamForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(formError);
    
    if (!validateForm()) return;
    
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
        const doc = generatePDF(inscriptionData);
        
        // Converter PDF para blob
        const pdfBlob = doc.output('blob');
        
        // Criar URL do blob
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Preparar mensagem para WhatsApp
        const message = `Olá! Gostaria de inscrever meu time "${inscriptionData.name}" no CPM - Campeonato Paulista de MamoBall.

Dados do time:
• Nome: ${inscriptionData.name}
• Dono: ${inscriptionData.owner}
• Capitão: ${inscriptionData.captain}
${inscriptionData.coach ? `• Técnico: ${inscriptionData.coach}` : ''}
• Jogadores: ${inscriptionData.players.length}

Segue o PDF com todos os detalhes da inscrição.`;

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
    enableForm(true);
})();