const articleId = location.pathname.split('/').pop();

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
                <span style="color: #222"><span class="at">@</span>${subComment.deep_reply_alia}</span>
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
                        class="reply" 
                        onclick="reply(
                          this,
                          'deepReply',
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
                      class="reply" 
                      onclick="reply(
                        this,
                        'secondaryReply',
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
const submit = document.querySelector('form.comment');

const alia = document.querySelector('.alia');
const email = document.querySelector('.email');
const comment = document.querySelector('.comment-content');

alia.value = localStorage.getItem('alia') || '';
email.value = localStorage.getItem('email') || '';
const avatar =
  localStorage.getItem('avatar') ||
  'http://cdn.u2.huluxia.com/g3/M00/2A/74/wKgBOVwKin-APdabAADFkZN89Ok088.jpg';

submit.onsubmit = function (e) {
  e.preventDefault();
  reset();

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
      comment.value = '';
      localStorage.setItem('alia', alia.value);
      localStorage.setItem('email', email.value);
      localStorage.setItem('avatar', avatar);
    })
    .catch((error) => console.error('Error:', error));
};

// reply comment
let parent = null,
  deep_reply_id = null,
  deep_reply_alia = null,
  deep_reply_email = null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function replySubmit() {
  const replyAlia = document.querySelector('.reply_alia');
  const replyEmail = document.querySelector('.reply_email');
  const replyComment = document.querySelector('.reply_comment-content');

  replyAlia.value = localStorage.getItem('alia') || '';
  replyEmail.value = localStorage.getItem('email') || '';

  const payload = {
    alia: replyAlia.value,
    avatar,
    comment: replyComment.value,
    parent,
    deep_reply_id,
    deep_reply_alia,
    deep_reply_email,
  };
  if (replyEmail.value) payload.email = replyEmail.value;

  const validation =
    replyAlia.reportValidity() &&
    replyEmail.reportValidity() &&
    replyComment.reportValidity();

  if (validation) {
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
        replyComment.value = '';
        reset();
        localStorage.setItem('alia', alia.value);
        localStorage.setItem('email', email.value);
        localStorage.setItem('avatar', avatar);
      })
      .catch((error) => console.error('Error:', error));
  }
}

// reply
const commentStr = `
    <div class="comment">
        <div class="row" style="margin-top: 24px">
          <input class="reply_alia" placeholder="Name (Required)" Required maxlength="8" minlength="2" />
          <input class="reply_email" placeholder="Email" type="email" />
        </div>
        <div class="row comment-content-row">
            <div class="comment-content-at"></div>
            <textarea class="reply_comment-content" placeholder="Say Something (Required)" Required maxlength="24" minlength="2"></textarea>
        </div>
        <button class="btn reply_submit" onclick="replySubmit()">Submit</button>
        <button class="btn reply_cancel" onclick="replyCancel()">Cancel</button>
    </div>
  `;
const commentWrapper = document.createElement('div');
commentWrapper.id = 'replyFlag';
commentWrapper.innerHTML = commentStr;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function reply(
  _this,
  _level,
  _alia,
  _email,
  _parent = null,
  _deep_reply_id = null,
  _deep_reply_alia = null,
  _deep_reply_email = null,
) {
  if (_level === 'deepReply') {
    _this.parentElement.parentElement.parentElement.parentElement.append(
      commentWrapper,
    );
  } else {
    _this.parentElement.parentElement.parentElement.append(commentWrapper);
  }

  const replyAlia = document.querySelector('.reply_alia');
  const replyEmail = document.querySelector('.reply_email');

  replyAlia.value = localStorage.getItem('alia') || '';
  replyEmail.value = localStorage.getItem('email') || '';

  const commentAt = document.querySelector('.comment-content-at');

  const __replyAlia = _deep_reply_alia ? _deep_reply_alia : _alia;
  commentAt.innerHTML = '@ ' + __replyAlia;

  parent = _parent;
  deep_reply_id = _deep_reply_id;
  deep_reply_alia = _deep_reply_alia;
  deep_reply_email = _deep_reply_email;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function replyCancel() {
  commentWrapper.remove();
  reset();
}

function reset() {
  parent = null;
  deep_reply_id = null;
  deep_reply_alia = null;
  deep_reply_email = null;
}
