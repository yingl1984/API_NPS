'use strict';

// put your own value below!
const apiKey = '04cMbBaDkuJUbqvBEimy2fYksk3b0yLfgsYyjGN9'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function generateAddress(addressArray){
  console.log(addressArray);
  let result = "";
  for(let i = 0; i < addressArray.length; i++){
    let curStr=Object.keys(addressArray[i]).filter(key => addressArray[i][key] != "")
    .map(key => `${key}=${addressArray[i][key]}`);

    result += `<strong>The ${i + 1} address is: </strong>${curStr.map(item=>`<p>${item},</p>`).join("")}`
  }
  return result;
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  $('#no-result').empty();
  if(responseJson.data.length === 0){
    $('#no-result').text("Sorry, there is no corresponding result.");
    $('#no-result').addClass('red');
    $('#no-result').removeClass('hidden');
  }else{
    for (let i = 0; i < responseJson.data.length; i++){
      const address=generateAddress(responseJson.data[i].addresses);
      $('#results-list').append(
        `<li><h3>${responseJson.data[i].fullName}</h3>
        <p><a href=${responseJson.data[i].url} target=_black>Click here to explore</a></p>
        <p><em>Description: </em></p><p>${responseJson.data[i].description}</p> 
        <div>
          <h4>Address: </h4>
          <p>${address}</p> 
        </div>
        </li>`
      )};
  }
  $('#results').removeClass('hidden');
};

function getParkList(query, maxResults=10) {
  const params = {
    limit: maxResults,
    q: query,
    api_key: apiKey
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });

}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchState = $('#js-search-state').val();
    const maxResults = $('#js-max-results').val();
    getParkList(searchState, maxResults);
  });
}

$(watchForm);