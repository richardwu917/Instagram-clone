import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { updateLoggedInUserFollowing, updateFollowedUserFollowers, getUserDBByUserId } from '../../firebase-calls/firebase';
import LoggedInUserContext from '../../context/logged-in-user';
import Avatar from "@material-ui/core/Avatar";

import "./sidebar.css";

export default function SuggestedProfile({
    profileDocId,
    username, 
    profileId,
    userId,
    loggedInUserDocId,
    avatarImgSrc
}) {
    const [followed, setFollowed] = useState(false);
    const { setActiveUser } = useContext(LoggedInUserContext);

    async function handleFollowUser() {
        setFollowed(true);
        await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
        await updateFollowedUserFollowers(profileDocId, userId, false);
        const [user] = await getUserDBByUserId(userId);
        setActiveUser(user);
    }

    return !followed ? (
        <div className="suggestedUser__container">
          <div className="suggestedNameAvatar__container">
            <Avatar
              className="post__avatar"
              src={avatarImgSrc}
            />
            <Link to={`/p/${username}`} className="suggestedUser__link">
              <p className="suggestedUser__name">{username}</p>
            </Link>
          </div>
          <div className="button__styling">
            <button
              className="suggestedUser__follow"
              type="button"
              onClick={handleFollowUser}
            >
            Follow
            </button>
          </div>
        </div>
      ) : null;
}

SuggestedProfile.propTypes = {
    profileDocId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profileId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    loggedInUserDocId: PropTypes.string.isRequired
  };