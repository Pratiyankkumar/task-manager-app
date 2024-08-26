let response;

document.querySelector('.login-button').addEventListener('click', async () => {
  let email = document.querySelector('.js-email-input').value;
  let password = document.querySelector('.js-password').value;
  
  const request = await fetch('https://task-manager-app-z7cx.onrender.com/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  })


  response = await request.json();
  console.log(response)
  console.log(request.status)

  localStorage.setItem('token', JSON.stringify(response.token))

  if (request.status >= 400) {
    console.log('An error occured')
    document.querySelector('#alert-border-1').classList.remove('hidden')
    setTimeout(() => {
      document.querySelector('#alert-border-1').classList.add('hidden')
    }, 2000);
  } else {
    window.location.href = '/home'
  }
})