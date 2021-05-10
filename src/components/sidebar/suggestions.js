import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import SuggestedProfile from './suggested-profile';
import { db } from '../../lib/firebase';

import "./sidebar.css";

export default function Suggestions({ userId, following, loggedInUserDocId }) {
  const [suggestedProfiles, setSuggestedProfiles] = useState(null);
  
  useEffect(() => {
    if(userId) {
        db.collection('users').where("userId", "not-in", following).limit(10).onSnapshot({
        includeMetadataChanges: true
        }, (snapshot) => {
            setSuggestedProfiles(snapshot.docs.map((user) => ({
                ...user.data(),
                docId: user.id
            })));
        })
    }
  }, [userId]);

  return !suggestedProfiles ? (
    <Skeleton count={1} height={150} className="suggestedUsers__skeleton" />
  ) : suggestedProfiles.length > 0 ? (
    <div className="suggestedUsers__container">
      <div className="suggestUsers__headerContainer">
        <p className="suggestedUsers__header">Suggestions for you</p>
      </div>
      <div className="suggestedUsers__listContainer">
        {suggestedProfiles.map((profile) => (
          <SuggestedProfile
            key={profile.docId}
            profileDocId={profile.docId}
            username={profile.username}
            profileId={profile.userId}
            userId={userId}
            loggedInUserDocId={loggedInUserDocId}
            avatarImgSrc={profile.avatarImgSrc}
          />
        ))}
      </div>
    </div>
  ) : null;
}

Suggestions.propTypes = {
  userId: PropTypes.string,
  following: PropTypes.array,
  loggedInUserDocId: PropTypes.string
};