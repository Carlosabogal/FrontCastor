const form = document.getElementById('formRegister');
const tableBody = document.getElementById('tableBody');



form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('Identification', document.getElementById('identificationInput').value);
    formData.append('Name', document.getElementById('nameInput').value);
    formData.append('Photo', document.getElementById('photoInput').files[0]);
    formData.append('HireDate', document.getElementById('hireDateInput').value);
    formData.append('PositionId', document.getElementById('positionIdInput').value);

    try {
        const response = await fetch('https://localhost:7172/api/Employees', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to create employee');
        }

        const data = await response.text();
        alert('Success: ' + data);
        resetForm();
    } catch (error) {
        console.error('Error:', error);
    }
});

function resetForm() {
    document.getElementById('identificationInput').value = '';
    document.getElementById('nameInput').value = '';
    document.getElementById('photoInput').value = '';
    document.getElementById('hireDateInput').value = '';
    document.getElementById('positionIdInput').value = '';
}

document.addEventListener('DOMContentLoaded', function() {
    loadEmployees();
});

function loadEmployees() {
    fetch('https://localhost:7172/api/Employees')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch employee data');
            }
            return response.json();
        })
        .then(employees => {
            const tbodyContent = generateTableBody(employees);
            tableBody.innerHTML = tbodyContent;

            // Obtener todos los botones de eliminación y asignarles event listeners
            const deleteButtons = document.querySelectorAll('.delete-button');
            deleteButtons.forEach(deleteButton => {
                deleteButton.addEventListener('click', function() {
                    const employeeId = this.closest('tr').querySelector('.employee-id').textContent;
                    deleteEmployee(employeeId);
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function generateTableBody(employees) {
    let tbodyContent = '';
    employees.forEach(employee => {
        tbodyContent += `
            <tr>
                <td class="employee-id">${employee.id}</td>
                <td>${employee.identification}</td>
                <td>${employee.name}</td>
                <td><img src="data:image/jpeg;base64,${arrayBufferToBase64(employee.photo)}" alt="Employee Photo" style="max-width: 100px;"></td>
                <td>${new Date(employee.hireDate).toLocaleDateString()}</td>
                <td>${employee.positionId}</td>
                <td>
                    <button class="edit-button button button--secondary">Edit</button>
                    <button class="delete-button button button--tertiary">Delete</button>
                </td>
            </tr>
        `;
    });
    return tbodyContent;
}


function deleteEmployee(employeeId) {
    fetch(`https://localhost:7172/api/Employees/${employeeId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete employee');
        }
        return response.json();
    })
    .then(() => {
        loadEmployees(); // Recargar la tabla después de eliminar con éxito
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function showAlert(employee) {
    // Construir el mensaje de la alerta con los datos del empleado y campos editables
    const alertMessage = `
        Edit Employee:
        - Identification Number: <input type="text" id="newIdentification" value="${employee.identification}">
        - Full Name: <input type="text" id="newName" value="${employee.name}">
        - Hire Date: <input type="date" id="newHireDate" value="${employee.hireDate}">
        - PositionId: <input type="text" id="newPositionId" value="${employee.positionId}">
    `;

    // Mostrar la alerta con el mensaje y campos editables
    const result = window.confirm(alertMessage);
    if (result) {
        // Si el usuario confirma la alerta, obtener los valores de los campos editables
        const newIdentification = document.getElementById('newIdentification').value;
        const newName = document.getElementById('newName').value;
        const newHireDate = document.getElementById('newHireDate').value;
        const newPositionId = document.getElementById('newPositionId').value;

        // Realizar la actualización con los nuevos valores
        updateEmployee(employee.id, {
            identification: newIdentification,
            name: newName,
            hireDate: newHireDate,
            positionId: newPositionId
        });
    }
}

// Función para actualizar un empleado
function updateEmployee(employeeId, newData) {
    fetch(`https://localhost:7172/api/Employees/${employeeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update employee');
        }
        return response.json();
    })
    .then(() => {
        loadEmployees(); // Recargar la tabla después de la actualización exitosa
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

const editButtons = document.querySelectorAll('.edit-button');

editButtons.forEach(button => {
    button.addEventListener('click', async function(event) {
        event.preventDefault();

        const form = button.closest('form');

        // Obtener el ID del empleado del atributo data-employeeId
        const employeeId = form.dataset.employeeId;

        // Verificar si el ID del empleado está definido
        if (!employeeId) {
            console.error('No employee ID specified.');
            return;
        }

        // Obtener los valores de los campos del formulario
        const identification = form.querySelector('#identificationInput').value;
        const name = form.querySelector('#nameInput').value;
        const hireDate = form.querySelector('#hireDateInput').value;
        const positionId = form.querySelector('#positionIdInput').value;

        const newData = {
            Identification: identification,
            Name: name,
            HireDate: hireDate,
            PositionId: positionId
        };

        try {
            await updateEmployee(employeeId, newData);
            alert('Employee updated successfully.');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update employee.');
        }
    });
});

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
function deleteEmployee(employeeId) {
    fetch(`https://localhost:7172/api/Employees/${employeeId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete employee');
        }
        return response.json();
    })
    .then(() => {
        // Una vez que el empleado se haya eliminado correctamente, volvemos a cargar la lista de empleados
        loadEmployees();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
const deleteButtons = document.querySelectorAll('.delete-button');
deleteButtons.forEach((deleteButton, index) => {
    deleteButton.addEventListener('click', function() { deleteEmployee(index); });
});
/*
let data = JSON.parse(localStorage.getItem("formData")) || [];


form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('https://localhost:7172/api/Employees', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data); 
        } else {
            console.error('Error al crear empleado:', response.statusText);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error.message);
    }
});



form.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = nameInput.value;
    const email = emailInput.value;
    if (name && email) {
        const newData = { Name: name, Email: email }; // Cambiado name y email por Name y Email respectivamente
        data.push(newData);
        saveDataToLocalStorage();
        renderTable();
        form.reset();
    } else {
        alert('Todos los datos son obligatorios');
    }
});

function saveDataToLocalStorage() {
    localStorage.setItem("formData", JSON.stringify(data));
}

function renderTable() {
    tableBody.innerHTML = "";
    data.forEach(function(item, index) {
        const row = document.createElement('tr');
        const identificationCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const photoCell = document.createElement('td');
        const hireDateCell = document.createElement('td');
        const positionIdCell = document.createElement('td');
        const actionCell = document.createElement('td');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        identificationCell.textContent = item.Identification || ""; // Modificado para evitar errores si la propiedad no está definida
        nameCell.textContent = item.Name || ""; // Modificado para evitar errores si la propiedad no está definida
        photoCell.textContent = "Photo"; // Aquí puedes agregar lógica para mostrar la foto si lo necesitas
        hireDateCell.textContent = item.HireDate || ""; // Modificado para evitar errores si la propiedad no está definida
        positionIdCell.textContent = item.PositionId || ""; // Modificado para evitar errores si la propiedad no está definida
        editButton.textContent = 'Edit';
        deleteButton.textContent = 'Delete';

          actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(identificationCell);
        row.appendChild(nameCell);
        row.appendChild(photoCell);
        row.appendChild(hireDateCell);
        row.appendChild(positionIdCell);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

function editData(index) {
    const item = data[index];
    nameInput.value = item.Name || ""; // Modificado para evitar errores si la propiedad no está definida
    emailInput.value = item.Email || ""; // Modificado para evitar errores si la propiedad no está definida
    data.splice(index, 1);
    saveDataToLocalStorage();
    renderTable();
}

function deleteData(index) {
    data.splice(index, 1);
    saveDataToLocalStorage();
    renderTable();
}

renderTable();

*/