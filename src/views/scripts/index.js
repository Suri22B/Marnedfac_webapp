function login() {
  console.log('here', apikey);
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const myHeaders = new Headers();
  myHeaders.append('x-api-key', 'GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj');
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    email: email,
    password: password,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('http://localhost:3000/api/login/user', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        window.location.href = '/defacs'; // Redirect to /defacs on successful login
      } else {
        alert('Login failed: ' + result.message);
      }
    })
    .catch((error) => console.error('Error:', error));
}
