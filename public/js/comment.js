const commentsWrapper = document.querySelector('.comments-wrapper');

const articleId = location.pathname.split('/').pop();

fetch(`api/comment/${articleId}`).then(async (data) => {
  let comments,
    str = '',
    deepStr = '';

  comments = await data.json();

  if (!comments.data.length) {
    str = '<p>暂无评论</p>';
  } else {
    comments.data.forEach((comment) => {
      let subStr = '';
      if (comment.children.length) {
        comment.children.forEach((subComment) => {
          if (subComment.deep_reply_id) {
            deepStr = `
              <span style="color: tomato"><span class="at">@</span>${subComment.deep_reply_name}</span>
              `;
          }

          subStr += `
            <div class="sub-comment-wrapper">
              <div class="head">
                <img class="avatar" src="${subComment.avatar}" />
                <div class="alia_time-wrapper">
                  <div>
                    <span class="alia">${subComment.alia}</span>
                    <span>${deepStr}</span>
                  </div>
                  <div class="time">
                    ${dayjs(subComment.date).format(' YYYY-MM-DD HH: mm')}
                  </div>
                </div>
              </div>
              <p class="content">${subComment.comment}</p>
            </div>
            `;
        });
      }

      str += `
          <div class="comment-wrapper">
            <div class="head">
              <img class="avatar" src="${comment.avatar}" />
              <div class="alia_time-wrapper">
                <div class="alia">${comment.alia}</div>
                <div  class="time">
                  ${dayjs(comment.date).format(' YYYY-MM-DD HH: mm')}
                </div>
              </div>
              
            </div>
            
            <p class="content">${comment.comment}</p>
            ${subStr}
          </div>
          `;
    });
  }

  commentsWrapper.innerHTML = str;
});
