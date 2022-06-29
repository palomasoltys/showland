'use-strict';

// Add an event listener to my drop comment btn

const mediaTitle = document.querySelector('#media-title').innerText;
const mediaYear = document.querySelector('#media-year').innerText;
const mediaPosterPath = document.querySelector('#media-poster-path').src;
const mediaOverview = document.querySelector('#media-overview').innerText;
const mediaID = document.querySelector('#media-id').innerText;
const mediaType = document.querySelector('#media-type').innerText;

const commentForm = document.querySelector('#comment-form');
commentForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const select = document.querySelector('#rate-media');
  const mediaRate = select.options[select.selectedIndex].value;
  const mediaComment = document.querySelector('#comment-media').value;

  const mediaInformation = {
    title: mediaTitle,
    year: mediaYear,
    poster_path: mediaPosterPath,
    overview: mediaOverview,
    imdb_id: mediaID,
    user_rate: mediaRate,
    user_comment: mediaComment,
    media_type: mediaType,
  };

  fetch(`/media/details/${mediaID}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mediaInformation),
  }).then((response) => {
    if (response.ok) {
      alert('Your comment was submited!');
      // IF I DO THIS \/ IT WILL ONLY SHOW UP THE FIRST TIME.
      // IF I RELOAD THE PAGE, IT WON'T SHOW THE COMMENT UP
      // document.querySelector('#media-details-div').innerHTML = mediaRate;
      // document.querySelector('#media-details-div').innerHTML += mediaComment;
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

    fetch(`/media/details/${likeCommentId}/update_like`, {
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
      title: mediaTitle,
      year: mediaYear,
      poster_path: mediaPosterPath,
      overview: mediaOverview,
      imdb_id: mediaID,
      media_type: mediaType,
    };

    fetch(`/media/details/${mediaID}/save_for_later`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saveForLaterData),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(`Your Save for Later list was updated!`);

        if (laterBtn.innerText == 'Save for Later') {
          laterBtn.innerText = 'Remove from List';
        } else {
          laterBtn.innerText = 'Save for Later';
        }
      });
  });
}
