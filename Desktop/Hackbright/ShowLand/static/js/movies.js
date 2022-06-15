'use-strict';

// Display the movie/show that the user searched on movies.html
const searchMovieForm = document.querySelector('#search-movie-form');
searchMovieForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const searchQuery = document.querySelector('#search-btn').value;
  const queryString = new URLSearchParams({ s: searchQuery });

  //Receiving data from the search route on server.py and displaying the movies according to the query string
  fetch(`/search?${queryString}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(typeof data);
      document.querySelector('.movie-response').innerHTML = '';
      for (const d of data.Search) {
        const title = d.Title;
        const poster_path = d.Poster;
        const year = d.Year;
        const movie = `<li><h2>${title}<p>${year}</p></h2> <img src="${poster_path}" </li>`;
        document
          .querySelector('.movie-response')
          .insertAdjacentHTML('beforeend', `<div class="col-4">${movie}</div>`);
      }
    });
});

// Receiving data from the API and displaying the most popular movies
fetch('/movies/popular')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    for (const d of data.results) {
      const title = d.title;
      const poster_path = d.poster_path;
      const year = d.release_date;
      const movie = `<li><h2>${title}<p>${year}</p></h2> <img src="https://image.tmdb.org/t/p/w300${poster_path}" </li>`;
      document
        .querySelector('.popular-movie')
        .insertAdjacentHTML('beforeend', `<div class="col-4">${movie}</div>`);
    }
  });
