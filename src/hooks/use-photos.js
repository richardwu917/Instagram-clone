import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';

export default function usePhotos(user) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (user?.following?.length > 0) {
      db.collection('photos').where('userId', 'in', user.following).onSnapshot({
        includeMetadataChanges: true
      }, (snapshot) => {
        setPhotos(snapshot.docs.map((photo) => ({
          ...photo.data(),
          docId: photo.id
        })));
      })
    }
  }, [user]);
 
  return { photos };
}