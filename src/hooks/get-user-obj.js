import { useState, useEffect } from 'react';
import { getUserDBByUserId } from '../firebase-calls/firebase';

export default function GetUserObj(userId) {
  const [activeUser, setActiveUser] = useState();

  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const [user] = await getUserDBByUserId(userId);
      setActiveUser(user || {});
    }
    if (userId) {
      getUserObjByUserId(userId);
    }
  }, [userId]);

  return { user: activeUser, setActiveUser };
}