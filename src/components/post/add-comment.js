import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { db } from '../../lib/firebase';
import firebase from 'firebase';
import UserContext from '../../context/user';

import "./post.css";

export default function AddComment({ username, docId, comments, setComments, commentInput }) {
  const [comment, setComment] = useState('');
  const { user: { displayName } } = useContext(UserContext);

  const handleSubmitComment = (event) => {
    event.preventDefault();

    setComments([...comments, { displayName, comment }]);
    setComment('');
    if(username != displayName) {
      db.collection("notification").add({
        userReciever: username,
        userSender: displayName,
        type: "comment",
        read: false,
        docId: docId,
        dateCreated: Date.now()
      });
    }
    return db
      .collection('photos')
      .doc(docId)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion({ displayName, comment })
      });
  };

  return (
    <div className="addComment__container">
      <form
        className="addComment__submit"
        method="POST"
        onSubmit={(event) =>
          comment.length >= 1 ? handleSubmitComment(event) : event.preventDefault()
        }
      >
        <input
          aria-label="Add a comment"
          autoComplete="off"
          className="addComment__textField"
          type="text"
          name="add-comment"
          placeholder="Add a comment..."
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          ref={commentInput}
        />
        <button
          className="addComment__button"
          type="button"
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

AddComment.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  setComments: PropTypes.func.isRequired,
  commentInput: PropTypes.object
};