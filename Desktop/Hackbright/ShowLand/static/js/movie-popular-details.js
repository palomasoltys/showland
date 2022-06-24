'use-strict';

// Add an event listener to my drop comment btn

const movieTitle = document.querySelector('#movie-title').innerText;
const movieYear = document.querySelector('#movie-year').innerText;
const moviePosterPath = document.querySelector('#movie-poster-path').src;
const movieOverview = document.querySelector('#movie-overview').innerText;
const movieID = document.querySelector('#movie-id').innerText;

const commentFormMovie = document.querySelector('#comment-form-movie');
commentFormMovie.addEventListener('submit', (evt) => {
  evt.preventDefault();
  console.log(movieOverview);
  const select = document.querySelector('#rate-movie');
  const movieRate = select.options[select.selectedIndex].value;
  const movieComment = document.querySelector('#comment-movie').value;

  const movieInformation = {
    title: movieTitle,
    year: movieYear,
    poster_path: moviePosterPath,
    overview: movieOverview,
    imdb_id: movieID,
    user_rate: movieRate,
    user_comment: movieComment,
  };

  fetch(`/media/popular/movies/details/${movieID}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movieInformation),
  });
});
