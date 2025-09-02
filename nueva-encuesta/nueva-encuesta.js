/*
 * LÓGICA DE LA APLICACIÓN DE ENCUESTAS
 * Este archivo contiene toda la funcionalidad JavaScript para el formulario
 */

// Base de datos de preguntas predefinidas organizadas por categorías
const questionLibraryData = [
  { id: 1, text: "¿Cómo calificarías la comunicación dentro del equipo?", category: "comunicacion", type: "scale" },
  { id: 2, text: "¿Se comparte la información importante con todos?", category: "comunicacion", type: "yesno" },
  { id: 3, text: "¿Qué aspectos mejorarías de la comunicación en el equipo?", category: "comunicacion", type: "text" },
  { id: 4, text: "¿Se resuelven los conflictos de manera constructiva?", category: "comunicacion", type: "scale" },
  { id: 5, text: "¿Existen canales de comunicación efectivos?", category: "comunicacion", type: "yesno" },
  { id: 6, text: "¿El líder proporciona retroalimentación clara y constructiva?", category: "liderazgo", type: "scale" },
  { id: 7, text: "¿El líder reconoce los logros del equipo?", category: "liderazgo", type: "yesno" },
  { id: 8, text: "¿Qué cualidades destacarías de tu líder?", category: "liderazgo", type: "text" },
  { id: 9, text: "¿El líder delega responsabilidades adecuadamente?", category: "liderazgo", type: "scale" },
  { id: 10, text: "¿El líder toma decisiones de manera efectiva?", category: "liderazgo", type: "scale" },
  { id: 11, text: "¿Los miembros del equipo colaboran efectivamente?", category: "trabajoEquipo", type: "scale" },
  { id: 12, text: "¿Participa activamente en las reuniones de equipo?", category: "trabajoEquipo", type: "yesno" },
  { id: 13, text: "¿Cómo podríamos mejorar el trabajo en equipo?", category: "trabajoEquipo", type: "text" },
  { id: 14, text: "¿Existe confianza entre los miembros del equipo?", category: "trabajoEquipo", type: "scale" },
  { id: 15, text: "¿Se fomenta un ambiente de colaboración?", category: "trabajoEquipo", type: "yesno" },
  { id: 16, text: "¿Posee las habilidades técnicas necesarias para su puesto?", category: "habilidades", type: "scale" },
  { id: 17, text: "¿Está satisfecho con las oportunidades de desarrollo?", category: "habilidades", type: "yesno" },
  { id: 18, text: "¿Qué habilidades te gustaría desarrollar?", category: "habilidades", type: "text" },
  { id: 19, text: "¿Mantiene sus conocimientos actualizados?", category: "habilidades", type: "scale" },
  { id: 20, text: "¿Aplica sus conocimientos de manera efectiva?", category: "habilidades", type: "scale" },
  { id: 21, text: "¿Muestra compromiso con los valores de la organización?", category: "valores", type: "scale" },
  { id: 22, text: "¿Respeta la diversidad de opiniones y personas?", category: "valores", type: "yesno" },
  { id: 23, text: "¿Qué valores consideras que debemos fortalecer?", category: "valores", type: "text" },
  { id: 24, text: "¿Actúa con integridad en todas las situaciones?", category: "valores", type: "scale" },
  { id: 25, text: "¿La organización promueve un ambiente ético?", category: "valores", type: "yesno" }
];

// Base de datos de personas disponibles para asignar encuestas
const individualsDatabase = [
  { id: 1, name: "Juan Pérez", department: "Ventas", email: "juan.perez@empresa.com" },
  { id: 2, name: "María García", department: "Ventas", email: "maria.garcia@empresa.com" },
  { id: 3, name: "Jorge Sánchez", department: "Ventas", email: "jorge.sanchez@empresa.com" },
  { id: 4, name: "Ana López", department: "Ventas", email: "ana.lopez@empresa.com" },
  { id: 5, name: "Carlos López", department: "TI", email: "carlos.lopez@empresa.com" },
  { id: 6, name: "Ana Martínez", department: "TI", email: "ana.martinez@empresa.com" },
  { id: 7, name: "Elena Castro", department: "TI", email: "elena.castro@empresa.com" },
  { id: 8, name: "Pedro Rodríguez", department: "RH", email: "pedro.rodriguez@empresa.com" },
  { id: 9, name: "Laura Hernández", department: "RH", email: "laura.hernandez@empresa.com" },
  { id: 10, name: "Miguel Díaz", department: "Gerencia", email: "miguel.diaz@empresa.com" },
  { id: 11, name: "Sofía Ruiz", department: "Gerencia", email: "sofia.ruiz@empresa.com" }
];

// Datos de los departamentos y personas
const departmentData = {
  'Ventas': {
    name: 'Ventas',
    people: [
      { id: 1, name: 'Juan Pérez', email: 'juan.perez@empresa.com', excluded: false },
      { id: 2, name: 'María García', email: 'maria.garcia@empresa.com', excluded: false },
      { id: 3, name: 'Jorge Sánchez', email: 'jorge.sanchez@empresa.com', excluded: false },
      { id: 4, name: 'Ana López', email: 'ana.lopez@empresa.com', excluded: false }
    ]
  },
  'TI': {
    name: 'TI',
    people: [
      { id: 5, name: 'Carlos López', email: 'carlos.lopez@empresa.com', excluded: false },
      { id: 6, name: 'Ana Martínez', email: 'ana.martinez@empresa.com', excluded: false },
      { id: 7, name: 'Elena Castro', email: 'elena.castro@empresa.com', excluded: false }
    ]
  },
  'RH': {
    name: 'RH',
    people: [
      { id: 8, name: 'Pedro Rodríguez', email: 'pedro.rodriguez@empresa.com', excluded: false },
      { id: 9, name: 'Laura Hernández', email: 'laura.hernandez@empresa.com', excluded: false }
    ]
  },
  'Gerencia': {
    name: 'Gerencia',
    people: [
      { id: 10, name: 'Miguel Díaz', email: 'miguel.diaz@empresa.com', excluded: false },
      { id: 11, name: 'Sofía Ruiz', email: 'sofia.ruiz@empresa.com', excluded: false }
    ]
  }
};

// Mapa para corregir el case de los nombres de departamentos
const deptNameMap = {
  'ventas': 'Ventas',
  'ti': 'TI',
  'rh': 'RH',
  'gerencia': 'Gerencia'
};

// Estado de la aplicación para departamentos
const departmentState = {
  selectedDepartments: [],
  excludedPeople: []
};

// Variables globales
let questionCounter = 0;
let selectedQuestions = new Set();
let selectedIndividuals = [];

/**
 * Carga la biblioteca de preguntas en el contenedor correspondiente
 */
function loadQuestionLibrary() {
  const libraryContainer = document.getElementById('questionLibrary');
  if (!libraryContainer) {
    console.error('Contenedor de biblioteca de preguntas no encontrado');
    return;
  }
  
  libraryContainer.innerHTML = '';
  
  const category = document.getElementById('categoryFilter')?.value || 'all';
  const searchTerm = document.getElementById('questionSearch')?.value.toLowerCase() || '';
  
  const filteredQuestions = questionLibraryData.filter(question => {
    const categoryMatch = category === 'all' || question.category === category;
    const searchMatch = searchTerm === '' || 
                       question.text.toLowerCase().includes(searchTerm) || 
                       getCategoryName(question.category).toLowerCase().includes(searchTerm);
    return categoryMatch && searchMatch;
  });
  
  if (filteredQuestions.length === 0) {
    libraryContainer.innerHTML = '<div class="no-results">No se encontraron preguntas que coincidan con los criterios de búsqueda.</div>';
    return;
  }
  
  filteredQuestions.forEach(question => {
    const questionElement = document.createElement('div');
    questionElement.className = 'library-item';
    questionElement.innerHTML = `
      <input type="checkbox" id="lib-${question.id}" value="${question.id}" aria-label="Seleccionar pregunta: ${question.text}">
      <label for="lib-${question.id}">${question.text} <small>(${getCategoryName(question.category)})</small></label>
    `;
    libraryContainer.appendChild(questionElement);
  });
}

/**
 * Convierte el identificador de categoría en un nombre legible
 */
function getCategoryName(category) {
  const categories = {
    'comunicacion': 'Comunicación',
    'liderazgo': 'Liderazgo',
    'trabajoEquipo': 'Trabajo en Equipo',
    'habilidades': 'Habilidades',
    'valores': 'Valores'
  };
  return categories[category] || category;
}

/**
 * Filtra las preguntas mostradas según la categoría y término de búsqueda
 */
function filterQuestions() {
  loadQuestionLibrary();
}

/**
 * Realiza una búsqueda rápida al hacer clic en una etiqueta
 */
function quickSearch(term) {
  const searchInput = document.getElementById('questionSearch');
  if (searchInput) {
    searchInput.value = term;
    document.getElementById('categoryFilter').value = 'all';
    filterQuestions();
  }
}

/**
 * Alterna la selección de una pregunta en la biblioteca
 */
function toggleQuestion(id) {
  if (selectedQuestions.has(id)) {
    selectedQuestions.delete(id);
  } else {
    selectedQuestions.add(id);
  }
}

/**
 * Agrega todas las preguntas seleccionadas al formulario
 */
function addSelectedQuestions() {
  if (selectedQuestions.size === 0) {
    alert('Por favor, selecciona al menos una pregunta de la biblioteca.');
    return;
  }
  
  selectedQuestions.forEach(id => {
    const question = questionLibraryData.find(q => q.id === id);
    if (question) {
      addQuestionFromLibrary(question);
    }
  });
  
  selectedQuestions.clear();
  document.querySelectorAll('#questionLibrary input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  alert('Preguntas agregadas correctamente.');
}

/**
 * Agrega una pregunta desde la biblioteca al formulario
 */
function addQuestionFromLibrary(question) {
  questionCounter++;
  
  const questionsContainer = document.getElementById('questionsContainer');
  if (!questionsContainer) return;
  
  const questionDiv = document.createElement('div');
  questionDiv.className = 'question-item';
  questionDiv.id = `question-${questionCounter}`;
  
  questionDiv.innerHTML = `
    <span class="remove-question" data-action="remove-question" data-id="${questionCounter}" aria-label="Eliminar pregunta ${questionCounter}">
      <i class="fas fa-times"></i>
    </span>
    <div class="form-group">
      <label for="question-text-${questionCounter}">Pregunta ${questionCounter}</label>
      <input type="text" id="question-text-${questionCounter}" value="${question.text}" required aria-required="true">
    </div>
    <div class="form-group">
      <label>Tipo de respuesta</label>
      <select id="question-type-${questionCounter}" aria-label="Tipo de respuesta para la pregunta ${questionCounter}">
        <option value="scale" ${question.type === 'scale' ? 'selected' : ''}>Escala (1-5)</option>
        <option value="yesno" ${question.type === 'yesno' ? 'selected' : ''}>Sí/No</option>
        <option value="text" ${question.type === 'text' ? 'selected' : ''}>Texto abierto</option>
        <option value="multiple">Opción múltiple</option>
      </select>
    </div>
    <div id="question-options-${questionCounter}" class="options-container" style="display: none;">
      <div class="form-group">
        <label>Opciones</label>
        <div class="option-list" id="option-list-${questionCounter}"></div>
        <button type="button" class="btn small" data-action="add-option" data-id="${questionCounter}" aria-label="Agregar opción a la pregunta ${questionCounter}">
          <i class="fas fa-plus"></i> Agregar Opción
        </button>
      </div>
    </div>
  `;
  
  questionsContainer.appendChild(questionDiv);
  
  if (question.type === 'multiple') {
    changeAnswerType(questionCounter);
  }
}

/**
 * Agrega una nueva pregunta personalizada al formulario
 */
function addQuestion() {
  questionCounter++;
  
  const questionsContainer = document.getElementById('questionsContainer');
  if (!questionsContainer) return;
  
  const questionDiv = document.createElement('div');
  questionDiv.className = 'question-item';
  questionDiv.id = `question-${questionCounter}`;
  
  questionDiv.innerHTML = `
    <span class="remove-question" data-action="remove-question" data-id="${questionCounter}" aria-label="Eliminar pregunta ${questionCounter}">
      <i class="fas fa-times"></i>
    </span>
    <div class="form-group">
      <label for="question-text-${questionCounter}">Pregunta ${questionCounter}</label>
      <input type="text" id="question-text-${questionCounter}" placeholder="Escribe tu pregunta aquí" required aria-required="true">
    </div>
    <div class="form-group">
      <label>Tipo de respuesta</label>
      <select id="question-type-${questionCounter}" aria-label="Tipo de respuesta para la pregunta ${questionCounter}">
        <option value="scale">Escala (1-5)</option>
        <option value="yesno">Sí/No</option>
        <option value="text">Texto abierto</option>
        <option value="multiple">Opción múltiple</option>
      </select>
    </div>
    <div id="question-options-${questionCounter}" class="options-container" style="display: none;">
      <div class="form-group">
        <label>Opciones</label>
        <div class="option-list" id="option-list-${questionCounter}"></div>
        <button type="button" class="btn small" data-action="add-option" data-id="${questionCounter}" aria-label="Agregar opción a la pregunta ${questionCounter}">
          <i class="fas fa-plus"></i> Agregar Opción
        </button>
      </div>
    </div>
  `;
  
  questionsContainer.appendChild(questionDiv);
}

/**
 * Elimina una pregunta del formulario
 */
function removeQuestion(id) {
  const questionToRemove = document.getElementById(`question-${id}`);
  if (questionToRemove) {
    questionToRemove.remove();
    renumberQuestions();
  }
}

/**
 * Renumera las preguntas después de eliminar alguna
 */
function renumberQuestions() {
  const questions = document.querySelectorAll('.question-item');
  questionCounter = questions.length;
  
  questions.forEach((question, index) => {
    const questionNumber = index + 1;
    const label = question.querySelector('label');
    if (label) {
      label.textContent = `Pregunta ${questionNumber}`;
      label.setAttribute('for', `question-text-${questionNumber}`);
    }
    question.id = `question-${questionNumber}`;
    const input = question.querySelector('input');
    input.id = `question-text-${questionNumber}`;
    const select = question.querySelector('select');
    select.id = `question-type-${questionNumber}`;
    select.setAttribute('aria-label', `Tipo de respuesta para la pregunta ${questionNumber}`);
    const optionsContainer = question.querySelector('.options-container');
    optionsContainer.id = `question-options-${questionNumber}`;
    const optionList = question.querySelector('.option-list');
    optionList.id = `option-list-${questionNumber}`;
    const addOptionBtn = question.querySelector('[data-action="add-option"]');
    addOptionBtn.setAttribute('data-id', questionNumber);
    addOptionBtn.setAttribute('aria-label', `Agregar opción a la pregunta ${questionNumber}`);
    const removeBtn = question.querySelector('[data-action="remove-question"]');
    removeBtn.setAttribute('data-id', questionNumber);
    removeBtn.setAttribute('aria-label', `Eliminar pregunta ${questionNumber}`);
  });
}

/**
 * Cambia la interfaz según el tipo de respuesta seleccionado
 */
function changeAnswerType(questionId) {
  const optionsContainer = document.getElementById(`question-options-${questionId}`);
  const answerType = document.getElementById(`question-type-${questionId}`)?.value;
  
  if (!optionsContainer) return;
  
  if (answerType === 'multiple') {
    optionsContainer.style.display = 'block';
    const optionList = document.getElementById(`option-list-${questionId}`);
    if (optionList.children.length === 0) {
      addOption(questionId);
      addOption(questionId);
    }
  } else {
    optionsContainer.style.display = 'none';
  }
}

/**
 * Agrega una opción a una pregunta de opción múltiple
 */
function addOption(questionId) {
  const optionList = document.getElementById(`option-list-${questionId}`);
  if (!optionList) return;
  
  const optionCount = optionList.children.length + 1;
  
  const optionDiv = document.createElement('div');
  optionDiv.className = 'option-item';
  optionDiv.innerHTML = `
    <input type="text" placeholder="Opción ${optionCount}" required aria-label="Opción ${optionCount} para la pregunta ${questionId}">
    <button type="button" class="btn small danger" data-action="remove-option" aria-label="Eliminar opción ${optionCount}">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  optionList.appendChild(optionDiv);
}

/**
 * Elimina una opción de una pregunta de opción múltiple
 */
function removeOption(button) {
  button.parentElement.remove();
}

/**
 * Guarda la encuesta actual como plantilla
 */
function saveAsTemplate() {
  const surveyNameInput = document.getElementById('surveyName');
  const surveyName = surveyNameInput?.value;
  if (!surveyName) {
    alert('Por favor, ingresa un nombre para la encuesta antes de guardarla como plantilla.');
    surveyNameInput?.classList.add('invalid');
    return;
  }
  
  const questions = gatherQuestionsData();
  if (questions.length === 0) {
    alert('La plantilla debe contener al menos una pregunta.');
    return;
  }
  
  const participantsType = document.querySelector('input[name="participantsType"]:checked')?.value;
  if (!participantsType) {
    alert('Por favor, selecciona un tipo de participantes.');
    return;
  }
  
  let participantsData = [];
  if (participantsType === 'departments') {
    const deptCheckboxes = document.querySelectorAll('input[name="departments"]:checked');
    participantsData = Array.from(deptCheckboxes).map(checkbox => ({
      type: 'department',
      name: checkbox.value,
      excluded: departmentData[checkbox.value].people
        .filter(p => p.excluded)
        .map(p => ({ id: p.id, name: p.name, email: p.email }))
    }));
    if (participantsData.length === 0) {
      alert('Debes seleccionar al menos un departamento.');
      return;
    }
  } else {
    participantsData = selectedIndividuals.map(ind => ({
      type: 'individual',
      id: ind.id,
      name: ind.name,
      department: ind.department,
      email: ind.email
    }));
    if (participantsData.length === 0) {
      alert('Debes seleccionar al menos una persona.');
      return;
    }
  }
  
  const surveyData = {
    id: Date.now(),
    name: surveyName,
    description: document.getElementById('surveyDescription')?.value || '',
    evalType: document.querySelector('input[name="evalType"]:checked')?.value || '0',
    participantsType: participantsType,
    participants: participantsData,
    questions: questions,
    createdAt: new Date().toISOString(),
    questionCount: questions.length
  };
  
  let surveyTemplates = JSON.parse(localStorage.getItem('surveyTemplates')) || [];
  const existingIndex = surveyTemplates.findIndex(t => t.name === surveyName);
  if (existingIndex !== -1) {
    if (!confirm(`Ya existe una plantilla llamada "${surveyName}". ¿Deseas reemplazarla?`)) {
      return;
    }
    surveyTemplates[existingIndex] = surveyData;
  } else {
    surveyTemplates.push(surveyData);
  }
  
  localStorage.setItem('surveyTemplates', JSON.stringify(surveyTemplates));
  alert(`Plantilla "${surveyName}" guardada correctamente con ${questions.length} preguntas.`);
  
  if (window.location.pathname.includes('plantillas.html')) {
    loadTemplates();
  }
}

/**
 * Recopila los datos de todas las preguntas del formulario
 */
function gatherQuestionsData() {
  const questions = [];
  document.querySelectorAll('.question-item').forEach(questionEl => {
    const questionText = questionEl.querySelector('input[type="text"]')?.value;
    const questionType = questionEl.querySelector('select')?.value;
    
    if (questionText?.trim()) {
      const questionData = {
        text: questionText,
        type: questionType
      };
      
      if (questionType === 'multiple') {
        questionData.options = gatherOptionsData(questionEl);
      }
      
      questions.push(questionData);
    }
  });
  return questions;
}

/**
 * Recopila las opciones de una pregunta de opción múltiple
 */
function gatherOptionsData(questionEl) {
  const options = [];
  questionEl.querySelectorAll('.option-item input').forEach(optionInput => {
    if (optionInput.value.trim()) {
      options.push(optionInput.value);
    }
  });
  return options;
}

/**
 * Carga las plantillas en la página de plantillas
 */
function loadTemplates() {
  return new Promise((resolve, reject) => {
    const templatesContainer = document.getElementById('templatesContainer');
    const noTemplatesMessage = document.getElementById('noTemplatesMessage');
    const templateCount = document.getElementById('templateCount');
    const pageNum = document.getElementById('pageNum');
    const totalPages = document.getElementById('totalPages');
    const pagination = document.getElementById('pagination');

    try {
      surveyTemplates = JSON.parse(localStorage.getItem('surveyTemplates')) || [];
      if (!Array.isArray(surveyTemplates)) surveyTemplates = [];
    } catch (e) {
      surveyTemplates = [];
      console.error('Error parsing surveyTemplates:', e);
      reject(e);
      return;
    }

    // Actualizar contador
    templateCount.textContent = `Total: ${surveyTemplates.length} plantilla${surveyTemplates.length !== 1 ? 's' : ''}`;

    // Obtener criterios de ordenamiento y búsqueda
    const sortBy = document.getElementById('sortTemplates').value;
    const searchTerm = document.getElementById('templateSearch').value.toLowerCase();

    // Filtrar y ordenar plantillas
    let filteredTemplates = surveyTemplates.filter(template => {
      return template.name.toLowerCase().includes(searchTerm);
    });

    filteredTemplates.sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    // Paginación
    const totalItems = filteredTemplates.length;
    const totalPagesCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
    currentPage = Math.min(Math.max(1, currentPage), totalPagesCount);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedTemplates = filteredTemplates.slice(start, end);

    pageNum.textContent = currentPage;
    totalPages.textContent = totalPagesCount;
    pagination.style.display = totalPagesCount > 1 ? 'block' : 'none';

    templatesContainer.innerHTML = '';

    if (paginatedTemplates.length === 0) {
      noTemplatesMessage.style.display = 'block';
    } else {
      noTemplatesMessage.style.display = 'none';
    }

    paginatedTemplates.forEach((template, index) => {
      const originalIndex = surveyTemplates.findIndex(t => t.id === template.id);
      const participantsText = template.participantsType === 'departments' 
        ? `${template.participants.length} departamentos` 
        : `${template.participants.length} personas`;

      const templateCard = document.createElement('div');
      templateCard.className = 'template-card';
      templateCard.innerHTML = `
        <h3>${template.name}</h3>
        <p>${template.description || 'Sin descripción'}</p>
        <div class="template-meta">
          <span>Creada: ${new Date(template.createdAt).toLocaleDateString()}</span>
          <span>${participantsText}</span>
        </div>
        <div class="template-stats">
          <span><i class="fas fa-question"></i> ${template.questionCount} preguntas</span>
          <span><i class="fas fa-chart-pie"></i> ${template.evalType}°</span>
        </div>
        <div class="template-actions">
          <button onclick="previewTemplate(${originalIndex})" class="btn preview small" aria-label="Vista previa de la plantilla ${template.name}">
            <i class="fas fa-eye"></i> Vista Previa
          </button>
          <button onclick="useTemplate(${originalIndex})" class="btn success small" aria-label="Usar plantilla ${template.name}">
            <i class="fas fa-play"></i> Usar
          </button>
          <button onclick="editTemplate(${originalIndex})" class="btn info small" aria-label="Editar plantilla ${template.name}">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button onclick="deleteTemplate(${originalIndex})" class="btn danger small" aria-label="Eliminar plantilla ${template.name}">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      `;
      templatesContainer.appendChild(templateCard);
    });

    resolve(); // Resolver la promesa al completar con éxito
  });
}

/**
 * Filtra plantillas según el término de búsqueda
 */
function filterTemplates() {
  currentPage = 1; // Resetear a la primera página al filtrar
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'block';
  loadTemplates().then(() => {
    if (loading) loading.style.display = 'none';
    console.log('Cargando oculto después de filtrar');
  }).catch(error => {
    console.error('Error en filterTemplates:', error);
    if (loading) loading.style.display = 'none';
    showStatus('Error al filtrar las plantillas. Intenta de nuevo.', 'red');
  });
}

/**
 * Muestra la vista previa de una plantilla como un formulario
 */
function previewTemplate(templateIndex) {
  const surveyTemplates = JSON.parse(localStorage.getItem('surveyTemplates')) || [];
  const template = surveyTemplates[templateIndex];
  if (!template) {
    showStatus('Error: Plantilla no encontrada.', 'red');
    return;
  }

  const previewContainer = document.getElementById('previewFormContainer');
  if (!previewContainer) return;

  previewContainer.innerHTML = `
    <div class="preview-form">
      <h2>${template.name}</h2>
      <p>${template.description || 'Sin descripción'}</p>
      <form class="survey-preview-form">
        ${template.questions.map((question, index) => `
          <div class="preview-question">
            <label class="preview-question-label">${index + 1}. ${question.text}</label>
            ${renderQuestionInput(question, index)}
          </div>
        `).join('')}
        <div class="form-actions">
          <button type="button" class="btn" onclick="closePreviewModal()">Cerrar</button>
        </div>
      </form>
    </div>
  `;

  const modal = document.getElementById('previewModal');
  if (modal) modal.style.display = 'block';
}

/**
 * Renderiza el campo de entrada para una pregunta según su tipo
 */
function renderQuestionInput(question, index) {
  switch (question.type) {
    case 'scale':
      return `
        <div class="radio-group">
          ${[1, 2, 3, 4, 5].map(value => `
            <label class="radio-option">
              <input type="radio" name="question-${index}" value="${value}" disabled aria-label="Calificación ${value}">
              <span class="radio-label">${value}</span>
            </label>
          `).join('')}
        </div>
        <small>Escala: 1 (Muy Malo) - 5 (Excelente)</small>
      `;
    case 'yesno':
      return `
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" name="question-${index}" value="yes" disabled aria-label="Sí">
            <span class="radio-label">Sí</span>
          </label>
          <label class="radio-option">
            <input type="radio" name="question-${index}" value="no" disabled aria-label="No">
            <span class="radio-label">No</span>
          </label>
        </div>
      `;
    case 'text':
      return `
        <textarea class="preview-textarea" placeholder="Escribe tu respuesta aquí..." disabled aria-label="Respuesta de texto para la pregunta ${index + 1}"></textarea>
      `;
    case 'multiple':
      return `
        <div class="radio-group">
          ${question.options.map((option, optIndex) => `
            <label class="radio-option">
              <input type="radio" name="question-${index}" value="${option}" disabled aria-label="${option}">
              <span class="radio-label">${option}</span>
            </label>
          `).join('')}
        </div>
      `;
    default:
      return '<p>Tipo de pregunta no soportado.</p>';
  }
}

/**
 * Cierra el modal de vista previa
 */
function closePreviewModal() {
  const modal = document.getElementById('previewModal');
  if (modal) modal.style.display = 'none';
}

/**
 * Usa una plantilla existente
 */
function useTemplate(templateIndex) {
  const template = surveyTemplates[templateIndex];
  if (template) {
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    window.location.href = 'index.html';
  }
}

/**
 * Edita una plantilla existente
 */
function editTemplate(templateIndex) {
  if (confirm('¿Editar esta plantilla? Se abrirá en modo de edición.')) {
    window.location.href = `index.html?editTemplate=${templateIndex}`;
  }
}

/**
 * Elimina una plantilla
 */
function deleteTemplate(templateIndex) {
  if (confirm('¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer.')) {
    surveyTemplates.splice(templateIndex, 1);
    localStorage.setItem('surveyTemplates', JSON.stringify(surveyTemplates));
    loadTemplates().then(() => {
      showStatus('Plantilla eliminada correctamente.', 'green');
    }).catch(error => {
      console.error('Error en deleteTemplate:', error);
      showStatus('Error al eliminar la plantilla.', 'red');
    });
  }
}

/**
 * Elimina todas las plantillas
 */
function clearAllTemplates() {
  if (surveyTemplates.length === 0) {
    showStatus('No hay plantillas para eliminar.', 'orange');
    return;
  }

  if (confirm('¿Estás seguro de que deseas eliminar TODAS las plantillas? Esta acción no se puede deshacer.')) {
    surveyTemplates = [];
    localStorage.setItem('surveyTemplates', JSON.stringify(surveyTemplates));
    loadTemplates().then(() => {
      showStatus('Todas las plantillas han sido eliminadas.', 'green');
    }).catch(error => {
      console.error('Error en clearAllTemplates:', error);
      showStatus('Error al eliminar todas las plantillas.', 'red');
    });
  }
}

/**
 * Simula el cierre de sesión del usuario
 */
function logout() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    showStatus('Sesión finalizada.', 'green');
    setTimeout(() => window.location.href = '../index.html', 1000);
  }
}

/**
 * Muestra un mensaje de estado temporal
 */
function showStatus(message, color) {
  const status = document.getElementById('statusMessage');
  status.textContent = message;
  status.style.color = color;
  status.style.display = 'block';
  setTimeout(() => status.style.display = 'none', 3000);
}

/**
 * Carga una plantilla en el formulario
 */
function loadTemplateIntoForm(templateIndex, isEditMode = false) {
  const surveyTemplates = JSON.parse(localStorage.getItem('surveyTemplates')) || [];
  const template = surveyTemplates[templateIndex];
  if (!template) return;
  
  // Guardar el índice de la plantilla que estamos editando
  if (isEditMode) {
    localStorage.setItem('editingTemplateIndex', templateIndex);
    toggleEditModeUI(true);
  }
  
  const surveyNameInput = document.getElementById('surveyName');
  if (surveyNameInput) {
    surveyNameInput.value = isEditMode ? template.name : template.name + ' - Copia';
    surveyNameInput.classList.remove('invalid');
  }
  
  document.getElementById('surveyDescription').value = template.description || '';
  
  // Seleccionar tipo de evaluación
  document.querySelectorAll('input[name="evalType"]').forEach(radio => {
    radio.checked = (radio.value === template.evalType);
  });
  
  if (template.participantsType) {
    const participantTypeInput = document.querySelector(`input[name="participantsType"][value="${template.participantsType}"]`);
    if (participantTypeInput) {
      participantTypeInput.checked = true;
      toggleParticipantsSelection();
    }
    
    if (template.participantsType === 'departments') {
      // Limpiar estado previo
      departmentState.selectedDepartments = [];
      departmentState.excludedPeople = [];
      Object.values(departmentData).forEach(dept => {
        dept.people.forEach(person => {
          person.excluded = false;
        });
      });
      
      template.participants.forEach(participant => {
        const deptCheckbox = document.getElementById(`dept-${participant.name.toLowerCase()}`);
        if (deptCheckbox) {
          deptCheckbox.checked = true;
          toggleDepartmentSelection(participant.name);
        }
        // Cargar personas excluidas
        if (participant.excluded) {
          participant.excluded.forEach(excludedPerson => {
            const person = departmentData[participant.name].people.find(p => p.id === excludedPerson.id);
            if (person) {
              person.excluded = true;
              departmentState.excludedPeople.push(excludedPerson.id);
              const excludeCheckbox = document.getElementById(`exclude-${participant.name.toLowerCase()}-${excludedPerson.id}`);
              if (excludeCheckbox) excludeCheckbox.checked = true;
            }
          });
        }
      });
      updateDepartmentSummary();
    } else {
      selectedIndividuals = template.participants.map(p => ({
        id: p.id,
        name: p.name,
        department: p.department,
        email: p.email
      }));
      renderSelectedIndividuals();
      loadIndividuals();
    }
  }
  
  const questionsContainer = document.getElementById('questionsContainer');
  if (questionsContainer) {
    questionsContainer.innerHTML = '';
    questionCounter = 0;
  }
  
  template.questions.forEach(question => {
    questionCounter++;
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.id = `question-${questionCounter}`;
    
    let optionsHTML = '';
    if (question.type === 'multiple' && question.options) {
      optionsHTML = `
        <div id="question-options-${questionCounter}" class="options-container" style="display: block;">
          <div class="form-group">
            <label>Opciones</label>
            <div class="option-list" id="option-list-${questionCounter}">
              ${question.options.map(option => `
                <div class="option-item">
                  <input type="text" value="${option}" required aria-label="Opción para la pregunta ${questionCounter}">
                  <button type="button" class="btn small danger" data-action="remove-option" aria-label="Eliminar opción">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              `).join('')}
            </div>
            <button type="button" class="btn small" data-action="add-option" data-id="${questionCounter}" aria-label="Agregar opción a la pregunta ${questionCounter}">
              <i class="fas fa-plus"></i> Agregar Opción
            </button>
          </div>
        </div>
      `;
    }
    
    questionDiv.innerHTML = `
      <span class="remove-question" data-action="remove-question" data-id="${questionCounter}" aria-label="Eliminar pregunta ${questionCounter}">
        <i class="fas fa-times"></i>
      </span>
      <div class="form-group">
        <label for="question-text-${questionCounter}">Pregunta ${questionCounter}</label>
        <input type="text" id="question-text-${questionCounter}" value="${question.text}" required aria-required="true">
      </div>
      <div class="form-group">
        <label>Tipo de respuesta</label>
        <select id="question-type-${questionCounter}" aria-label="Tipo de respuesta para la pregunta ${questionCounter}">
          <option value="scale" ${question.type === 'scale' ? 'selected' : ''}>Escala (1-5)</option>
          <option value="yesno" ${question.type === 'yesno' ? 'selected' : ''}>Sí/No</option>
          <option value="text" ${question.type === 'text' ? 'selected' : ''}>Texto abierto</option>
          <option value="multiple" ${question.type === 'multiple' ? 'selected' : ''}>Opción múltiple</option>
        </select>
      </div>
      ${optionsHTML}
    `;
    
    questionsContainer.appendChild(questionDiv);
  });
  
  if (!isEditMode) {
    alert(`Plantilla "${template.name}" cargada. Puedes modificarla antes de guardar.`);
  }
}

/**
 * Valida y envía el formulario
 */
function handleFormSubmit(e) {
  e.preventDefault();
  
  const startDate = new Date(document.getElementById('startDate')?.value);
  const endDate = new Date(document.getElementById('endDate')?.value);
  
  if (endDate < startDate) {
    alert('La fecha de fin no puede ser anterior a la fecha de inicio');
    return;
  }
  
  if (questionCounter === 0) {
    alert('Debes agregar al menos una pregunta');
    return;
  }
  
  const participantsType = document.querySelector('input[name="participantsType"]:checked')?.value;
  if (!participantsType) {
    alert('Por favor, selecciona un tipo de participantes.');
    return;
  }
  
  if (participantsType === 'departments') {
    if (departmentState.selectedDepartments.length === 0) {
      alert('Debes seleccionar al menos un departamento');
      return;
    }
    
    for (const deptName of departmentState.selectedDepartments) {
      const includedPeople = departmentData[deptName].people.filter(p => !p.excluded);
      if (includedPeople.length === 0) {
        alert(`El departamento ${deptName} no tiene personas incluidas. Deselecciona el departamento o incluye al menos una persona.`);
        return;
      }
    }
  } else {
    if (selectedIndividuals.length === 0) {
      alert('Debes seleccionar al menos una persona');
      return;
    }
  }
  
  const editingIndex = localStorage.getItem('editingTemplateIndex');
  const isEditing = editingIndex !== null;
  
  if (isEditing) {
    updateTemplate(parseInt(editingIndex));
    localStorage.removeItem('editingTemplateIndex');
    toggleEditModeUI(false);
  } else {
    saveAsTemplate();
  }
  
  alert('Encuesta ' + (isEditing ? 'actualizada' : 'guardada') + ' correctamente');
  window.location.href = '../administrador/index.html';
}

/**
 * Alterna entre la selección por departamentos y por individuos
 */
function toggleParticipantsSelection() {
  const participantsType = document.querySelector('input[name="participantsType"]:checked')?.value;
  const departmentSelection = document.getElementById('departmentSelection');
  const individualSelection = document.getElementById('individualSelection');
  
  if (!departmentSelection || !individualSelection) return;
  
  if (participantsType === 'departments') {
    departmentSelection.style.display = 'block';
    individualSelection.style.display = 'none';
    updateDepartmentSummary();
  } else {
    departmentSelection.style.display = 'none';
    individualSelection.style.display = 'block';
    loadIndividuals();
    renderSelectedIndividuals();
  }
}

/**
 * Carga la lista de individuos disponibles
 */
function loadIndividuals() {
  const individualsContainer = document.getElementById('individualsContainer');
  if (!individualsContainer) return;
  
  individualsContainer.innerHTML = '';
  
  const searchTerm = document.getElementById('individualSearch')?.value.toLowerCase() || '';
  
  const filteredIndividuals = individualsDatabase.filter(individual => {
    const searchMatch = searchTerm === '' || 
                       individual.name.toLowerCase().includes(searchTerm) || 
                       individual.department.toLowerCase().includes(searchTerm) ||
                       individual.email.toLowerCase().includes(searchTerm);
    return searchMatch;
  });
  
  if (filteredIndividuals.length === 0) {
    individualsContainer.innerHTML = '<div class="no-results">No se encontraron personas que coincidan con la búsqueda.</div>';
    return;
  }
  
  filteredIndividuals.forEach(individual => {
    const isSelected = selectedIndividuals.some(sel => sel.id === individual.id);
    const individualElement = document.createElement('div');
    individualElement.className = 'individual-item person-list-item';
    individualElement.innerHTML = `
      <input type="checkbox" id="ind-${individual.id}" value="${individual.id}" 
             ${isSelected ? 'checked' : ''} aria-label="Seleccionar ${individual.name}">
      <label for="ind-${individual.id}">
        <strong>${individual.name}</strong> - ${individual.department}<br>
        <small>${individual.email}</small>
      </label>
    `;
    individualsContainer.appendChild(individualElement);
  });
}

/**
 * Filtra la lista de individuos según el término de búsqueda
 */
function filterIndividuals() {
  loadIndividuals();
}

/**
 * Realiza una búsqueda rápida de individuos por departamento
 */
function quickIndividualSearch(department) {
  const searchInput = document.getElementById('individualSearch');
  if (searchInput) {
    searchInput.value = department;
    filterIndividuals();
  }
}

/**
 * Alterna la selección de un individuo
 */
function toggleIndividual(id) {
  const individual = individualsDatabase.find(ind => ind.id === id);
  if (!individual) return;

  const existingIndex = selectedIndividuals.findIndex(ind => ind.id === id);
  
  if (existingIndex === -1) {
    selectedIndividuals.push({...individual});
  } else {
    selectedIndividuals.splice(existingIndex, 1);
  }
  
  renderSelectedIndividuals();
  updateIndividualCheckboxes();
}

/**
 * Actualiza el estado de los checkboxes según las personas seleccionadas
 */
function updateIndividualCheckboxes() {
  individualsDatabase.forEach(individual => {
    const checkbox = document.getElementById(`ind-${individual.id}`);
    if (checkbox) {
      checkbox.checked = selectedIndividuals.some(sel => sel.id === individual.id);
    }
  });
}

/**
 * Renderiza la lista de individuos seleccionados
 */
function renderSelectedIndividuals() {
  const selectedContainer = document.getElementById('selectedIndividuals');
  const noSelectedMessage = document.getElementById('noSelectedMessageIndividual');
  
  if (!selectedContainer) return;
  
  if (selectedIndividuals.length === 0) {
    if (noSelectedMessage) noSelectedMessage.style.display = 'block';
    selectedContainer.innerHTML = '';
    return;
  }
  
  if (noSelectedMessage) noSelectedMessage.style.display = 'none';
  
  let html = '';
  selectedIndividuals.forEach(individual => {
    html += `
      <div class="selected-individual person-list-item" data-id="${individual.id}">
        <div class="selected-individual-info">
          <strong>${individual.name}</strong> - ${individual.department}
          <br>
          <small>${individual.email}</small>
        </div>
        <button type="button" class="btn small danger" data-action="remove-individual" data-id="${individual.id}" aria-label="Eliminar ${individual.name} de seleccionados">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  });
  
  selectedContainer.innerHTML = html;
}

/**
 * Elimina un individuo de la lista de seleccionados
 */
function removeIndividual(id) {
  const index = selectedIndividuals.findIndex(ind => ind.id === id);
  if (index !== -1) {
    selectedIndividuals.splice(index, 1);
    renderSelectedIndividuals();
    updateIndividualCheckboxes();
  }
}

/**
 * Actualiza el estado de una persona en un departamento
 */
function updateDepartmentPersonState(deptName, personId, isExcluded) {
  const person = departmentData[deptName]?.people.find(p => p.id === personId);
  if (!person) {
    console.error(`Persona con ID ${personId} no encontrada en ${deptName}`);
    return;
  }
  
  person.excluded = isExcluded;
  const index = departmentState.excludedPeople.indexOf(personId);
  if (isExcluded && index === -1) {
    departmentState.excludedPeople.push(personId);
  } else if (!isExcluded && index > -1) {
    departmentState.excludedPeople.splice(index, 1);
  }
  
  updateDepartmentSummary();
}

/**
 * Alternar la selección de un departamento
 */
function toggleDepartmentSelection(deptName) {
  const checkbox = document.getElementById(`dept-${deptName.toLowerCase()}`);
  const section = document.getElementById(`dept-section-${deptName.toLowerCase()}`);
  if (!checkbox || !section) return;
  
  if (checkbox.checked) {
    section.style.display = 'block';
    if (!departmentState.selectedDepartments.includes(deptName)) {
      departmentState.selectedDepartments.push(deptName);
    }
  } else {
    section.style.display = 'none';
    const content = document.getElementById(`content-${deptName.toLowerCase()}`);
    const icon = document.getElementById(`icon-${deptName.toLowerCase()}`);
    
    if (content.classList.contains('expanded')) {
      content.classList.remove('expanded');
      icon.classList.remove('fa-chevron-up');
      icon.classList.add('fa-chevron-down');
    }
    
    const index = departmentState.selectedDepartments.indexOf(deptName);
    if (index > -1) {
      departmentState.selectedDepartments.splice(index, 1);
    }
    
    departmentData[deptName].people.forEach(person => {
      person.excluded = false;
      const excludeCheckbox = document.getElementById(`exclude-${deptName.toLowerCase()}-${person.id}`);
      if (excludeCheckbox) {
        excludeCheckbox.checked = false;
      }
      const excludedIndex = departmentState.excludedPeople.indexOf(person.id);
      if (excludedIndex > -1) {
        departmentState.excludedPeople.splice(excludedIndex, 1);
      }
    });
  }
  
  updateDepartmentSummary();
}

/**
 * Alternar la visualización del contenido del departamento
 */
function toggleDepartmentExpand(deptId) {
  const content = document.getElementById(`content-${deptId}`);
  const icon = document.getElementById(`icon-${deptId}`);
  if (!content || !icon) return;
  
  content.classList.toggle('expanded');
  
  if (content.classList.contains('expanded')) {
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-up');
  } else {
    icon.classList.remove('fa-chevron-up');
    icon.classList.add('fa-chevron-down');
  }
}

/**
 * Alternar la exclusión de una persona
 */
function toggleExclusion(deptName, personId) {
  const checkbox = document.getElementById(`exclude-${deptName.toLowerCase()}-${personId}`);
  if (!checkbox) {
    console.error(`Checkbox exclude-${deptName.toLowerCase()}-${personId} no encontrado`);
    return;
  }
  
  updateDepartmentPersonState(deptName, personId, checkbox.checked);
}

/**
 * Actualizar el resumen de participantes
 */
function updateDepartmentSummary() {
  let totalPeople = 0;
  let excludedPeople = 0;
  
  // Calcular totales
  departmentState.selectedDepartments.forEach(deptName => {
    const department = departmentData[deptName];
    if (department) {
      totalPeople += department.people.length;
      excludedPeople += department.people.filter(p => p.excluded).length;
    }
  });
  
  const includedPeople = totalPeople - excludedPeople;
  
  const includedCount = document.getElementById('included-count');
  const excludedCount = document.getElementById('excluded-count');
  const departmentCount = document.getElementById('department-count');
  const selectedList = document.getElementById('selectedList');
  const noSelectedMessage = document.getElementById('noSelectedMessage');
  
  // Actualizar contadores
  if (includedCount) includedCount.textContent = includedPeople;
  if (excludedCount) excludedCount.textContent = excludedPeople;
  if (departmentCount) departmentCount.textContent = departmentState.selectedDepartments.length;
  
  // Actualizar lista de seleccionados
  if (!selectedList || !noSelectedMessage) return;
  
  if (departmentState.selectedDepartments.length === 0) {
    noSelectedMessage.style.display = 'block';
    selectedList.innerHTML = '';
    return;
  }
  
  noSelectedMessage.style.display = 'none';
  
  let html = '';
  departmentState.selectedDepartments.forEach(deptName => {
    const department = departmentData[deptName];
    const includedInDept = department.people.filter(p => !p.excluded);
    
    if (includedInDept.length > 0) {
      html += `<div class="department-summary">
                 <h4>${deptName} (${includedInDept.length} persona${includedInDept.length !== 1 ? 's' : ''})</h4>
                 <ul>`;
      
      includedInDept.forEach(person => {
        html += `<li>${person.name} - ${person.email}</li>`;
      });
      
      html += `</ul></div>`;
    }
  });
  
  selectedList.innerHTML = html;
}

/**
 * Configura los event listeners para elementos interactivos
 */
function setupEventListeners() {
  // Botones con data-action
  document.querySelectorAll('[data-action]').forEach(element => {
    element.addEventListener('click', () => {
      const action = element.dataset.action;
      const index = parseInt(element.dataset.index);
      const id = parseInt(element.dataset.id);
      const dept = element.dataset.dept;
      const term = element.dataset.term;
      
      if (action === 'logout') logout();
      if (action === 'use-template') window.location.href = 'plantillas.html';
      if (action === 'save-template') saveAsTemplate();
      if (action === 'cancel-form') cancelForm();
      if (action === 'add-question') addQuestion();
      if (action === 'add-selected-questions') addSelectedQuestions();
      if (action === 'remove-question') removeQuestion(id);
      if (action === 'add-option') addOption(id);
      if (action === 'remove-option') removeOption(element);
      if (action === 'use-template' && !isNaN(index)) useTemplate(index);
      if (action === 'edit-template' && !isNaN(index)) editTemplate(index);
      if (action === 'delete-template' && !isNaN(index)) deleteTemplate(index);
      if (action === 'toggle-expand' && dept) toggleDepartmentExpand(dept);
      if (action === 'quick-search' && dept) quickIndividualSearch(dept);
      if (action === 'quick-search' && term) quickSearch(term);
      if (action === 'remove-individual' && !isNaN(id)) removeIndividual(id);
    });
  });
  
  // Checkboxes de exclusión (usamos un solo listener en el contenedor)
  document.querySelectorAll('.department-section').forEach(section => {
    section.addEventListener('change', (e) => {
      if (e.target.matches('.exclude-checkbox')) {
        const [_, deptName, personId] = e.target.id.split('-');
        const lowerDeptName = deptName.toLowerCase();
        const formattedDeptName = deptNameMap[lowerDeptName];
        if (!formattedDeptName) {
          console.error(`Departamento no encontrado para ${lowerDeptName}`);
          return;
        }
        toggleExclusion(formattedDeptName, parseInt(personId));
      }
    });
  });
  
  // Checkboxes de departamentos
  document.querySelectorAll('input[name="departments"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      toggleDepartmentSelection(checkbox.value);
    });
  });
  
  // Checkboxes de individuos
  document.querySelectorAll('.individuals-container').forEach(container => {
    container.addEventListener('change', (e) => {
      if (e.target.matches('input[type="checkbox"]')) {
        const id = parseInt(e.target.value);
        toggleIndividual(id);
      }
    });
  });
  
  // Selección de tipo de participantes
  document.querySelectorAll('input[name="participantsType"]').forEach(radio => {
    radio.addEventListener('change', toggleParticipantsSelection);
  });
  
  // Búsqueda de preguntas
  const questionSearch = document.getElementById('questionSearch');
  if (questionSearch) questionSearch.addEventListener('input', filterQuestions);
  
  // Filtro de categorías
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) categoryFilter.addEventListener('change', filterQuestions);
  
  // Búsqueda de individuos
  const individualSearch = document.getElementById('individualSearch');
  if (individualSearch) individualSearch.addEventListener('input', filterIndividuals);
  
  // Selección de preguntas de la biblioteca
  document.getElementById('questionLibrary')?.addEventListener('change', (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
      toggleQuestion(parseInt(e.target.value));
    }
  });
  
  // Cambio de tipo de pregunta
  document.getElementById('questionsContainer')?.addEventListener('change', (e) => {
    if (e.target.matches('select[id^="question-type-"]')) {
      const id = parseInt(e.target.id.split('-')[2]);
      changeAnswerType(id);
    }
  });
  
  // Validación en tiempo real del nombre de la encuesta
  const surveyNameInput = document.getElementById('surveyName');
  if (surveyNameInput) {
    surveyNameInput.addEventListener('input', (e) => {
      if (e.target.value.trim() === '') {
        e.target.classList.add('invalid');
      } else {
        e.target.classList.remove('invalid');
      }
    });
  }
}

/**
 * Inicializa la aplicación
 */
function initApp() {
  requestAnimationFrame(() => {
    loadQuestionLibrary();
    
    const surveyForm = document.getElementById('surveyForm');
    if (surveyForm) surveyForm.addEventListener('submit', handleFormSubmit);
    
    selectedIndividuals = [];
    updateDepartmentSummary();
    
    const urlParams = new URLSearchParams(window.location.search);
    const templateIndex = urlParams.get('template');
    const editTemplateIndex = urlParams.get('editTemplate');
    
    if (templateIndex !== null) {
      loadTemplateIntoForm(parseInt(templateIndex), false); // Modo copia
    } else if (editTemplateIndex !== null) {
      loadTemplateIntoForm(parseInt(editTemplateIndex), true); // Modo edición
    } else {
      addQuestion(); // Modo nueva encuesta
      toggleEditModeUI(false);
    }
    
    if (window.location.pathname.includes('plantillas.html')) {
      loadTemplates();
    }
    
    if (document.getElementById('selectedIndividuals')) {
      renderSelectedIndividuals();
    }
    
    setupEventListeners();
  });
}

// Inicializar cuando se cargue la página
window.onload = initApp;

// Variables globales para plantillas
let surveyTemplates = [];
const ITEMS_PER_PAGE = 10;
let currentPage = 1;

/**
 * Cancela el formulario y regresa a la página de administración
 */
function cancelForm() {
  if (confirm('¿Estás seguro de que deseas cancelar? Los cambios no se guardarán.')) {
    window.location.href = '../administrador/index.html';
  }
}

/**
 * Alterna la interfaz de usuario para modo edición
 */
function toggleEditModeUI(isEditing) {
  const indicator = document.getElementById('editingIndicator');
  const submitButton = document.querySelector('button[type="submit"]');
  const saveTemplateBtn = document.querySelector('button[data-action="save-template"]');
  const useTemplateBtn = document.querySelector('button[data-action="use-template"]');
  
  if (indicator) {
    indicator.style.display = isEditing ? 'block' : 'none';
  }
  
  if (submitButton) {
    submitButton.innerHTML = isEditing ? 
      '<i class="fas fa-save"></i> Actualizar Plantilla' : 
      '<i class="fas fa-check"></i> Asignar Encuesta';
    submitButton.setAttribute('aria-label', isEditing ? 'Actualizar plantilla' : 'Asignar encuesta');
  }
  
  if (saveTemplateBtn) {
    saveTemplateBtn.style.display = isEditing ? 'none' : 'inline-flex';
  }
  
  if (useTemplateBtn) {
    useTemplateBtn.style.display = isEditing ? 'none' : 'inline-flex';
  }
}

/**
 * Actualiza una plantilla existente
 */
function updateTemplate(templateIndex) {
  const surveyTemplates = JSON.parse(localStorage.getItem('surveyTemplates')) || [];
  const updatedTemplate = gatherTemplateData();
  
  if (templateIndex >= 0 && templateIndex < surveyTemplates.length) {
    surveyTemplates[templateIndex] = {
      ...updatedTemplate,
      id: surveyTemplates[templateIndex].id, // Mantener el ID original
      createdAt: surveyTemplates[templateIndex].createdAt, // Mantener fecha creación
      updatedAt: new Date().toISOString() // Agregar fecha de actualización
    };
    
    localStorage.setItem('surveyTemplates', JSON.stringify(surveyTemplates));
    return true;
  }
  return false;
}

/**
 * Recopila todos los datos del formulario para crear/actualizar plantilla
 */
function gatherTemplateData() {
  const participantsType = document.querySelector('input[name="participantsType"]:checked')?.value;
  let participantsData = [];
  
  if (participantsType === 'departments') {
    const deptCheckboxes = document.querySelectorAll('input[name="departments"]:checked');
    participantsData = Array.from(deptCheckboxes).map(checkbox => ({
      type: 'department',
      name: checkbox.value,
      excluded: departmentData[checkbox.value].people
        .filter(p => p.excluded)
        .map(p => ({ id: p.id, name: p.name, email: p.email }))
    }));
  } else {
    participantsData = selectedIndividuals.map(ind => ({
      type: 'individual',
      id: ind.id,
      name: ind.name,
      department: ind.department,
      email: ind.email
    }));
  }
  
  return {
    id: Date.now(), // Para nuevas plantillas, se sobrescribe en updateTemplate
    name: document.getElementById('surveyName').value,
    description: document.getElementById('surveyDescription').value,
    evalType: document.querySelector('input[name="evalType"]:checked')?.value || '0',
    participantsType: participantsType,
    participants: participantsData,
    questions: gatherQuestionsData(),
    createdAt: new Date().toISOString(), // Para nuevas, se sobrescribe en updateTemplate
    questionCount: document.querySelectorAll('.question-item').length
  };
}