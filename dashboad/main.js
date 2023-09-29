const baseUrl = 'http://localhost:3010/stats';

const eventSource = new EventSource(baseUrl);

eventSource.addEventListener('message', (event) => {
  console.log(event);
  stats = JSON.parse(event.data).data;
  console.log(stats);
  renderStats(stats);
});

function renderStats(stats) {
  document.getElementById('total').innerHTML = stats.totalPersons;
  document.getElementById('men').innerHTML = stats.totalMales;
  document.getElementById('women').innerHTML = stats.totalFemales;

  const personsTemplate = stats.persons.map(
    (person) =>
      `<div class="stat-description">${person.lastname} ${person.firstname}</div>`,
  );
  document.getElementById('persons').innerHTML = personsTemplate.join('');
}
