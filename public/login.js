const form = document.querySelector('.register__form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        login: form.login.value,
        password: form.password.value
    };

    try {
        const res = await fetch('/login', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        const result = await res.json();
        
        if (result.success) {
            window.location.href = result.redirect;
        } else {
            alert(result.message || 'Ошибка авторизации');
        }
    } catch (err) {
        console.error('Ошибка:', err);
        alert('Произошла ошибка при соединении с сервером');
    }
});



































// const form = document.querySelector('.register__form');

// form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const Data = {
//         login: form.login.value,
//         password: form.password.value
//     }

//     const res = await fetch('/loginUser', {
//         method: 'POST', 
//         headers: {'Content-Type' : 'application/json'},
//         body: JSON.stringify(Data)
//     });

//     const resText = await res.text();
//     console.log(resText);

// });