import { useContext } from 'react';
import Suggestions from './suggestions';
import LoggedInUserContext from '../../context/logged-in-user';

import "./sidebar.css";

export default function Sidebar() {
  const { user: { docId = '', fullName, username, userId, following } = {} } = useContext(
    LoggedInUserContext
  );

  return (
    <div className="sidebar__container">
      <Suggestions userId={userId} following={following} loggedInUserDocId={docId} />
    </div>
  );
}