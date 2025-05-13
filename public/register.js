const form = document.querySelector('.register__form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const Data = {
        login: form.login.value,
        password: form.password.value
    }

    const res = await fetch('/newUser', {
        method: 'POST', 
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(Data)
    });

    const resText = await res.text();
    console.log(resText);

});