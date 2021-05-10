import PropTypes from 'prop-types';

import "./post.css";

export default function Image({ src, caption }) {
    return <img className="post__photo" src={src} alt={caption} />
}

Image.protoTypes = {
    src: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired
};