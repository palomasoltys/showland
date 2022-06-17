'use-strict';

// Display the movie/show that the user searched on movies.html
const moviesIDs = [];
const searchMovieForm = document.querySelector('#search-movie-form');
searchMovieForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const searchQuery = document.querySelector('#search-btn').value;
  const queryString = new URLSearchParams({ s: searchQuery });
  //Receiving data from the search route on server.py and displaying the movies according to the query string
  fetch(`/search?${queryString}`)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector('.movie-response').innerHTML = '';
      if (data.Response === 'False') {
        document.querySelector('.movie-response').innerHTML = 'Movie not found';
      } else {
        for (const d of data.Search) {
          const title = d.Title;
          const poster_path = d.Poster;
          const year = d.Year;
          const id = d.imdbID;
          moviesIDs.push(id);
          const movie = `<li><h2><a href="/movies/details/${id}" id="movie-details-${id}">${title}</a><p>${year}</p></h2><img src="${poster_path}"> </li>`;
          document
            .querySelector('.movie-response')
            .insertAdjacentHTML(
              'beforeend',
              `<div class="col-4">${movie}</div>`,
            );
        }
      }
    });
});

// Receiving data from the API and displaying the most popular movies
fetch('/movies/popular')
  .then((response) => response.json())
  .then((data) => {
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

function send_movie_data_to_server(title, poster_path, year, overview, id) {
  fetch(`/movies/${id}/details`, {
    method: 'POST',
    body: JSON.stringify({
      title: title,
      poster_path: poster_path,
      year: year,
      overview: overview,
      id: id,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
