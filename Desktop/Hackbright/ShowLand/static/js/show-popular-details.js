'use-strict';

// Add an event listener to my drop comment btn

const showTitle = document.querySelector('#show-title').innerText;
const showYear = document.querySelector('#show-year').innerText;
const showPosterPath = document.querySelector('#show-poster-path').src;
const showOverview = document.querySelector('#show-overview').innerText;
const showID = document.querySelector('#show-id').innerText;

const commentFormShow = document.querySelector('#comment-form-show');
commentFormShow.addEventListener('submit', (evt) => {
  evt.preventDefault();
  console.log(showOverview);
  const select = document.querySelector('#rate-show');
  const showRate = select.options[select.selectedIndex].value;
  const showComment = document.querySelector('#comment-show').value;

  const showInformation = {
    title: showTitle,
    year: showYear,
    poster_path: showPosterPath,
    overview: showOverview,
    imdb_id: showID,
    user_rate: showRate,
    user_comment: showComment,
  };

  fetch(`/media/popular/shows/details/${showID}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(showInformation),
  });
});
