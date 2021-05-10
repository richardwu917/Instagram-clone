import { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import LoggedInUserContext from '../context/logged-in-user';
import usePhotos from '../hooks/use-photos';
import Post from './post/post';
import { getUserDBByUserId } from '../firebase-calls/firebase';

import "./timeline.css";

export default function Timeline() {
  const { user } = useContext(LoggedInUserContext);
  const { photos } = usePhotos(user);
  const [posts, setPosts] = useState(null);
  
  useEffect(() => {
    async function getTimelinePhotos() {
      if (user?.following?.length > 0) {
        const followedUserPhotos = await Promise.all(
         photos.map(async (photo) => {
            let userLikedPhoto = false;
            if (photo.likes.includes(user.userId)) {
              userLikedPhoto = true;
            }
            const userDB = await getUserDBByUserId(photo.userId);
            const { username } = userDB[0];
            return { username, ...photo, userLikedPhoto };
          })
        );
        followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        setPosts(followedUserPhotos);
      }
    }
 
    getTimelinePhotos();
  }, [photos]);

  return (
    <div className="timeline__container">
      {!posts ? (
        <Skeleton count={4} width={640} height={500} className="skeleton__styling" />
      ) : (
        posts.map((content) => <Post key={content.docId+Date.now()} content={content} />)
      )}
    </div>
  );
}