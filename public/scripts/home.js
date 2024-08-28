let data;
let token;

document.addEventListener('DOMContentLoaded', async () => {
  token = JSON.parse(localStorage.getItem('token')) || JSON.parse(localStorage.getItem('logintoken'));

  try {

    const response = await fetch('/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    data = await response.json();

    document.querySelector('.js-user-name').innerHTML = data.name

    if (data.avatar) {
      document.querySelector('.js-image-container')
      .innerHTML = `
        <img class="rounded-full size-8 ml-4" src="data:img/png;base64, ${data.avatar}" alt="">
      `
    } else {
      document.querySelector('.js-image-container')
      .innerHTML = `
        <div class=" bg-gray-700 text-white rounded-full flex justify-center items-center ml-4 px-2 ">
          <span id="avatarPlaceholder" class="text-white rounded-full text-xl text-center">${data.name[0].toUpperCase()}</span>    
        </div>
      `
    }

    console.log(data)
  } catch (error) {
    console.error('Error:', error);
  }
});

document.querySelector('.js-user-div').addEventListener('click', () => {
  window.location.href = '/user'
})

document.querySelector('.js-logout-button').addEventListener('click', async () => {
  
  const request = await fetch('https://task-manager-app-z7cx.onrender.com/users/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  window.location.href = '/login'
})


document.querySelector('.js-create-task').addEventListener('click', () => {
  document.querySelector('.js-create-task-content').classList.remove('hidden')
  document.querySelector('.js-get-task-content').classList.add('hidden')
  document.querySelector('.js-read-task-content').classList.add('hidden')
  document.querySelector('.js-task-content').classList.add('hidden')
  document.querySelector('.js-delete-task-content').classList.add('hidden')
  document.querySelector('.js-welocme-page').classList.add('hidden')
})

document.querySelector('.js-save-button').addEventListener('click', async () => {
  let completed;
  const checkBox = document.getElementById('myCheck');
  if (checkBox.checked) {
    completed = true;
    console.log('checked')
  } else {
    completed = false;
    console.log('unchecked')
  }
  
  let description = document.querySelector('.js-task-input').value;
  
  const request = await fetch('https://task-manager-app-z7cx.onrender.com/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`

    },
    body: JSON.stringify({
      description,
      completed
    })
  })

  if (request.status >=400) {
    document.getElementById('toast-danger').classList.remove('hidden')

    setTimeout(() => {
      document.getElementById('toast-danger').classList.add('hidden')
    }, 2000);
  } else {
    document.getElementById('toast-success').classList.remove('hidden')

    setTimeout(() => {
      document.getElementById('toast-success').classList.add('hidden')
    }, 2000);
  }

  const output = await request.json()
  console.log(output)
})

document.querySelector('.js-get-task').addEventListener('click', async () => {

  const request = await fetch('https://task-manager-app-z7cx.onrender.com/tasks', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const output = await request.json()
  console.log(output)
  
  document.querySelector('.js-create-task-content').classList.add('hidden')
  document.querySelector('.js-get-task-content').classList.remove('hidden')
  document.querySelector('.js-read-task-content').classList.add('hidden')
  document.querySelector('.js-task-content').classList.add('hidden')
  document.querySelector('.js-delete-task-content').classList.add('hidden')
  document.querySelector('.js-welocme-page').classList.add('hidden')

  let taskHTML = ''
  output.forEach((task) => {
    taskHTML +=  `
      <div class="w-4/5 p-4 ml-2 mt-8 rounded-md border-2 flex flex-col text-wrap justify-between overflow-auto border-gray-400">
          <p class="text-xl mt-3 ml-5 text-wrap">ID: <span class="text-wrap">${task._id}</span></p>
          <p class="text-xl mt-1 ml-5">Description: <span class="text-wrap">${task.description}</span></p>
          <p class="text-xl mt-1 ml-5">Completed: <span class="text-wrap">${task.completed}</span></p>
          <p class="text-xl mb-3 mt-1 ml-5">Data created: <span class="text-wrap">${convertTimestamp(task.createdAt)}
          </span></p>
        </div>
    `
  });

  document.querySelector('.js-task-main-content').innerHTML = taskHTML
})

document.querySelector('.js-read-task').addEventListener('click', () => {

  document.querySelector('.js-create-task-content').classList.add('hidden')
  document.querySelector('.js-get-task-content').classList.add('hidden')
  document.querySelector('.js-read-task-content').classList.remove('hidden')
  document.querySelector('.js-task-content').classList.add('hidden')
  document.querySelector('.js-delete-task-content').classList.add('hidden')
  document.querySelector('.js-welocme-page').classList.add('hidden')

})

document.querySelector('.js-read-button').addEventListener('click', async () => {
  let id = document.querySelector('.js-id-input').value
  
  const request = await fetch(`https://task-manager-app-z7cx.onrender.com/tasks/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (request.status >=400) {
    document.getElementById('toast-danger1').classList.remove('hidden')

    setTimeout(() => {
      document.getElementById('toast-danger1').classList.add('hidden')
    }, 2000);
  } else {
    document.getElementById('toast-success1').classList.remove('hidden')

    setTimeout(() => {
      document.getElementById('toast-success1').classList.add('hidden')
    }, 2000);
  }

  const output = await request.json()
  console.log(output)


  document.querySelector('.js-task-container').innerHTML = `
    <div class="w-4/5 p-4 ml-2 mt-8 rounded-md border-2 flex flex-col text-wrap justify-between overflow-auto border-gray-400">
      <p class="text-xl mt-3 ml-5 text-wrap">ID: <span class="text-wrap">${output._id}</span></p>
      <p class="text-xl mt-1 ml-5">Description: <span class="text-wrap">${output.description}</span></p>
      <p class="text-xl mt-1 ml-5">Completed: <span class="text-wrap">${output.completed}</span></p>
      <p class="text-xl mb-3 mt-1 ml-5">Data created: <span class="text-wrap">${convertTimestamp(output.createdAt)}
      </span></p>
    </div>
  `
})


document.querySelector('.js-update-task').addEventListener('click', () => {
  document.querySelector('.js-create-task-content').classList.add('hidden')
  document.querySelector('.js-get-task-content').classList.add('hidden')
  document.querySelector('.js-read-task-content').classList.add('hidden')
  document.querySelector('.js-task-content').classList.remove('hidden')
  document.querySelector('.js-delete-task-content').classList.add('hidden')
  document.querySelector('.js-welocme-page').classList.add('hidden')
})

document.querySelector('.js-update-button').addEventListener('click', async () => {
  let id = document.querySelector('.js-id-input1').value

  let completed;
  const checkBox = document.getElementById('js-checkbox');
  if (checkBox.checked) {
    completed = true;
    console.log('checked')
  } else {
    completed = false;
    console.log('unchecked')
  }

  const taskRequest = await fetch(`https://task-manager-app-z7cx.onrender.com/tasks/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const task = await taskRequest.json()
  console.log(task)

  const request = await fetch(`https://task-manager-app-z7cx.onrender.com/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      description: document.querySelector('.js-desc-input').value || task.description,
      completed: completed
    })
  })

  if (request.status >= 400) {
    document.getElementById('toast-danger3').classList.remove('hidden')
    setTimeout(() => {
      document.getElementById('toast-danger3').classList.add('hidden')
    }, 2000);
  } else {
    document.getElementById('toast-success3').classList.remove('hidden')
    setTimeout(() => {
      document.getElementById('toast-success3').classList.add('hidden')
    }, 2000);
  }

  const output = request.json()
  console.log(output)

  
})

document.querySelector('.js-delete-task').addEventListener('click', () => {
  document.querySelector('.js-create-task-content').classList.add('hidden')
  document.querySelector('.js-get-task-content').classList.add('hidden')
  document.querySelector('.js-read-task-content').classList.add('hidden')
  document.querySelector('.js-task-content').classList.add('hidden')
  document.querySelector('.js-delete-task-content').classList.remove('hidden')
  document.querySelector('.js-welocme-page').classList.add('hidden')
})

document.querySelector('.js-delete-button').addEventListener('click', async () => {
  const id = document.querySelector('.js-id-input2').value
  
  const request = await fetch(`https://task-manager-app-z7cx.onrender.com/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (request.status >= 400) {
    document.getElementById('toast-danger2').classList.remove('hidden')
    setTimeout(() => {
      document.getElementById('toast-danger2').classList.add('hidden')
    }, 2000);
  } else {
    document.getElementById('toast-success2').classList.remove('hidden')
    setTimeout(() => {
      document.getElementById('toast-success2').classList.add('hidden')
    }, 2000);
  }

  const output = await request.json()
  console.log(output)
})

function convertTimestamp(timestamp) {
  const date = new Date(timestamp);

  // Convert to local date and time
  const localDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString();

  return `Date: ${localDate}, Time: ${localTime}`;
}
