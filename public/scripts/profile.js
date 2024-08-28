let data;
let token;

function convertTimestamp(timestamp) {
  const date = new Date(timestamp);

  // Convert to local date and time
  const localDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString();

  return `Date: ${localDate}, Time: ${localTime}`;
}

document.addEventListener('DOMContentLoaded', async () => {
  token = JSON.parse(localStorage.getItem('token')) || JSON.parse(localStorage.getItem('logintoken'));

  try {

    const response = await fetch('/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    data = await response.json();

    document.querySelector('.js-name').innerHTML = data.name;
    document.querySelector('.js-email').innerHTML = data.email;
    document.querySelector('.js-age').innerHTML = data.age;
    document.querySelector('.js-created-at').innerHTML = convertTimestamp(data.createdAt);

    if (data.avatar) {
      document.querySelector('.js-image-container')
      .innerHTML = `
        <img class="rounded-full" src="data:img/png;base64, ${data.avatar}" alt="">
      `
    } else {
      document.querySelector('.js-image-container')
      .innerHTML = `
        <span id="avatarPlaceholder" class="text-gray-500 text-5xl font-bold">${data.name[0]}</span>
      `
    }

    console.log(data)
  } catch (error) {
    console.error('Error:', error);
  }
});



document.getElementById('uploadIcon').addEventListener('click', () => {
  document.getElementById('avatarInput').click();
});

document.getElementById('avatarInput').addEventListener('change', async function() {
  const file = this.files[0];

  if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
          const response = await fetch('/users/me/avatar', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`, // Adjust based on your auth method
              },
              body: formData
          });

          if (response.ok) {
              const result = await response.text();  // Use text() instead of json()
              console.log('Avatar uploaded successfully!');
              // Optionally, update the avatar on the dashboard
          } else {
              console.error('Failed to upload avatar');
          }
      } catch (error) {
          console.error('Error uploading avatar:', error);
      }
  }
});

document.getElementById('js-user-delete-button').addEventListener('click', async () => {
  const request = await fetch('/users/me', {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  const output = await request.json()

  console.log(output)

  window.location.href = 'https://task-manager-app-z7cx.onrender.com'
})

document.getElementById('js-user-update-button').addEventListener('click', () => {
  window.location.href = '/update'
})



