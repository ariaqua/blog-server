const commentsWrapper = document.querySelector('.comments');

const articleId = location.pathname.split('/').pop();

let comments,
  str = '';

fetch(`api/comment/${articleId}`).then(async (data) => {
  comments = await data.json();
  console.log(comments);
  comments.data.forEach((comment) => {
    str += `
      <div style="background: whitesmoke">
        <p>${comment.avatar}-${comment.alia}-${comment.date}</p>
        <p>${comment.comment}</p>
      </div>
      `;
  });
  console.log(str);
  commentsWrapper.innerHTML = str;
});
