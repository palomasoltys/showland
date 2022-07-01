'use-strict';

const movieTitle = document.querySelector('#movie-title').innerText;
const movieYear = document.querySelector('#movie-year').innerText;
const moviePosterPath = document.querySelector('#movie-poster-path').src;
const movieOverview = document.querySelector('#movie-overview').innerText;
const movieID = document.querySelector('#movie-id').innerText;

const commentFormMovie = document.querySelector('#comment-form-movie');
commentFormMovie.addEventListener('submit', (evt) => {
  evt.preventDefault();

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
  }).then((response) => {
    if (response.ok) {
      alert('Your comment was submited!');
    }
  });
});

const likeButton = document.querySelectorAll('.like-btn');
for (const btn of likeButton) {
  btn.addEventListener('click', (evt) => {
    evt.preventDefault();

    //let likeId = null;
    const likeCommentId = btn.value;
    //let numberLikes = document.querySelector('#number-likes-p').innerText;
    console.log('Comment ID', likeCommentId);
    //console.log("User ID", userId);

    //const userId = document.querySelector('#media-user-id-p').innerText;
    const userEmail = document.querySelector('#session-user-email').innerText;

    //console.log(numberLikes);
    // if (numberLikes > 0) {
    //   likeId = document.querySelector('#comment-like-id-p').innerText;
    // }

    const likeInformation = {
      //userID: userId,
      userEmail: userEmail,
      commentID: likeCommentId,
      //likeID: likeId,
    };

    fetch(`/media/popular/movies/details/${likeCommentId}/update_like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(likeInformation),
    })
      .then((response) => response.text())
      .then((data) => {
        //console.log(data);
        if (btn.innerText == 'Like') {
          btn.innerText = 'Unlike';
        } else {
          btn.innerText = 'Like';
        }
        document.querySelector(`#number-likes-${likeCommentId}-p`).innerHTML =
          data;
        // console.log(numberLikes);
      });
  });
}

const saveForLaterBtn = document.querySelectorAll('.save-for-later-btn');
for (const laterBtn of saveForLaterBtn) {
  laterBtn.addEventListener('click', (evt) => {
    evt.preventDefault();

    const mediaID = laterBtn.value;
    const userEmail = document.querySelector('#session-user-email').innerText;
    console.log(userEmail);

    const saveForLaterData = {
      mediaID: mediaID,
      userEmail: userEmail,
      title: movieTitle,
      year: movieYear,
      poster_path: moviePosterPath,
      overview: movieOverview,
      imdb_id: mediaID,
    };

    fetch(`/media/popular/movies/details/${mediaID}/save_for_later`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saveForLaterData),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(`Your Save for Later list was updated!`);
        console.log(laterBtn.innerText);
        if (laterBtn.innerText == 'Save for Later') {
          laterBtn.innerText = 'Remove from List';
        } else {
          laterBtn.innerText = 'Save for Later';
        }
        console.log(laterBtn.innerText);
      });
  });
}

const deleteCommentBtn = document.querySelectorAll('.delete-comment-btn');

for (const deleteBtn of deleteCommentBtn) {
  deleteBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const deleteCommentID = deleteBtn.value;
    console.log(deleteCommentID);
    fetch(`/media/popular/movies/details/${deleteCommentID}/delete_comment`)
      .then((response) => response.text())
      .then((user_id) => {
        commentBlock = document.getElementById(`delete${deleteCommentID}`);

        commentBlock.style.display = 'none';

        deleteBtn.style.display = 'none';

        likeBtn = document.getElementById(
          `comment${deleteCommentID}-user${user_id}`,
        );

        likeBtn.style.display = 'none';

        likeNumber = document.getElementById(
          `number-likes-${deleteCommentID}-p`,
        );
        likeNumber.style.display = 'none';
      });
  });
}
