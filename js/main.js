// Función para seleccionar tipo de usuario en login
function selectUserType(userType) {
  const loginForm = document.getElementById('loginForm');
  const roleTitle = document.getElementById('roleTitle');
  
  // Mostrar formulario de login
  loginForm.classList.remove('hidden');
  
  // Actualizar título con el rol seleccionado
  roleTitle.textContent = userType;
  
  // Desplazar vista al formulario
  loginForm.scrollIntoView({ behavior: 'smooth' });
}

// Manejar envío del formulario de login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const userType = document.getElementById('roleTitle').textContent;
  
  // Validación básica
  if(username.trim() === '' || password.trim() === '') {
    alert('Por favor completa todos los campos');
    return;
  }
  
  // Simular autenticación
  console.log(`Login attempt - User: ${username}, Role: ${userType}`);
  
  // Redirección según rol (simulada)
  setTimeout(() => {
    let redirectUrl = '../index.html';
    
    switch(userType) {
      case 'Usuario':
        redirectUrl = '../usuario/index.html';
        break;
      case 'Consultor':
        redirectUrl = '../consultor/index.html';
        break;
      case 'Administrador':
        redirectUrl = '../administrador/index.html';
        break;
    }
    
    window.location.href = redirectUrl;
  }, 500);
});

// Función para cerrar sesión
function logout() {
  if(confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    window.location.href = '../login/index.html';
  }
}

// Función para mostrar gestión de usuarios (admin)
function showUserManagement() {
  alert('Funcionalidad de gestión de usuarios en desarrollo');
}

// Función para generar reporte (consultor)
function generateReport() {
  alert('Generando reporte... Esta función estará disponible pronto');
}

// Inicializar tooltips
function initTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');
  
  tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', showTooltip);
    tooltip.addEventListener('mouseleave', hideTooltip);
  });
}

function showTooltip(e) {
  const tooltipText = this.getAttribute('data-tooltip');
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = tooltipText;
  
  document.body.appendChild(tooltip);
  
  const rect = this.getBoundingClientRect();
  tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
  tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
}

function hideTooltip() {
  const tooltip = document.querySelector('.tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}

// Inicializar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  initTooltips();
  
  // Inicializar datepickers
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) {
      const today = new Date().toISOString().split('T')[0];
      input.value = today;
    }
  });
});