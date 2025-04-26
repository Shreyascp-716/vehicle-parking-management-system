const apiUrl = 'http://localhost:3000/vehicles';

// Load vehicles on page load
window.onload = loadVehicles;

function loadVehicles() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const list = document.getElementById('vehicle-list');
      list.innerHTML = '';

      data.forEach(vehicle => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${vehicle.vehicle_id}</td>
          <td>${vehicle.user_id}</td>
          <td>${vehicle.vehicle_number}</td>
          <td>${vehicle.vehicle_type}</td>
          <td>${vehicle.registered_at}</td>
          <td>
            <button onclick="deleteVehicle(${vehicle.vehicle_id})">Delete</button>
          </td>
        `;

        list.appendChild(row);
      });
    })
    .catch(err => console.error('Error loading vehicles:', err));
}

function addVehicle() {
  const user_id = document.getElementById('user_id').value;
  const vehicle_number = document.getElementById('vehicle_number').value;
  const vehicle_type = document.getElementById('vehicle_type').value;

  if (!user_id) {
    alert("Please select a user.");
    return;
  }

  fetch('http://localhost:3000/vehicles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, vehicle_number, vehicle_type })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Vehicle added:', data);
    loadVehicles();
  })
  .catch(error => console.error('Error adding vehicle:', error));
}


function deleteVehicle(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    console.log('Deleted:', data);
    loadVehicles();
  })
  .catch(err => console.error('Error deleting vehicle:', err));
}

function registerUser() {
  const name = document.getElementById('new_name').value;
  const email = document.getElementById('new_email').value;
  const password = document.getElementById('new_password').value;
  const phone = document.getElementById('new_phone').value;
  const role = document.getElementById('new_role').value;

  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone, role })
  })
  .then(response => response.json())
  .then(data => {
    console.log('User registered:', data);
    alert(`User registered with ID: ${data.id}`);
  })
  .catch(error => {
    console.error('Error registering user:', error);
  });
}
function loadUsers() {
  fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(data => {
      // Populate dropdown
      const userSelect = document.getElementById('user_id');
      userSelect.innerHTML = '<option value="">Select User</option>';
      data.forEach(user => {
        const option = document.createElement('option');
        option.value = user.user_id;
        option.textContent = `${user.name} (ID: ${user.user_id})`;
        userSelect.appendChild(option);
      });

      // Populate table
      const userList = document.getElementById('user-list');
      userList.innerHTML = '';
      data.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.user_id}</td>
          <td>${user.name}</td>
          <td><button onclick="deleteUser(${user.user_id})">Delete</button></td>
        `;
        userList.appendChild(row);
      });
    })
    .catch(error => console.error('Error loading users:', error));
}

function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  fetch(`http://localhost:3000/users/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      console.log('User deleted:', data);
      loadUsers();
      loadVehicles(); // Refresh vehicle list in case user's vehicles are affected
    })
    .catch(error => console.error('Error deleting user:', error));
}


// Call this on page load
loadUsers();
loadVehicles();
