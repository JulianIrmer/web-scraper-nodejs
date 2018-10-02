const API_URL = '/restaurants';
const API_SEARCH = '/search/';
const resultUl = document.querySelector('.results-ul');
const searchForm = document.querySelector('.form-control-lg');

searchForm.addEventListener('submit', (event) =>{
  event.preventDefault();
  const formData = new FormData(searchForm);
  const searchTerm = formData.get('search-input').toLowerCase();
  console.log(searchTerm);

  fetch(API_SEARCH+searchTerm)
  .then(response => {
    return response.json();
  })
  .then((response) =>{
    console.log(response);
    resultUl.innerHTML = '';
    for(let i = 0; i < response.length; i++){
      newLi = document.createElement('li');
      newLi.className = 'list-group-item';
      newh4 = document.createElement('h4');
      newh4.innerText = response[i].name;

      newLink = document.createElement('a');
      newLink.setAttribute('href', response[i].url);
      newLink.setAttribute('target', '_blank');
      newLink.setAttribute('rel', 'noopener');
      newLink.innerText = 'Visit '+response[i].name;

      newLi.appendChild(newh4);
      newLi.appendChild(newLink);
      resultUl.appendChild(newLi);
    }
  })
  .catch(err => console.log(err));
});

