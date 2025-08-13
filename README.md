# 🏆 CPM - Campeonato Paulista de MamoBall

Site moderno e funcional para inscrições de times no Campeonato Paulista de MamoBall.

## ✨ Funcionalidades Implementadas

### 🎨 Interface Moderna
- **Design minimalista** com gradientes e sombras elegantes
- **Ícones SVG** modernos substituindo emojis
- **Interface responsiva** para todos os dispositivos
- **Animações suaves** e transições elegantes
- **Paleta de cores** profissional e consistente

### 📝 Sistema de Inscrição Completo
- **Upload de imagem** suportando PNG, JPG e WebP
- **Validação completa** de todos os campos obrigatórios
- **Gestão de jogadores** com 6-10 jogadores por time
- **Posições de jogadores** (GL, VL, PV)
- **Campos opcionais** para técnico e observações

### 📄 Geração Automática de PDF
- **PDF profissional** com todos os dados da inscrição
- **Layout organizado** e fácil de ler
- **Informações completas** do time e jogadores
- **Data e hora** da inscrição
- **Formatação** adequada para impressão

### 📱 Integração com WhatsApp
- **Redirecionamento automático** para WhatsApp
- **Mensagem pré-formatada** com resumo da inscrição
- **Número configurado**: +55 11 98672-4226
- **Envio do PDF** como anexo
- **Processo simplificado** para o usuário

## 🚀 Como Usar

### 1. Página Principal
- Acesse `index.html` para ver a página principal
- Interface moderna com informações sobre o campeonato
- Botões para inscrição e comunidade WhatsApp

### 2. Inscrição de Time
- Clique em "Inscreva seu Time" ou acesse `inscricao.html`
- Preencha todos os campos obrigatórios:
  - **Nome do Clube** (obrigatório)
  - **Dono** (obrigatório)
  - **Capitão** (obrigatório)
  - **Técnico** (opcional)
  - **Observações** (opcional)

### 3. Upload da Logo
- Clique em "Escolher arquivo" ou arraste uma imagem
- Formatos aceitos: PNG, JPG, WebP
- Tamanho máximo: 5MB
- Preview em tempo real da imagem

### 4. Adicionar Jogadores
- **Mínimo**: 6 jogadores
- **Máximo**: 10 jogadores
- Para cada jogador:
  - **ID** (obrigatório)
  - **Nick** (obrigatório)
  - **Posições** (marcar pelo menos uma)
    - GL (Goleiro)
    - VL (Volante)
    - PV (Ponta/Voleante)

### 5. Finalizar Inscrição
- Clique em "Finalizar Inscrição"
- O sistema validará todos os campos
- Um PDF será gerado automaticamente
- Modal de sucesso será exibido

### 6. Enviar para WhatsApp
- Clique em "Enviar para WhatsApp"
- Você será redirecionado para o WhatsApp
- Número: +55 11 98672-4226
- Mensagem pré-formatada será exibida
- PDF estará disponível para anexar

## 🛠️ Tecnologias Utilizadas

- **HTML5** semântico e acessível
- **CSS3** com variáveis CSS e gradientes
- **JavaScript ES6+** para funcionalidades
- **jsPDF** para geração de PDFs
- **Ícones SVG** para interface moderna
- **Design responsivo** para todos os dispositivos

## 📁 Estrutura de Arquivos

```
cpm-website/
├── index.html          # Página principal
├── inscricao.html      # Página de inscrição
├── styles.css          # Estilos principais
├── inscricao.css       # Estilos da inscrição
├── app.js              # JavaScript da inscrição
├── script.js           # JavaScript principal
├── cpm.png             # Logo do campeonato
├── test.html           # Página de testes
└── README.md           # Este arquivo
```

## 🔧 Configurações

### Número do WhatsApp
O número está configurado no arquivo `app.js`:
```javascript
const WHATSAPP_NUMBER = '+5511986724226';
```

### Tipos de Arquivo Aceitos
```javascript
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
```

### Tamanho Máximo de Arquivo
```javascript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
```

## 📱 Responsividade

O site é totalmente responsivo e funciona em:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎯 Validações Implementadas

- ✅ Campos obrigatórios preenchidos
- ✅ Número correto de jogadores (6-10)
- ✅ Dados completos de cada jogador
- ✅ Logo do clube carregada
- ✅ Formato e tamanho de arquivo válidos
- ✅ Posições marcadas para cada jogador

## 🚨 Tratamento de Erros

- **Validação em tempo real** dos campos
- **Mensagens de erro** claras e específicas
- **Prevenção de envio** com dados inválidos
- **Feedback visual** para o usuário
- **Tratamento de exceções** na geração de PDF

## 🔒 Segurança

- **Validação client-side** para melhor UX
- **Sanitização** de dados de entrada
- **Prevenção de XSS** através de escape adequado
- **Validação de tipos** de arquivo
- **Limitação de tamanho** de arquivo

## 📊 Funcionalidades do PDF

O PDF gerado inclui:
- Cabeçalho com título e subtítulo
- Dados completos do clube
- Lista de todos os jogadores com posições
- Data e hora da inscrição
- Formatação profissional para impressão

## 🌟 Recursos Visuais

- **Gradientes modernos** em botões e badges
- **Sombras elegantes** para profundidade
- **Animações suaves** de hover e transições
- **Ícones SVG** consistentes e escaláveis
- **Paleta de cores** harmoniosa e profissional

## 📞 Suporte

Para dúvidas ou problemas:
- **WhatsApp**: +55 11 98672-4226
- **Email**: contato***@gmail.com

## 📝 Licença

© 2025 CPM - Campeonato Paulista de MamoBall. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para a comunidade MamoBall**