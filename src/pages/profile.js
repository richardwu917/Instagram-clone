import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserDBByUsername } from '../firebase-calls/firebase';
import * as ROUTES from '../constants/routes';
import Header from '../components/header';
import UserProfile from '../components/profile/profile';

import "./profile.css";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    async function checkUserExists() {
      const [user] = await getUserDBByUsername(username);
      if (user?.userId) {
        setUser(user);
      } else {
        history.push(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists();
  }, [username, history]);

  return user?.username ? (
    <div className="profilePage__container">
      <Header />
      <div className="profileUser__container">
        <UserProfile user={user} />
      </div>
    </div>
  ) : null;
}