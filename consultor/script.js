// Datos ficticios ampliados con al menos dos gerentes por departamento
const users = [
  // Departamento TI - Gerentes: Javier Torres, Roberto Díaz
  { id: 1, name: "Ana López", department: "TI", gerencia: "Javier Torres", role: "Desarrolladora Frontend", surveys: [{ name: "Evaluación 360°", date: "01/08/2025" }, { name: "Clima Laboral", date: "15/07/2025" }] },
  { id: 2, name: "Carlos Ramírez", department: "TI", gerencia: "Javier Torres", role: "Analista de Sistemas", surveys: [{ name: "Evaluación 360°", date: "02/08/2025" }] },
  { id: 3, name: "María González", department: "TI", gerencia: "Roberto Díaz", role: "Ingeniera DevOps", surveys: [] },
  { id: 4, name: "Pedro Sánchez", department: "TI", gerencia: "Roberto Díaz", role: "Desarrollador Backend", surveys: [{ name: "Clima Laboral", date: "16/07/2025" }] },
  { id: 5, name: "Laura Martínez", department: "TI", gerencia: "Javier Torres", role: "Administradora de Bases de Datos", surveys: [{ name: "Evaluación 360°", date: "03/08/2025" }, { name: "Clima Laboral", date: "17/07/2025" }] },
  { id: 6, name: "Javier Torres", department: "TI", gerencia: "Javier Torres", role: "Líder Técnico", surveys: [] },
  { id: 9, name: "Elena Vargas", department: "TI", gerencia: "Roberto Díaz", role: "Especialista en Seguridad", surveys: [{ name: "Evaluación 360°", date: "02/08/2025" }, { name: "Clima Laboral", date: "16/07/2025" }] },
  { id: 10, name: "Roberto Díaz", department: "TI", gerencia: "Roberto Díaz", role: "Administrador de Redes", surveys: [] },
  { id: 13, name: "Diego Herrera", department: "TI", gerencia: "Javier Torres", role: "Desarrollador Full Stack", surveys: [{ name: "Evaluación 360°", date: "04/08/2025" }] },
  { id: 14, name: "Valeria Soto", department: "TI", gerencia: "Roberto Díaz", role: "Analista QA", surveys: [] },
  // Departamento Legal - Gerentes: Lucía Fernández, Sofía Ruiz
  { id: 7, name: "Sofía Ruiz", department: "Legal", gerencia: "Sofía Ruiz", role: "Abogada Corporativa", surveys: [{ name: "Evaluación 360°", date: "01/08/2025" }] },
  { id: 11, name: "Lucía Fernández", department: "Legal", gerencia: "Lucía Fernández", role: "Asesora Legal Senior", surveys: [{ name: "Clima Laboral", date: "17/07/2025" }] },
  { id: 15, name: "Gabriel Mendoza", department: "Legal", gerencia: "Lucía Fernández", role: "Abogado Junior", surveys: [{ name: "Clima Laboral", date: "18/07/2025" }] },
  { id: 16, name: "Isabela Navarro", department: "Legal", gerencia: "Sofía Ruiz", role: "Asistente Legal", surveys: [] },
  // Departamento Finanzas - Gerentes: Andrés Morales, Miguel Ortega
  { id: 8, name: "Miguel Ortega", department: "Finanzas", gerencia: "Miguel Ortega", role: "Analista Financiero", surveys: [{ name: "Clima Laboral", date: "15/07/2025" }] },
  { id: 12, name: "Andrés Morales", department: "Finanzas", gerencia: "Andrés Morales", role: "Contador Senior", surveys: [{ name: "Evaluación 360°", date: "03/08/2025" }] },
  { id: 17, name: "Santiago Reyes", department: "Finanzas", gerencia: "Andrés Morales", role: "Auditor Interno", surveys: [{ name: "Evaluación 360°", date: "05/08/2025" }] },
  { id: 18, name: "Camila Vega", department: "Finanzas", gerencia: "Miguel Ortega", role: "Contadora Junior", surveys: [] }
];

const allSurveys = ["Evaluación 360°", "Clima Laboral"];

// Funciones para acciones
function viewUserDetails(userId) {
  const user = users.find(u => u.id === userId);
  document.getElementById('modalContent').innerHTML = `
    <strong>Nombre:</strong> ${user.name}<br>
    <strong>Departamento:</strong> ${user.department}<br>
    <strong>Gerente:</strong> ${user.gerencia}<br>
    <strong>Rol:</strong> ${user.role}<br>
    <strong>Encuestas:</strong> ${user.surveys.length > 0 ? user.surveys.map(s => `${s.name} (${s.date})`).join(", ") : "Ninguna"}
  `;
  document.getElementById('userModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('userModal').style.display = 'none';
}

function sendReminder(userId) {
  const user = users.find(u => u.id === userId);
  const pendingSurveys = allSurveys.filter(survey => !user.surveys.some(s => s.name === survey));
  showNotification(`Recordatorio enviado a ${user.name} para completar: ${pendingSurveys.join(", ")}`);
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => notification.style.display = 'none', 3000);
}

// Modo Oscuro
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function generateSelectedDocument() {
  const selectedCheckboxes = document.querySelectorAll('.user-select:checked');
  const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.userId));
  const selectedUsers = users.filter(u => selectedIds.includes(u.id));
  if (selectedUsers.length === 0) {
    showNotification("No hay usuarios seleccionados");
    return;
  }

  // Agrega BOM UTF-8 al inicio para mejor compatibilidad con Excel (especialmente para acentos)
  const BOM = '\ufeff';
  let csvContent = BOM + "ID;Nombre;Rol;Departamento;Gerente;Encuestas Contestadas;Fechas\n";

  selectedUsers.forEach(user => {
    const surveysNames = user.surveys.map(s => s.name).join("|");
    const surveysDates = user.surveys.map(s => s.date).join("|");
    // Escapa comillas dobles y envuelve campos en comillas para evitar problemas con caracteres especiales
    csvContent += `"${user.id}";"${user.name}";"${user.role}";"${user.department}";"${user.gerencia}";"${surveysNames}";"${surveysDates}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "usuarios_seleccionados.csv";
  link.click();
  showNotification("Documento CSV generado y descargado. Si no se separa en Excel, usa 'Datos > Desde texto/CSV' y selecciona 'Punto y coma' como delimitador.");
}

// Actualizar tablas con simulación de carga
function updateTables() {
  const completedLoading = document.getElementById("loading-completed");
  const pendingLoading = document.getElementById("loading-pending");
  completedLoading.style.display = 'block';
  pendingLoading.style.display = 'block';

  setTimeout(() => {
    const completedSearch = document.getElementById("user-search-completed").value.toLowerCase();
    const completedSurveyFilter = document.getElementById("survey-filter-completed").value;
    const completedDeptFilter = document.getElementById("department-filter-completed").value;
    const completedGerenciaFilter = document.getElementById("gerencia-filter-completed").value;
    const sortOrderCompleted = document.getElementById("sort-order-completed").value;
    const singleResponseCompleted = document.getElementById("single-response-filter-completed").checked;

    const pendingSearch = document.getElementById("user-search-pending").value.toLowerCase();
    const pendingSurveyFilter = document.getElementById("survey-filter-pending").value;
    const pendingDeptFilter = document.getElementById("department-filter-pending").value;
    const pendingGerenciaFilter = document.getElementById("gerencia-filter-pending").value;
    const sortOrderPending = document.getElementById("sort-order-pending").value;
    const singleResponsePending = document.getElementById("single-response-filter-pending").checked;

    // Tabla de encuestas contestadas
    const completedTable = document.getElementById("completed-users-table");
    completedTable.innerHTML = "";
    let completedUsers = users.filter(user => 
      user.surveys.length > 0 &&
      user.name.toLowerCase().includes(completedSearch) &&
      (!completedSurveyFilter || user.surveys.some(s => s.name === completedSurveyFilter)) &&
      (!completedDeptFilter || user.department === completedDeptFilter) &&
      (!completedGerenciaFilter || user.gerencia === completedGerenciaFilter)
    );

    if (singleResponseCompleted) {
      completedUsers = completedUsers.filter(user => user.surveys.length === 1);
    }

    if (sortOrderCompleted) {
      completedUsers.sort((a, b) => {
        if (sortOrderCompleted === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    }

    let completedUsersCount = completedUsers.length;
    completedUsers.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="Seleccionar"><input type="checkbox" class="user-select" data-user-id="${user.id}"></td>
        <td data-label="Nombre">${user.name}</td>
        <td data-label="Rol">${user.role}</td>
        <td data-label="Gerente">${user.gerencia}</td>
        <td data-label="Encuestas Contestadas">${user.surveys.map(s => s.name).join(", ")}</td>
        <td data-label="Fechas">${user.surveys.map(s => s.date).join(", ")}</td>
        <td data-label="Acciones">
          <button class="btn" onclick="viewUserDetails(${user.id})"><i class="fas fa-eye"></i> Ver</button>
        </td>
      `;
      completedTable.appendChild(row);
    });
    document.getElementById("completed-users-count").textContent = completedUsersCount;

    // Tabla de usuarios pendientes
    const pendingTable = document.getElementById("pending-users-table");
    pendingTable.innerHTML = "";
    let pendingUsersCount = 0;
    let pendingUsers = [];
    users.forEach(user => {
      const pendingSurveys = allSurveys.filter(survey => !user.surveys.some(s => s.name === survey));
      if (
        pendingSurveys.length > 0 &&
        user.name.toLowerCase().includes(pendingSearch) &&
        (!pendingSurveyFilter || pendingSurveys.includes(pendingSurveyFilter)) &&
        (!pendingDeptFilter || user.department === pendingDeptFilter) &&
        (!pendingGerenciaFilter || user.gerencia === pendingGerenciaFilter)
      ) {
        pendingUsers.push({ user, pendingSurveys });
      }
    });

    if (singleResponsePending) {
      pendingUsers = pendingUsers.filter(({ pendingSurveys }) => pendingSurveys.length === 1);
    }

    if (sortOrderPending) {
      pendingUsers.sort((a, b) => {
        if (sortOrderPending === "asc") {
          return a.user.name.localeCompare(b.user.name);
        } else {
          return b.user.name.localeCompare(a.user.name);
        }
      });
    }

    pendingUsers.forEach(({ user, pendingSurveys }) => {
      pendingUsersCount++;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="Seleccionar"><input type="checkbox" class="user-select" data-user-id="${user.id}"></td>
        <td data-label="Nombre">${user.name}</td>
        <td data-label="Rol">${user.role}</td>
        <td data-label="Gerente">${user.gerencia}</td>
        <td data-label="Encuestas Pendientes">${pendingSurveys.join(", ")}</td>
        <td data-label="Acciones">
          <button class="btn warning" onclick="sendReminder(${user.id})"><i class="fas fa-bell"></i> Recordatorio</button>
        </td>
      `;
      pendingTable.appendChild(row);
    });
    document.getElementById("pending-users-count").textContent = pendingUsersCount;

    completedLoading.style.display = 'none';
    pendingLoading.style.display = 'none';
  }, 500); // Simula un retraso de 0.5 segundos
}

// Event listeners para filtros y búsqueda
const filters = [
  "user-search-completed", "survey-filter-completed", "department-filter-completed", "gerencia-filter-completed",
  "user-search-pending", "survey-filter-pending", "department-filter-pending", "gerencia-filter-pending",
  "sort-order-completed", "sort-order-pending",
  "single-response-filter-completed", "single-response-filter-pending"
];
filters.forEach(id => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener("input", updateTables);
    element.addEventListener("change", updateTables);
  }
});

// Listener para el botón de generar documento
document.getElementById("generate-selected-doc").addEventListener("click", generateSelectedDocument);

// Carga inicial
updateTables();

// Inicializar Gráfico de Barras (KPIs)
const kpiCtx = document.getElementById('kpiChart').getContext('2d');
new Chart(kpiCtx, {
  type: 'bar',
  data: {
    labels: ['Calidad', 'Objetivos', 'Bienestar', 'Comunicación'],
    datasets: [{
      label: 'Porcentaje Total',
      data: [84, 69, 81, 84],
      backgroundColor: ['#2ecc71', '#f1c40f', '#0d47a1', '#27ae60'],
      borderColor: ['#27ae60', '#e67e22', '#1565c0', '#2196f3'],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Porcentaje (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Categorías'
        }
      }
    },
    plugins: {
      legend: {
        display: true
      },
      title: {
        display: true,
        text: 'Resultados por Categoría'
      }
    }
  }
});

// Inicializar Gráfico Circular (Progreso de Encuestas)
const progressCtx = document.getElementById('surveyProgressChart').getContext('2d');
new Chart(progressCtx, {
  type: 'pie',
  data: {
    labels: ['Encuestas Completadas', 'Encuestas Pendientes'],
    datasets: [{
      data: [77, 23], // Ejemplo: 77% completadas
      backgroundColor: ['#2ecc71', '#f39c12'],
      borderColor: ['#fff', '#fff'],
      borderWidth: 2
    }]
  },
  options: {
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Progreso de Encuestas'
      }
    }
  }
});