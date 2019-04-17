const API_SEARCH = '/search/';
const resultUl = document.querySelector('.results-ul');
const resultDiv = document.querySelector('.results');
const searchForm = document.querySelector('.form-control-lg');
const jumbo = document.querySelector('.jumbotron');


window.onload = () => {
  document.body.style.height = window.innerHeight +'px';
}

searchForm.addEventListener('submit', (event) =>{
  event.preventDefault();
  const searchTerm = document.querySelector('#search-input').value.toString().toLowerCase();

  fetch(API_SEARCH+searchTerm)
  .then(response => {
    return response.json();
  })
  .then((response) =>{
    resultUl.innerHTML = '';
    if(response.length < 1){
      const errorH4 = document.createElement('h4');
      errorH4.className = 'error-message';
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
    jumbo.classList.add('searchbar-small');
    resultDiv.classList.remove('hidden');
    resultDiv.style.height = window.innerHeight+'px';
  })
  .catch(err =>{
    console.log(err);
    resultUl.innerHTML = '';
    const newH4 = document.createElement('h4');
    newH4.innerText = 'No Results';
    resultUl.appendChild(newH4);
  });
});

