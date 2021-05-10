import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import UserContext from '../context/user';
import {db} from '../lib/firebase';
import SettingsNavbar from './settings/settings';
import NotificationsNavbar from './notifications/notifications';
import Modal from '@material-ui/core/Modal';
import PostUpload from '../components/post-upload/post-upload';

import './dashboardHeader.css';

export default function Header() {
    const [openPost, setOpenPost] = useState(false); 
    const [user, setUser] = useState(null);
    const { user: loggedInUser } = useContext(UserContext);

    useEffect(() => {
        if(loggedInUser?.uid) {
            db.collection("users").where('userId', '==', loggedInUser.uid).onSnapshot({
                includeMetadataChanges: true
            }, (snapshot) => {
                setUser({...snapshot.docs[0].data(), docId: snapshot.id})
                }
            )
        }
       }, [loggedInUser?.uid]);
    
    return (
        <header className="navbar">
            <Modal
                open={openPost}
                onClose={() => setOpenPost(false)}
            >
                <PostUpload setOpenPost={setOpenPost}/>
            </Modal>
            <div className="navbar__header">
                <div className="header__container">
                    <div className="logo__container">
                        <h1 className="logo__header">
                            <Link to={ROUTES.DASHBOARD} aria-label="Instagram logo">
                                <img src="/images/logo.png" alt="Instagram" className="logo" />
                            </Link>
                        </h1>
                    </div>
                    <div className="header__Buttons">
                        {user ? (
                            <>
                            <Link to={ROUTES.DASHBOARD} aria-label="Dashboard">
                                <svg
                                    className="buttonFormat"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                            </Link>
                            <button
                                type="button"
                                className="svg__button"
                                title="Post"
                                onClick={() => setOpenPost(true)}
                            >
                                <svg 
                                    className="buttonFormat" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        stroke-linecap="round" 
                                        stroke-linejoin="round" 
                                        stroke-width={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                                    />
                                </svg>
                            </button>
                            <NotificationsNavbar username={user.username} />
                            <SettingsNavbar username={user.username} avatarImgSrc={user.avatarImgSrc}/>
                        </>
                        ) : (
                            <>
                                <Link to={ROUTES.LOGIN}>
                                <button
                                    type="button"
                                    className="loginButton"
                                >
                                    Log In
                                </button>
                                </Link>
                                <Link to={ROUTES.SIGN_UP}>
                                <button
                                    type="button"
                                    className="signUpButton"
                                >
                                    Sign Up
                                </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}