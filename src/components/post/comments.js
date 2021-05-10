import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import AddComment from './add-comment';

import "./post.css";

export default function Comments({ username, docId, comments: allComments, posted, commentInput }) {
  const [comments, setComments] = useState(allComments);
  const [commentsSlice, setCommentsSlice] = useState(3);
  
  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 3);
  };

  return (
    <>
      <div className="comments__container">
        {comments.slice(0, commentsSlice).map((item) => (
          <p key={`${item.comment}-${item.displayName}`} className="comment__container">
            <Link to={`/p/${item.displayName}`} className="usernameComment__link">
              <span className="comment__name">{item.displayName}</span>
            </Link>
            <span>{item.comment}</span>
          </p>
        ))}
        {comments.length >= 3 && commentsSlice < comments.length && (
          <button
            className="expandComment__button"
            type="button"
            onClick={showNextComments}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                showNextComments();
              }
            }}
          >
            View more comments
          </button>
        )}
      </div>
      <p className="post__DateCreated">
        {formatDistance(posted, new Date())} ago
      </p>
      <AddComment
        username={username}
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
}

Comments.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  posted: PropTypes.number.isRequired,
  commentInput: PropTypes.object.isRequired
};