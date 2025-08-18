async function authenticateUser(username, password) {
  try {
    const response = await fetch('../data/users.json');
    if (!response.ok) throw new Error('Error al cargar usuarios');
    
    const users = await response.json();
    return users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password
    );
  } catch (error) {
    console.error('Error en authenticateUser:', error);
    throw error;
  }
}

// Función para verificar sesión en otras páginas
function checkAuth() {
  const userData = sessionStorage.getItem('currentUser');
  if (!userData) {
    window.location.href = '../login/index.html';
    return null;
  }
  return JSON.parse(userData);
}