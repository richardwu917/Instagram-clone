import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getUserDBByUsername } from '../../firebase-calls/firebase';

import Avatar from "@material-ui/core/Avatar";

import "./post.css";
import { useEffect, useState } from 'react';

export default function Header({ username }) {
    const [avatarImgSrc, setAvatarImgSrc] = useState();

    useEffect(async () => {
        const [postUser] = await getUserDBByUsername(username);
        setAvatarImgSrc(postUser.avatarImgSrc)
    }, [avatarImgSrc]);

    return (
        <div className="postheader__container">
            <div className="postheader__styling">
                <Link to={`/p/${username}`} className="user__redirect">
                <Avatar
                    className="post__avatar"
                    src={avatarImgSrc}
                />
                </Link>
                <p className="username__style">{username}</p>
            </div>
        </div>
    );
}

Header.propTypes = {
    username: PropTypes.string.isRequired
};