// (() => {
const articleId = location.pathname.split('/').pop();

const commentAt = document.querySelector('.comment-content-at');

// fetch comments
const commentsWrapper = document.querySelector('.comments-wrapper');

function fetchComment() {
  fetch(`api/comment/${articleId}`).then(async (data) => {
    let comments,
      str = '';

    comments = await data.json();

    if (!comments.data.length) {
      str = '<p>暂无评论</p>';
    } else {
      comments.data.forEach((comment) => {
        let subStr = '';
        if (comment.children.length) {
          comment.children.forEach((subComment) => {
            let deepStr = '';
            if (subComment.deep_reply_id) {
              deepStr = `
                <span style="color: tomato"><span class="at">@</span>${subComment.deep_reply_alia}</span>
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
                      <a 
                        href="#comment"
                        class="reply" 
                        onclick="reply(
                          this,
                          '${comment.alia}',
                          '${comment.email}',
                          ${comment.id},
                          ${subComment.id},
                          '${subComment.alia}',
                          '${subComment.email}',
                      )">
                        Reply
                      </a>
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
              <div class="__comment-wrapper">
                <div class="head">
                  <img class="avatar" src="${comment.avatar}" />
                  <div class="alia_time-wrapper">
                    <div class="alia">${comment.alia}</div>\
                    <a
                      href="#comment" 
                      class="reply" 
                      onclick="reply(
                        this,
                        '${comment.alia}',
                        '${comment.email}',
                        ${comment.id}
                    )">
                      Reply
                    </a>
                    <div class="time">
                      ${dayjs(comment.date).format(' YYYY-MM-DD HH: mm')}
                    </div>
                  </div>
                </div>
                
                <p class="content">${comment.comment}</p>
              </div>
              

              ${subStr}
            </div>
            `;
      });
    }

    commentsWrapper.innerHTML = str;
  });
}
fetchComment();

// comment
const submit = document.querySelector('.submit');

const alia = document.querySelector('.alia');
const email = document.querySelector('.email') || null;
const comment = document.querySelector('.comment-content');
let parent = null,
  deep_reply_id = null,
  deep_reply_alia = null,
  deep_reply_email = null;

submit.onclick = function () {
  const avatar =
    'http://cdn.u2.huluxia.com/g3/M00/2A/74/wKgBOVwKin-APdabAADFkZN89Ok088.jpg';
  const payload = {
    alia: alia.value,
    avatar,
    comment: comment.value,
    article: +articleId,
    parent,
    deep_reply_id,
    deep_reply_alia,
    deep_reply_email,
  };
  if (email.value) payload.email = email.value;
  if (payload.parent) payload.article = null;
  console.log(payload);
  fetch('api/comment', {
    method: 'post',
    body: JSON.stringify(payload),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
    .then(async (data) => {
      console.log(await data.json());
      fetchComment();
      commentAt.click();
      comment.value = '';
      parent = null;
      deep_reply_id = null;
      deep_reply_alia = null;
      deep_reply_email = null;
      location.hash = '#reply-flag';
    })
    .catch((error) => console.error('Error:', error));
};

// reply
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function reply(
  _this,
  _alia,
  _email,
  _parent = null,
  _deep_reply_id = null,
  _deep_reply_alia = null,
  _deep_reply_email = null,
) {
  const commentAtStyle = commentAt.style;
  const replyAlia = _deep_reply_alia ? _deep_reply_alia : _alia;
  console.log(replyAlia);
  commentAt.innerHTML = '@ ' + replyAlia + '<span class="close">x</span>';
  commentAtStyle.opacity = 1;
  commentAtStyle.width = 'inherit';
  commentAtStyle.padding = '0 16px';
  comment.style.paddingTop = '58px';

  parent = _parent;
  deep_reply_id = _deep_reply_id;
  deep_reply_alia = _deep_reply_alia;
  deep_reply_email = _deep_reply_email;

  const _reply_flag = document.getElementById('reply-flag');
  console.log(_reply_flag);
  if (_reply_flag) {
    _reply_flag.removeAttribute('id');
  }
  _this.id = 'reply-flag';
}

commentAt.onclick = function () {
  commentAt.style.width = 0;
  commentAt.style.padding = 0;
  comment.style.paddingTop = '16px';

  parent = null;
  deep_reply_id = null;
  deep_reply_alia = null;
  deep_reply_email = null;
};
// })();
