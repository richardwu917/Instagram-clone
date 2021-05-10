import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from "../components/header";
import UploadAvatar from '../components/settings/upload-avatar';
import GetUserObj from '../hooks/get-user-obj';
import LoggedInUserContext from '../context/logged-in-user';


export default function Settings({ user: loggedInUser }) {
    const { user, setActiveUser } = GetUserObj(loggedInUser.uid);

    useEffect(() => {
        document.title = 'Settings';
    }, []);

    return (
        <LoggedInUserContext.Provider value={{ user, setActiveUser }}>
            <div>
                <Header />
                <UploadAvatar />
            </div>
        </LoggedInUserContext.Provider>
    )
}

Settings.propTypes = {
    user: PropTypes.object.isRequired
};