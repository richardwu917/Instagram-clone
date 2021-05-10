import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { db } from '../../lib/firebase';
import firebase from 'firebase';
import UserContext from '../../context/user';

import "./post.css";

export default function Actions({ username, docId, totalLikes, likedPhoto, handleFocus }) {
  const {user: { uid: userId, displayName }} = useContext(UserContext);
  const [toggleLiked, setToggleLiked] = useState(likedPhoto);
  const [likes, setLikes] = useState(totalLikes);

  const handleToggleLiked = async () => {
    setToggleLiked((toggleLiked) => !toggleLiked);

    await db
      .collection('photos')
      .doc(docId)
      .update({
        likes: toggleLiked ? firebase.firestore.FieldValue.arrayRemove(userId) : firebase.firestore.FieldValue.arrayUnion(userId)
      });
    if((username != displayName) && !toggleLiked) {
      db.collection('notification').add({
        userReciever: username,
        userSender: displayName,
        type: "like",
        read: false,
        docId: docId,
        dateCreated: Date.now()
      });
    }

    setLikes((likes) => (toggleLiked ? likes - 1 : likes + 1));
  };

  return (
    <>
      <div className="like__container">
        <div className="like__icons">
          <svg
            onClick={handleToggleLiked}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
            className={`heart ${
              toggleLiked ? 'heart__liked' : 'heart__default'
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <svg
            onClick={handleFocus}
            className="comment__svg"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>
      <div className="likes__textContainer">
        <p className="likes_text">{likes === 1 ? `${likes} like` : `${likes} likes`}</p>
      </div>
    </>
  );
}

Actions.propTypes = {
  docId: PropTypes.string.isRequired,
  totalLikes: PropTypes.number.isRequired,
  likedPhoto: PropTypes.bool.isRequired,
  handleFocus: PropTypes.func.isRequired
};