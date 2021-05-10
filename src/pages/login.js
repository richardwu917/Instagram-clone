import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth } from '../lib/firebase';
import * as ROUTES from '../constants/routes';
import './form-page.css'

export default function Login() {
    const history = useHistory();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const isInvalid = emailAddress === '' || password === '';

    const handleLogin =  async (event) => {
        event.preventDefault();

        try {
            await auth.signInWithEmailAndPassword(emailAddress, password);
            history.push(ROUTES.DASHBOARD);
        } catch(error) {
            setEmailAddress('');
            setPassword('');
            setError(error.message);
        }
    }
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

                    <form onSubmit={handleLogin} method="POST">
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
                        > Login
                        </button>
                    </form>
                </div>
                <div className="form__alternate">
                    <p className="alternate__text">
                        Don't have an account?{` `}
                        <Link to={ROUTES.SIGN_UP} className="link">
                        Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}