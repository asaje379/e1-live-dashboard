const baseUrl = 'http://localhost:3010/register';
const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formValue = {};
  for (const input of form.elements) {
    if (input.name) formValue[input.name] = input.value;
  }

  const response = await axios.post(baseUrl, formValue);
  console.log(response.data);
  location.reload();
});
