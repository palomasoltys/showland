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

    fetch(`/media/popular/shows/details/${likeCommentId}/update_like`, {
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
      title: showTitle,
      year: showYear,
      poster_path: showPosterPath,
      overview: showOverview,
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
        console.log(data);
        if (laterBtn.innerText == 'Save for Later') {
          laterBtn.innerText = 'Remove from List';
        } else {
          laterBtn.innerText = 'Save for Later';
        }
        console.log(laterBtn.innerText);
      });
  });
}
