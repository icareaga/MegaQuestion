document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const user = await authenticateUser(username, password);
    
    if (user) {
      // Guardar usuario en sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      
      // Redirigir según rol
      const redirectPaths = {
        'administrador': '../administrador/index.html',
        'consultor': '../consultor/index.html',
        'usuario': '../usuario/index.html'
      };
      
      window.location.href = redirectPaths[user.rol] || '../index.html';
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    alert('Error al iniciar sesión. Intente nuevamente.');
  }
});