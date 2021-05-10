import { db } from '../lib/firebase';
import firebase from 'firebase';

export async function doesUsernameExist(username) {
  const result = await db
    .collection('users')
    .where('username', '==', username)
    .get();

  return result.docs.map((user) => user.data().length > 0);
}

export async function doesEmailExist(emailAddress) {
  const result = await db
    .collection('users')
    .where('emailAddress', '==', emailAddress)
    .get();

  return result.docs.map((user) => user.data().length > 0);
}

export async function getUserDBByUsername(username) {
  const result = await db
    .collection('users')
    .where('username', '==', username)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));
}

export async function getUserDBByUserId(userId) {
    const result = await db.collection('users').where('userId', '==', userId).get();
    const user = result.docs.map((item) => ({
      ...item.data(),
      docId: item.id
    }));
  
    return user;
}

export async function getSuggestedProfiles(userId, following) {
  const result = await db.collection('users').limit(10).get();

  return result.docs
    .map((user) => ({ ...user.data(), docId: user.id }))
    .filter((profile) => profile.userId !== userId && !following.includes(profile.userId));
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, 
  profileId, 
  isFollowingProfile 
) {
  return db
    .collection('users')
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? firebase.firestore.FieldValue.arrayRemove(profileId)
        : firebase.firestore.FieldValue.arrayUnion(profileId)
    });
}

export async function updateFollowedUserFollowers(
  profileDocId, 
  loggedInUserDocId, 
  isFollowingProfile 
) {
  return db
    .collection('users')
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? firebase.firestore.FieldValue.arrayRemove(loggedInUserDocId)
        : firebase.firestore.FieldValue.arrayUnion(loggedInUserDocId)
    });
}

export async function getPhotos(userId, following) {
  const result = await db
    .collection('photos')
    .where('userId', 'in', following)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserDBByUserId(photo.userId);
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function getUserPhotosByUsername(username) {
  const [user] = await getUserDBByUsername(username);
  const result = await db
    .collection('photos')
    .where('userId', '==', user.userId)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));
}

export async function isUserFollowingProfile(loggedInUserUsername, profileUserId) {
  const result = await db
    .collection('users')
    .where('username', '==', loggedInUserUsername) 
    .where('following', 'array-contains', profileUserId)
    .get();

  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));

  return response.userId;
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile);
  await updateFollowedUserFollowers(profileDocId, followingUserId, isFollowingProfile);
}