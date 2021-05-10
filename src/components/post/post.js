import { useRef } from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import Image from './image';
import Actions from './actions';
import Footer from './footer';
import Comments from './comments';

import "./post.css";

export default function Post({ content }) {
    const commentInput = useRef(null);
    const handleFocus = () => commentInput.current.focus();

    return (
        <div className="post__container">
            <Header username={content.username} />
            <Image src={content.imageSrc} caption={content.caption} />
            <Actions
                username={content.username}
                docId={content.docId}
                totalLikes={content.likes.length}
                likedPhoto={content.userLikedPhoto}
                handleFocus={handleFocus}
            />
        <Footer caption={content.caption} username={content.username} />
        <Comments
            username={content.username}
            docId={content.docId}
            comments={content.comments}
            posted={content.dateCreated}
            commentInput={commentInput}
        />
        </div>
    )
}

Post.prototype = {
    content: PropTypes.shape({
        username: PropTypes.string.isRequired,
        imageSrc: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired,
        userLikedPhoto: PropTypes.bool.isRequried,
        likes: PropTypes.array.isRequired,
        comments: PropTypes.array.isRequired,
        dateCreated: PropTypes.number.isRequired
    })
};