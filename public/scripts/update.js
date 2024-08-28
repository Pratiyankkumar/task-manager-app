console.log('Script loaded')

let token = JSON.parse(localStorage.getItem('token')) || JSON.parse(localStorage.getItem('logintoken'));
let userData;

document.querySelector('.js-update-user-button').addEventListener('click', async () => {

  const userRequest = await fetch('/users/me', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  userData = await userRequest.json()

  let name = document.querySelector('.js-updated-name-input').value || userData.name
  let age = document.querySelector('.js-updated-age-input').value || userData.age
  let password = document.querySelector('.js-updated-password').value || userData.password

  const request = await fetch('/users/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name,
      age,
      password
    })
  })

  if (request.status >= 400) {
    document.getElementById('alert-border-1').classList.remove('hidden')
    setTimeout(() => {
      document.getElementById('alert-border-1').classList.add('hidden')
    }, 2000);
  }

  const output = await request.json()

  console.log(output)

  
})