document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const position = document.getElementById('position').value;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, phone, position }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Registration successful!');
        window.location.href = 'login.html';
    } else {
        alert(data.message || 'Registration failed');
    }
});

// (function () {
//     'use strict'
//     const forms = document.querySelectorAll('.requires-validation')
//     Array.from(forms)
//       .forEach(function (form) {
//         form.addEventListener('submit', function (event) {
//           if (!form.checkValidity()) {
//             event.preventDefault()
//             event.stopPropagation()
//           }
    
//           form.classList.add('was-validated')
//         }, false)
//       })
//     })()
    