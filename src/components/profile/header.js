import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import useUser from '../../hooks/get-user-obj';
import { isUserFollowingProfile, toggleFollow } from '../../firebase-calls/firebase';
import UserContext from '../../context/user';
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from '@material-ui/core/styles';

import "./profile-header.css";


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

export default function Header({
  photosCount,
  followerCount,
  setFollowerCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers,
    following,
    username: profileUsername
  }
}) {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const activeBtnFollow = user?.username && user?.username !== profileUsername;
  const [avatarImgSrc, setAvatarImgSrc] = useState();
  const classes = useStyles();

  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1
    });
    await toggleFollow(isFollowingProfile, user.docId, profileDocId, profileUserId, user.userId);
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(user.username, profileUserId);
      setIsFollowingProfile(!!isFollowing);
    };

    if (user?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
      setAvatarImgSrc(user.avatarImgSrc);
    }
  }, [user, profileUserId]);

  return (
    <div className="profileheader__container">
      <div className="avatar__container">
        <Avatar
          className="post__avatar"
          src={avatarImgSrc}
          className={classes.large}
        />
      </div>
      <div className="profile__container">
        <div className="profile__header">
          <p className="profile__name">{profileUsername}</p>
          {activeBtnFollow && (
            <button
              className="profile__follow"
              type="button"
              onClick={handleToggleFollow}
            >
              {isFollowingProfile ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        <div className="profile__info">
          {!followers || !following ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p className="stat__container">
                <span className="stat__style">{photosCount}</span> photos
              </p>
              <p className="stat__container">
                <span className="stat__style">{followerCount}</span>
                {` `}
                {followerCount === 1 ? `follower` : `followers`}
              </p>
              <p className="stat__container">
                <span className="stat__style">{following?.length}</span> following
              </p>
            </>
          )}
        </div>
        <div className="fullName__container">
          <p className="fullName__style">{!fullName ? <Skeleton count={1} height={24} /> : fullName}</p>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  photosCount: PropTypes.number.isRequired,
  followerCount: PropTypes.number.isRequired,
  setFollowerCount: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    fullName: PropTypes.string,
    username: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array
  }).isRequired
};
