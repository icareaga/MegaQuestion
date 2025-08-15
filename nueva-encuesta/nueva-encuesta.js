// Contador para IDs de preguntas
let questionCounter = 0;

// Función para agregar una nueva pregunta
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
      <input type="text" id="question-text-${questionCounter}" placeholder="Texto de la pregunta" required>
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

// Función para eliminar una pregunta
function removeQuestion(id) {
  const questionToRemove = document.getElementById(`question-${id}`);
  if (questionToRemove) {
    questionToRemove.remove();
    // Renumerar las preguntas restantes
    questionCounter--;
  }
}

// Función para cambiar el tipo de respuesta
function changeAnswerType(questionId) {
  const optionsContainer = document.getElementById(`question-options-${questionId}`);
  const answerType = document.getElementById(`question-type-${questionId}`).value;
  
  if (answerType === 'multiple') {
    optionsContainer.style.display = 'block';
    // Agregar primera opción si no hay ninguna
    const optionList = document.getElementById(`option-list-${questionId}`);
    if (optionList.children.length === 0) {
      addOption(questionId);
    }
  } else {
    optionsContainer.style.display = 'none';
  }
}

// Función para agregar opción a pregunta múltiple
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

// Función para eliminar opción
function removeOption(button) {
  button.parentElement.remove();
}

// Función para cancelar el formulario
function cancelForm() {
  if (confirm('¿Estás seguro de que deseas cancelar? Los cambios no se guardarán.')) {
    window.location.href = '../administrator/index.html';
  }
}

// Manejar envío del formulario
document.getElementById('surveyForm').addEventListener('submit', function(e) {
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
  
  // Simular guardado
  alert('Encuesta guardada correctamente');
  window.location.href = '../administrator/index.html';
});

// Agregar primera pregunta al cargar
window.onload = addQuestion;