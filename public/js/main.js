const API_SEARCH = '/search/';
const resultUl = document.querySelector('.results-ul');
const searchForm = document.querySelector('.form-control-lg');

searchForm.addEventListener('submit', (event) =>{
  event.preventDefault();
  const searchTerm = document.querySelector('#search-input').value.toString().toLowerCase();
  console.log(searchTerm);

  fetch(API_SEARCH+searchTerm)
  .then(response => {
    return response.json();
  })
  .then((response) =>{
    resultUl.innerHTML = '';
    if(response.length < 1){
      const errorH4 = document.createElement('h4');
      errorH4.innerText = 'No Results';
      resultUl.appendChild(errorH4);
    }
    else{
      for(let i = 0; i < response.length; i++){
        const newLi = document.createElement('li');
        newLi.className = 'list-group-item';
        const newH4 = document.createElement('h4');
        newH4.innerText = response[i].name;
  
        const newLink = document.createElement('a');
        newLink.setAttribute('href', response[i].url);
        newLink.setAttribute('target', '_blank');
        newLink.setAttribute('rel', 'noopener');
        newLink.innerText = 'Visit '+response[i].name;
  
        newLi.appendChild(newH4);
        newLi.appendChild(newLink);
        resultUl.appendChild(newLi);
      };
    };
  })
  .catch(err =>{
    resultUl.innerHTML = '';
    const newH4 = document.createElement('h4');
    newH4.innerText = 'No Results';
    resultUl.appendChild(newH4);
  });
});

