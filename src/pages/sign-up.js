
import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { doesUsernameExist, doesEmailExist } from '../firebase-calls/firebase';
import { db, auth } from '../lib/firebase';
import * as ROUTES from '../constants/routes';
import './form-page.css'

export default function SignUp() {
    const history = useHistory();

    const [username, setUsername] = useState('');
    const [fullname, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const isInvalid = username === '' || fullname === '' || emailAddress === '' || password === '';

    const handleSignUp = async (event) => {
        event.preventDefault();

        const usernameExists = await doesUsernameExist(username);
        const emailExists = await doesEmailExist(emailAddress);

        if(!usernameExists.length) {
            if(!emailExists.length) {
                try {
                    const createUserResult = await auth
                        .createUserWithEmailAndPassword(emailAddress, password);
                    
                    await createUserResult.user.updateProfile({
                        displayName: username
                    });
    
                    await db
                        .collection('users')
                        .add({
                            userId: createUserResult.user.uid,
                            username: username.toLowerCase(),
                            fullName: fullname,
                            avatarImgSrc: '',
                            emailAddress: emailAddress.toLowerCase(),
                            following: [createUserResult.user.uid],
                            followers: [],
                            dateCreated: Date.now()
                        });
                    history.push(ROUTES.DASHBOARD);
                } catch(error) {
                    setUsername('');
                    setFullName('');
                    setEmailAddress('');
                    setPassword('');
                    setError(error.message);
                } 
            } else {
                setEmailAddress('');
                setError('The email is already linked to an account, please try another.');
            }
        } else {
            setUsername('');
            setError('The username is already taken, please try another.');
        }
    };

    useEffect(() => {
        document.title = 'Sign Up - Instagram';
    }, []);

    return (
        <div className="page__container">
            <div className="image__container">
                <img src="/images/iphone-with-profile.jpg" alt="iPhone with Instagram app" />
            </div>
            <div className="form__container">
                <div className="form">
                    <h1 className="logo__container">
                        <img src="/images/logo.png" alt="Instagram" className="logo" />
                    </h1>

                    {error && <p className="form__error"> {error}</p>}

                    <form onSubmit={handleSignUp} method="POST">
                        <input 
                            aria-label="Enter your username"
                            type="text"
                            placeholder="Username"
                            className="form__field"
                            onChange={({ target }) => setUsername(target.value)}
                            value={username}
                        />
                        <input
                            aria-label="Enter your full name"
                            type="text"
                            placeholder="Full name"
                            className="form__field"
                            onChange={({ target }) => setFullName(target.value)}
                            value={fullname}
                        />
                        <input
                            aria-label="Enter your email address"
                            type="text"
                            placeholder="Email address"
                            className="form__field"
                            onChange={({ target }) => setEmailAddress(target.value)}
                            value={emailAddress}
                        />
                        <input
                            aria-label="Enter your password"
                            type="password"
                            placeholder="Password"
                            className="form__field"
                            onChange={({ target }) => setPassword(target.value)}
                            value={password}
                        />
                        <button
                            disabled={isInvalid}
                            type="submit"
                        > Sign Up
                        </button>
                    </form>
                </div>
                <div className="form__alternate">
                    <p className="alternate__text">
                        Have an account?{` `}
                        <Link to={ROUTES.LOGIN} className="link">
                        Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}