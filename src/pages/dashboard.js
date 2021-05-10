import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/header';
import Timeline from '../components/timeline';
import Sidebar from '../components/sidebar/sidebar';
import GetUserObj from '../hooks/get-user-obj';
import LoggedInUserContext from '../context/logged-in-user';

import "./dashboard.css";


export default function Dashboard({ user: loggedInUser }) {
  const { user, setActiveUser } = GetUserObj(loggedInUser.uid);

  useEffect(() => {
    document.title = 'Instagram';
  }, []);

    return (
      <LoggedInUserContext.Provider value={{ user, setActiveUser }}>
        {console.log(user)}
        <div className="dashboard__container">
          <Header />
          <div className="dashboard__content">
            <Timeline />
            <Sidebar />
          </div>
        </div>
      </LoggedInUserContext.Provider>
    )
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired
};