const form = document.querySelector('.form-message');
const requests = document.querySelector('.chat__requests')
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log("absdsgd");

  const text = form.message.value;

  const response = await fetch(`/ask/${text}`, {
    method: 'GET',
  });
  const responseText = await response.text();

  const divWrapper =  document.createElement('div');
  divWrapper.className = "chat__request";
  const answer = document.createElement('p');
  answer.className = "chat__answer"
  answer.textContent = responseText;
  divWrapper.appendChild(answer);
  requests.appendChild(divWrapper);
  // const resText = document.createElement('p');
  // resText.textContent = responseText

  console.log(responseText);
})