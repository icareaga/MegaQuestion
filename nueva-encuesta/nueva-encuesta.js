/*
 * LÓGICA DE LA APLICACIÓN DE ENCUESTAS
 * Este archivo contiene toda la funcionalidad JavaScript para el formulario
 */

// Base de datos de preguntas predefinidas organizadas por categorías
const questionLibraryData = [
  // Preguntas de Comunicación
  { id: 1, text: "¿Cómo calificarías la comunicación dentro del equipo?", category: "comunicacion", type: "scale" },
  { id: 2, text: "¿Se comparte la información importante con todos?", category: "comunicacion", type: "yesno" },
  { id: 3, text: "¿Qué aspectos mejorarías de la comunicación en el equipo?", category: "comunicacion", type: "text" },
  { id: 4, text: "¿Se resuelven los conflictos de manera constructiva?", category: "comunicacion", type: "scale" },
  { id: 5, text: "¿Existen canales de comunicación efectivos?", category: "comunicacion", type: "yesno" },
  
  // Preguntas de Liderazgo
  { id: 6, text: "¿El líder proporciona retroalimentación clara y constructiva?", category: "liderazgo", type: "scale" },
  { id: 7, text: "¿El líder reconoce los logros del equipo?", category: "liderazgo", type: "yesno" },
  { id: 8, text: "¿Qué cualidades destacarías de tu líder?", category: "liderazgo", type: "text" },
  { id: 9, text: "¿El líder delega responsabilidades adecuadamente?", category: "liderazgo", type: "scale" },
  { id: 10, text: "¿El líder toma decisiones de manera efectiva?", category: "liderazgo", type: "scale" },
  
  // Preguntas de Trabajo en Equipo
  { id: 11, text: "¿Los miembros del equipo colaboran efectivamente?", category: "trabajoEquipo", type: "scale" },
  { id: 12, text: "¿Participa activamente en las reuniones de equipo?", category: "trabajoEquipo", type: "yesno" },
  { id: 13, text: "¿Cómo podríamos mejorar el trabajo en equipo?", category: "trabajoEquipo", type: "text" },
  { id: 14, text: "¿Existe confianza entre los miembros del equipo?", category: "trabajoEquipo", type: "scale" },
  { id: 15, text: "¿Se fomenta un ambiente de colaboración?", category: "trabajoEquipo", type: "yesno" },
  
  // Preguntas de Habilidades Técnicas
  { id: 16, text: "¿Posee las habilidades técnicas necesarias para su puesto?", category: "habilidades", type: "scale" },
  { id: 17, text: "¿Está satisfecho con las oportunidades de desarrollo?", category: "habilidades", type: "yesno" },
  { id: 18, text: "¿Qué habilidades te gustaría desarrollar?", category: "habilidades", type: "text" },
  { id: 19, text: "¿Mantiene sus conocimientos actualizados?", category: "habilidades", type: "scale" },
  { id: 20, text: "¿Aplica sus conocimientos de manera efectiva?", category: "habilidades", type: "scale" },
  
  // Preguntas de Valores Organizacionales
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
  { id: 3, name: "Carlos López", department: "TI", email: "carlos.lopez@empresa.com" },
  { id: 4, name: "Ana Martínez", department: "TI", email: "ana.martinez@empresa.com" },
  { id: 5, name: "Pedro Rodríguez", department: "RH", email: "pedro.rodriguez@empresa.com" },
  { id: 6, name: "Laura Hernández", department: "RH", email: "laura.hernandez@empresa.com" },
  { id: 7, name: "Miguel Díaz", department: "Gerencia", email: "miguel.diaz@empresa.com" },
  { id: 8, name: "Sofía Ruiz", department: "Gerencia", email: "sofia.ruiz@empresa.com" },
  { id: 9, name: "Jorge Sánchez", department: "Ventas", email: "jorge.sanchez@empresa.com" },
  { id: 10, name: "Elena Castro", department: "TI", email: "elena.castro@empresa.com" }
];


// Variables globales
let questionCounter = 0;
let selectedQuestions = new Set();
let surveyTemplates = JSON.parse(localStorage.getItem('surveyTemplates')) || [];
let selectedIndividuals = [];

/**
 * Carga la biblioteca de preguntas en el contenedor correspondiente
 */
function loadQuestionLibrary() {
  const libraryContainer = document.getElementById('questionLibrary');
  if (!libraryContainer) return;
  
  libraryContainer.innerHTML = '';
  
  const category = document.getElementById('categoryFilter').value;
  const searchTerm = document.getElementById('questionSearch').value.toLowerCase();
  
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
      <input type="checkbox" id="lib-${question.id}" value="${question.id}" onchange="toggleQuestion(${question.id})">
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
  document.getElementById('questionSearch').value = term;
  document.getElementById('categoryFilter').value = 'all';
  filterQuestions();
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
  const questionDiv = document.createElement('div');
  questionDiv.className = 'question-item';
  questionDiv.id = `question-${questionCounter}`;
  
  questionDiv.innerHTML = `
    <span class="remove-question" onclick="removeQuestion(${questionCounter})">
      <i class="fas fa-times"></i>
    </span>
    <div class="form-group">
      <label for="question-text-${questionCounter}">Pregunta ${questionCounter}</label>
      <input type="text" id="question-text-${questionCounter}" value="${question.text}" required>
    </div>
    <div class="form-group">
      <label>Tipo de respuesta</label>
      <select id="question-type-${questionCounter}" onchange="changeAnswerType(${questionCounter})">
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
        <button type="button" class="btn small" onclick="addOption(${questionCounter})">
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
  const questionDiv = document.createElement('div');
  questionDiv.className = 'question-item';
  questionDiv.id = `question-${questionCounter}`;
  
  questionDiv.innerHTML = `
    <span class="remove-question" onclick="removeQuestion(${questionCounter})">
      <i class="fas fa-times"></i>
    </span>
    <div class="form-group">
      <label for="question-text-${questionCounter}">Pregunta ${questionCounter}</label>
      <input type="text" id="question-text-${questionCounter}" placeholder="Escribe tu pregunta aquí" required>
    </div>
    <div class="form-group">
      <label>Tipo de respuesta</label>
      <select id="question-type-${questionCounter}" onchange="changeAnswerType(${questionCounter})">
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
        <button type="button" class="btn small" onclick="addOption(${questionCounter})">
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
    }
  });
}

/**
 * Cambia la interfaz según el tipo de respuesta seleccionado
 */
function changeAnswerType(questionId) {
  const optionsContainer = document.getElementById(`question-options-${questionId}`);
  const answerType = document.getElementById(`question-type-${questionId}`).value;
  
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
  const optionCount = optionList.children.length + 1;
  
  const optionDiv = document.createElement('div');
  optionDiv.className = 'option-item';
  optionDiv.innerHTML = `
    <input type="text" placeholder="Opción ${optionCount}" required>
    <button type="button" class="btn small danger" onclick="removeOption(this)">
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
  const surveyName = document.getElementById('surveyName').value;
  if (!surveyName) {
    alert('Por favor, ingresa un nombre para la encuesta antes de guardarla como plantilla.');
    return;
  }
  
  const questions = gatherQuestionsData();
  if (questions.length === 0) {
    alert('La plantilla debe contener al menos una pregunta.');
    return;
  }
  
  const participantsType = document.querySelector('input[name="participantsType"]:checked').value;
  let participantsData = [];
  
  if (participantsType === 'departments') {
    // Obtener departamentos seleccionados (usando checkbox)
    const deptCheckboxes = document.querySelectorAll('input[name="departments"]:checked');
    participantsData = Array.from(deptCheckboxes).map(checkbox => ({
      type: 'department',
      name: checkbox.value
    }));
    
    if (participantsData.length === 0) {
      alert('Debes seleccionar al menos un departamento.');
      return;
    }
  } else {
    // Obtener individuos seleccionados
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
    description: document.getElementById('surveyDescription').value,
    evalType: document.querySelector('input[name="evalType"]:checked').value,
    participantsType: participantsType,
    participants: participantsData,
    questions: questions,
    createdAt: new Date().toISOString(),
    questionCount: questions.length
  };
  
  // Obtener plantillas existentes o inicializar array vacío
  surveyTemplates = JSON.parse(localStorage.getItem('surveyTemplates')) || [];
  
  // Verificar si ya existe una plantilla con el mismo nombre
  const existingIndex = surveyTemplates.findIndex(t => t.name === surveyName);
  if (existingIndex !== -1) {
    if (!confirm(`Ya existe una plantilla llamada "${surveyName}". ¿Deseas reemplazarla?`)) {
      return;
    }
    surveyTemplates[existingIndex] = surveyData;
  } else {
    surveyTemplates.push(surveyData);
  }
  
  // Guardar en localStorage
  localStorage.setItem('surveyTemplates', JSON.stringify(surveyTemplates));
  
  // Actualizar la variable global
  surveyTemplates = JSON.parse(localStorage.getItem('surveyTemplates')) || [];
  
  alert(`Plantilla "${surveyName}" guardada correctamente con ${questions.length} preguntas.`);
  
  // Si estamos en la página de plantillas, recargar la visualización
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
    const questionText = questionEl.querySelector('input[type="text"]').value;
    const questionType = questionEl.querySelector('select').value;
    
    if (questionText.trim()) {
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
  const templatesContainer = document.getElementById('templatesContainer');
  const noTemplatesMessage = document.getElementById('noTemplatesMessage');
  
  if (!templatesContainer) return;
  
  templatesContainer.innerHTML = '';
  
  if (surveyTemplates.length === 0) {
    noTemplatesMessage.style.display = 'block';
    return;
  }
  
  noTemplatesMessage.style.display = 'none';
  
  surveyTemplates.forEach((template, index) => {
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
      </div>
      <div class="template-stats">
        <span><i class="fas fa-question"></i> ${template.questionCount} preguntas</span>
        <span><i class="fas fa-chart-pie"></i> ${template.evalType}°</span>
        <span><i class="fas fa-users"></i> ${participantsText}</span>
      </div>
      <div class="template-actions">
        <button onclick="useTemplate(${index})" class="btn success small">
          <i class="fas fa-play"></i> Usar
        </button>
        <button onclick="editTemplate(${index})" class="btn info small">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button onclick="deleteTemplate(${index})" class="btn danger small">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    `;
    templatesContainer.appendChild(templateCard);
  });
}

/**
 * Usa una plantilla existente
 */
function useTemplate(templateIndex) {
  const template = surveyTemplates[templateIndex];
  
  // Redirigir a la página de nueva encuesta con parámetros
  window.location.href = `index.html?template=${templateIndex}`;
}

/**
 * Carga una plantilla en el formulario
 */
function loadTemplateIntoForm(templateIndex) {
  const template = surveyTemplates[templateIndex];
  
  document.getElementById('surveyName').value = template.name + ' - Copia';
  document.getElementById('surveyDescription').value = template.description || '';
  
  // Seleccionar el tipo de evaluación
  document.querySelector(`input[name="evalType"][value="${template.evalType}"]`).checked = true;
  
  // Configurar participantes según el tipo
  if (template.participantsType) {
    document.querySelector(`input[name="participantsType"][value="${template.participantsType}"]`).checked = true;
    toggleParticipantsSelection();
    
    if (template.participantsType === 'departments') {
      // Seleccionar departamentos
      const deptSelect = document.getElementById('departments');
      Array.from(deptSelect.options).forEach(option => {
        option.selected = template.participants.some(p => p.name === option.value);
      });
    } else {
      // Cargar individuos seleccionados
      selectedIndividuals = template.participants.map(p => ({
        id: p.id,
        name: p.name,
        department: p.department,
        email: p.email
      }));
      renderSelectedIndividuals();
      loadIndividuals(); // Para actualizar checkboxes
    }
  }
  
  // Limpiar preguntas existentes
  document.getElementById('questionsContainer').innerHTML = '';
  questionCounter = 0;
  
  // Agregar preguntas de la plantilla
  template.questions.forEach(question => {
    questionCounter++;
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.id = `question-${questionCounter}`;
    
    let optionsHTML = '';
    if (question.type === 'multiple' && question.options) {
      optionsHTML = `
        <div id="question-options-${questionCounter}" class="options-container">
          <div class="form-group">
            <label>Opciones</label>
            <div class="option-list" id="option-list-${questionCounter}">
              ${question.options.map(option => `
                <div class="option-item">
                  <input type="text" value="${option}" required>
                  <button type="button" class="btn small danger" onclick="removeOption(this)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              `).join('')}
            </div>
            <button type="button" class="btn small" onclick="addOption(${questionCounter})">
              <i class="fas fa-plus"></i> Agregar Opción
            </button>
          </div>
        </div>
      `;
    }
    
    questionDiv.innerHTML = `
      <span class="remove-question" onclick="removeQuestion(${questionCounter})">
        <i class="fas fa-times"></i>
      </span>
      <div class="form-group">
        <label for="question-text-${questionCounter}">Pregunta ${questionCounter}</label>
        <input type="text" id="question-text-${questionCounter}" value="${question.text}" required>
      </div>
      <div class="form-group">
        <label>Tipo de respuesta</label>
        <select id="question-type-${questionCounter}" onchange="changeAnswerType(${questionCounter})">
          <option value="scale" ${question.type === 'scale' ? 'selected' : ''}>Escala (1-5)</option>
          <option value="yesno" ${question.type === 'yesno' ? 'selected' : ''}>Sí/No</option>
          <option value="text" ${question.type === 'text' ? 'selected' : ''}>Texto abierto</option>
          <option value="multiple" ${question.type === 'multiple' ? 'selected' : ''}>Opción múltiple</option>
        </select>
      </div>
      ${optionsHTML}
    `;
    
    document.getElementById('questionsContainer').appendChild(questionDiv);
  });
  
  alert(`Plantilla "${template.name}" cargada. Puedes modificarla antes de guardar.`);
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
    loadTemplates();
    alert('Plantilla eliminada correctamente.');
  }
}

/**
 * Cancela el formulario y regresa a la página de administración
 */
function cancelForm() {
  if (confirm('¿Estás seguro de que deseas cancelar? Los cambios no se guardarán.')) {
    window.location.href = '../administrador/index.html';
  }
}

/**
 * Simula el cierre de sesión del usuario
 */
function logout() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    alert('Sesión finalizada');
    window.location.href = '../index.html';
  }
}

/**
 * Valida y envía el formulario
 */
function handleFormSubmit(e) {
  e.preventDefault();
  
  const startDate = new Date(document.getElementById('startDate').value);
  const endDate = new Date(document.getElementById('endDate').value);
  
  if (endDate < startDate) {
    alert('La fecha de fin no puede ser anterior a la fecha de inicio');
    return;
  }
  
  if (questionCounter === 0) {
    alert('Debes agregar al menos una pregunta');
    return;
  }
  
  const participantsType = document.querySelector('input[name="participantsType"]:checked').value;
  
  if (participantsType === 'departments') {
    if (departmentState.selectedDepartments.length === 0) {
      alert('Debes seleccionar al menos un departamento');
      return;
    }
    
    // Verificar que al menos una persona esté incluida en cada departamento seleccionado
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
  
  // Aquí iría el código para guardar en base de datos real
  alert('Encuesta guardada y asignada correctamente');
  window.location.href = '../administrador/index.html';
}

/**
 * Alterna entre la selección por departamentos y por individuos
 */
function toggleParticipantsSelection() {
  const participantsType = document.querySelector('input[name="participantsType"]:checked').value;
  const departmentSelection = document.getElementById('departmentSelection');
  const individualSelection = document.getElementById('individualSelection');
  
  if (participantsType === 'departments') {
    departmentSelection.style.display = 'block';
    individualSelection.style.display = 'none';
    // Inicializar el resumen
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
  
  const searchTerm = document.getElementById('individualSearch').value.toLowerCase();
  
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
    individualElement.className = 'individual-item';
    individualElement.innerHTML = `
      <input type="checkbox" id="ind-${individual.id}" value="${individual.id}" 
             ${isSelected ? 'checked' : ''} onchange="toggleIndividual(${individual.id})">
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
  document.getElementById('individualSearch').value = department;
  filterIndividuals();
}

/**
 * Alterna la selección de un individuo
 */
function toggleIndividual(id) {
  const individual = individualsDatabase.find(ind => ind.id === id);
  if (!individual) return;

  // Verificar si ya está seleccionado
  const existingIndex = selectedIndividuals.findIndex(ind => ind.id === id);
  
  if (existingIndex === -1) {
    // Agregar a seleccionados
    selectedIndividuals.push({...individual});
  } else {
    // Quitar de seleccionados
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
  const noSelectedMessage = document.getElementById('noSelectedMessage');
  
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
      <div class="selected-individual" data-id="${individual.id}">
        <div class="selected-individual-info">
          <strong>${individual.name}</strong> - ${individual.department}
          <br>
          <small>${individual.email}</small>
        </div>
        <button type="button" class="btn small danger" onclick="removeIndividual(${individual.id})">
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


// ===== FUNCIONALIDAD PARA SELECCIÓN POR DEPARTAMENTOS =====

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

// Estado de la aplicación para departamentos
const departmentState = {
  selectedDepartments: [],
  excludedPeople: []
};

// Alternar la selección de un departamento
function toggleDepartmentSelection(deptName) {
  const checkbox = document.getElementById(`dept-${deptName.toLowerCase()}`);
  const section = document.getElementById(`dept-section-${deptName.toLowerCase()}`);
  
  if (checkbox.checked) {
    section.style.display = 'block';
    if (!departmentState.selectedDepartments.includes(deptName)) {
      departmentState.selectedDepartments.push(deptName);
    }
  } else {
    section.style.display = 'none';
    // Ocultar el contenido si está expandido
    const content = document.getElementById(`content-${deptName.toLowerCase()}`);
    const icon = document.getElementById(`icon-${deptName.toLowerCase()}`);
    
    if (content.classList.contains('expanded')) {
      content.classList.remove('expanded');
      icon.classList.remove('fa-chevron-up');
      icon.classList.add('fa-chevron-down');
    }
    
    // Eliminar del estado
    const index = departmentState.selectedDepartments.indexOf(deptName);
    if (index > -1) {
      departmentState.selectedDepartments.splice(index, 1);
    }
    
    // Eliminar exclusiones de este departamento
    departmentData[deptName].people.forEach(person => {
      const excludeIndex = departmentState.excludedPeople.indexOf(person.id);
      if (excludeIndex > -1) {
        departmentState.excludedPeople.splice(excludeIndex, 1);
      }
      person.excluded = false;
      
      // Desmarcar checkbox de exclusión
      const excludeCheckbox = document.getElementById(`exclude-${deptName.toLowerCase()}-${person.id}`);
      if (excludeCheckbox) {
        excludeCheckbox.checked = false;
      }
    });
  }
  
  updateDepartmentSummary();
}

// Alternar la visualización del contenido del departamento
function toggleDepartmentExpand(deptId) {
  const content = document.getElementById(`content-${deptId}`);
  const icon = document.getElementById(`icon-${deptId}`);
  
  content.classList.toggle('expanded');
  
  if (content.classList.contains('expanded')) {
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-up');
  } else {
    icon.classList.remove('fa-chevron-up');
    icon.classList.add('fa-chevron-down');
  }
}

// Alternar la exclusión de una persona
function toggleExclusion(deptName, personId) {
  // Nota: Esta función asume que los IDs de checkboxes en HTML usan el personId global (e.g., exclude-ti-5 para TI id=5)
  const checkbox = document.getElementById(`exclude-${deptName.toLowerCase()}-${personId}`);
  const person = departmentData[deptName].people.find(p => p.id === personId);
  
  if (person) {
    person.excluded = checkbox.checked;
    
    // Actualizar el estado de la aplicación
    if (checkbox.checked) {
      if (!departmentState.excludedPeople.includes(personId)) {
        departmentState.excludedPeople.push(personId);
      }
    } else {
      const index = departmentState.excludedPeople.indexOf(personId);
      if (index > -1) {
        departmentState.excludedPeople.splice(index, 1);
      }
    }
    
    updateDepartmentSummary();
  }
}

// Actualizar el resumen de participantes
function updateDepartmentSummary() {
  // Calcular totales
  let totalPeople = 0;
  let excludedPeople = 0;
  
  for (const deptName of departmentState.selectedDepartments) {
    const department = departmentData[deptName];
    totalPeople += department.people.length;
    excludedPeople += department.people.filter(p => p.excluded).length;
  }
  
  const includedPeople = totalPeople - excludedPeople;
  
  // Actualizar la interfaz
  document.getElementById('included-count').textContent = includedPeople;
  document.getElementById('excluded-count').textContent = excludedPeople;
  document.getElementById('department-count').textContent = departmentState.selectedDepartments.length;
  
  // Actualizar la lista de seleccionados
  const selectedList = document.getElementById('selectedList');
  const noSelectedMessage = document.getElementById('noSelectedMessage');
  
  if (departmentState.selectedDepartments.length === 0) {
    noSelectedMessage.style.display = 'block';
    selectedList.innerHTML = '';
    return;
  }
  
  noSelectedMessage.style.display = 'none';
  
  let html = '';
  for (const deptName of departmentState.selectedDepartments) {
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
  }
  
  selectedList.innerHTML = html;
}

/**
 * Inicializa la aplicación
 */
function initApp() {
  // Cargar la biblioteca de preguntas
  loadQuestionLibrary();
  
  // Configurar el formulario
  const surveyForm = document.getElementById('surveyForm');
  if (surveyForm) {
    surveyForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Inicializar la lista de personas seleccionadas
  selectedIndividuals = [];
  
  // Inicializar el resumen de departamentos
  updateDepartmentSummary();
  
  // Verificar si hay parámetros de URL para cargar plantilla
  const urlParams = new URLSearchParams(window.location.search);
  const templateIndex = urlParams.get('template');
  const editTemplateIndex = urlParams.get('editTemplate');
  
  if (templateIndex !== null) {
    loadTemplateIntoForm(parseInt(templateIndex));
  } else if (editTemplateIndex !== null) {
    // Modo edición de plantilla
    const template = surveyTemplates[parseInt(editTemplateIndex)];
    document.getElementById('surveyName').value = template.name;
    document.getElementById('surveyDescription').value = template.description || '';
    document.querySelector(`input[name="evalType"][value="${template.evalType}"]`).checked = true;
    
    // Configurar tipo de participantes si existe en la plantilla
    if (template.participantsType) {
      document.querySelector(`input[name="participantsType"][value="${template.participantsType}"]`).checked = true;
      toggleParticipantsSelection();
      
      // Cargar individuos seleccionados si es una plantilla de individuos
      if (template.participantsType === 'individuals') {
        selectedIndividuals = template.participants.map(p => ({
          id: p.id,
          name: p.name,
          department: p.department,
          email: p.email
        }));
        // Renderizar después de un breve delay para asegurar que el DOM esté listo
        setTimeout(() => {
          renderSelectedIndividuals();
          updateIndividualCheckboxes();
        }, 100);
      }
    }
    
    loadTemplateIntoForm(parseInt(editTemplateIndex));
  } else {
    // Modo nueva encuesta - agregar pregunta inicial
    addQuestion();
  }
  
  // Cargar plantillas si estamos en la página de plantillas
  if (typeof loadTemplates === 'function') {
    loadTemplates();
  }
  
  // Renderizar personas seleccionadas si estamos en el formulario
  if (document.getElementById('selectedIndividuals')) {
    renderSelectedIndividuals();
  }
}

// Inicializar cuando se cargue la página
window.onload = initApp;