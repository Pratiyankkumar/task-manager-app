let response;

document.querySelector('.sign-up-button').addEventListener('click', async () => {
  let myName = document.querySelector('.js-name-input').value;
  let age = document.querySelector('.js-age-input').value;
  let email = document.querySelector('.js-email-input').value;
  let password = document.querySelector('.js-password').value;
  
  const request = await fetch('https://task-manager-app-z7cx.onrender.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: myName,
      email,
      password,
      age
    })
  })


  response = await request.json();
  console.log(response)

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