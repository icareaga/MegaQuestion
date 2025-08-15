// Función para guardar progreso
function saveProgress() {
  // Validar que haya respuestas
  if (!validateAnswers()) {
    alert('Por favor responde al menos una pregunta para guardar el progreso');
    return;
  }
  
  // Simular guardado
  alert('Progreso guardado correctamente. Puedes continuar más tarde.');
  
  // Redirigir al panel de usuario
  setTimeout(() => {
    window.location.href = '../usuario/index.html';
  }, 1000);
}

// Función para validar respuestas
function validateAnswers() {
  // Verificar si al menos una pregunta ha sido respondida
  const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked, textarea:not(:empty)');
  return answeredQuestions.length > 0;
}

// Manejar envío del formulario
document.getElementById('surveyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Validar que todas las preguntas estén respondidas
  const totalQuestions = document.querySelectorAll('.question-item').length;
  const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked, textarea:not(:empty)').length;
  
  if (answeredQuestions < totalQuestions) {
    alert('Por favor responde todas las preguntas antes de enviar la encuesta');
    return;
  }
  
  // Simular envío
  alert('Encuesta enviada correctamente. ¡Gracias por tu participación!');
  
  // Redirigir al panel de usuario
  setTimeout(() => {
    window.location.href = '../usuario/index.html';
  }, 1000);
});