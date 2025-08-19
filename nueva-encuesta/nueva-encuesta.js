/*
 * LÓGICA DE LA APLICACIÓN DE ENCUESTAS
 * Este archivo contiene toda la funcionalidad JavaScript para el formulario
 */

// Base de datos de preguntas predefinidas organizadas por categorías
const questionLibrary = [
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

// Variables globales
let questionCounter = 0; // Contador para IDs únicos de preguntas
let selectedQuestions = new Set(); // Conjunto para almacenar preguntas seleccionadas

/**
 * Carga la biblioteca de preguntas en el contenedor correspondiente
 * Filtra por categoría si se ha seleccionado alguna
 */
function loadQuestionLibrary() {
  const libraryContainer = document.getElementById('questionLibrary');
  libraryContainer.innerHTML = '';
  
  // Obtener la categoría seleccionada para filtrar
  const category = document.getElementById('categoryFilter').value;
  
  // Iterar sobre todas las preguntas y mostrar solo las de la categoría seleccionada
  questionLibrary.forEach(question => {
    if (category === 'all' || question.category === category) {
      const questionElement = document.createElement('div');
      questionElement.className = 'library-item';
      questionElement.innerHTML = `
        <input type="checkbox" id="lib-${question.id}" value="${question.id}" onchange="toggleQuestion(${question.id})">
        <label for="lib-${question.id}">${question.text} <small>(${getCategoryName(question.category)})</small></label>
      `;
      libraryContainer.appendChild(questionElement);
    }
  });
}

/**
 * Convierte el identificador de categoría en un nombre legible
 * @param {string} category - Identificador de la categoría
 * @returns {string} Nombre legible de la categoría
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
 * Filtra las preguntas mostradas según la categoría seleccionada
 */
function filterQuestions() {
  loadQuestionLibrary();
}

/**
 * Alterna la selección de una pregunta en la biblioteca
 * @param {number} id - ID de la pregunta a seleccionar/deseleccionar
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
  // Verificar que se hayan seleccionado preguntas
  if (selectedQuestions.size === 0) {
    alert('Por favor, selecciona al menos una pregunta de la biblioteca.');
    return;
  }
  
  // Iterar sobre las preguntas seleccionadas y agregarlas al formulario
  selectedQuestions.forEach(id => {
    const question = questionLibrary.find(q => q.id === id);
    if (question) {
      addQuestionFromLibrary(question);
    }
  });
  
  // Limpiar la selección
  selectedQuestions.clear();
  
  // Desmarcar todas las casillas en la interfaz
  document.querySelectorAll('#questionLibrary input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  // Mostrar mensaje de éxito
  alert('Preguntas agregadas correctamente.');
}

/**
 * Agrega una pregunta desde la biblioteca al formulario
 * @param {Object} question - Objeto de pregunta con text, category y type
 */
function addQuestionFromLibrary(question) {
  questionCounter++;
  
  const questionsContainer = document.getElementById('questionsContainer');
  
  const questionDiv = document.createElement('div');
  questionDiv.className = 'question-item';
  questionDiv.id = `question-${questionCounter}`;
  
  // Crear el HTML para la pregunta
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
  
  // Si es de opción múltiple, mostrar el contenedor de opciones
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
  
  // Crear el HTML para una pregunta vacía
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
 * @param {number} id - ID de la pregunta a eliminar
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
 * para mantener una numeración consistente
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
 * @param {number} questionId - ID de la pregunta a modificar
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
 * @param {number} questionId - ID de la pregunta a la que agregar la opción
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
 * @param {HTMLElement} button - Botón que activó la eliminación
 */
function removeOption(button) {
  button.parentElement.remove();
}

/**
 * Cancela el formulario y regresa a la página de administración
 */
function cancelForm() {
  if (confirm('¿Estás seguro de que deseas cancelar? Los cambios no se guardarán.')) {
    window.location.href = '../administrator/index.html';
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
 * @param {Event} e - Evento de envío del formulario
 */
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Validar fechas
  const startDate = new Date(document.getElementById('startDate').value);
  const endDate = new Date(document.getElementById('endDate').value);
  
  if (endDate < startDate) {
    alert('La fecha de fin no puede ser anterior a la fecha de inicio');
    return;
  }
  
  // Validar que haya al menos una pregunta
  if (questionCounter === 0) {
    alert('Debes agregar al menos una pregunta');
    return;
  }
  
  // Simular guardado (en una aplicación real, aquí se enviarían los datos al servidor)
  alert('Encuesta guardada correctamente');
  window.location.href = '../administrador/index.html';
}

// Inicializar la aplicación cuando se cargue la página
window.onload = function() {
  // Cargar la biblioteca de preguntas
  loadQuestionLibrary();
  
  // Agregar un event listener para el envío del formulario
  document.getElementById('surveyForm').addEventListener('submit', handleFormSubmit);
  
  // Agregar una pregunta inicial al cargar
  addQuestion();
};