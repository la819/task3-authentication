const API = 'http://localhost:5000';

function showTab(tab) {
  document.getElementById('loginForm').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
}

async function register() {
  const username = document.getElementById('regUsername').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const message  = document.getElementById('registerMessage');

  if (!username || !email || !password) {
    message.style.color = 'red';
    message.textContent = '⚠️ Please fill in all fields!';
    return;
  }

  try {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const result = await res.json();

    if (res.ok) {
      message.style.color = 'green';
      message.textContent = '✅ Registered successfully! Please login.';
      document.getElementById('regUsername').value = '';
      document.getElementById('regEmail').value    = '';
      document.getElementById('regPassword').value = '';
    } else {
      message.style.color = 'red';
      message.textContent = '❌ ' + result.error;
    }
  } catch (err) {
    message.style.color = 'red';
    message.textContent = '❌ Server error!';
  }
}

async function login() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const message  = document.getElementById('loginMessage');

  if (!email || !password) {
    message.style.color = 'red';
    message.textContent = '⚠️ Please fill in all fields!';
    return;
  }

  try {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    if (res.ok) {
      // Save token
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      // Show dashboard
      showDashboard(result.user);
    } else {
      message.style.color = 'red';
      message.textContent = '❌ ' + result.error;
    }
  } catch (err) {
    message.style.color = 'red';
    message.textContent = '❌ Server error!';
  }
}

function showDashboard(user) {
  document.getElementById('authSection').style.display  = 'none';
  document.getElementById('dashboard').style.display    = 'block';
  document.getElementById('welcomeMessage').textContent = `Hello ${user.username}! You are logged in.`;
  document.getElementById('userInfo').innerHTML = `
    <strong>Username:</strong> ${user.username}<br>
    <strong>Email:</strong> ${user.email}
  `;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.getElementById('authSection').style.display = 'block';
  document.getElementById('dashboard').style.display   = 'none';
}

// Check if already logged in
window.onload = () => {
  const user = localStorage.getItem('user');
  if (user) {
    showDashboard(JSON.parse(user));
  }
};