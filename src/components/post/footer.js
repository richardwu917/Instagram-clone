import PropTypes from 'prop-types';

import "./post.css";

export default function Footer({ caption, username }) {
  return (
    <div className="footer__container">
      <span className="footer__username">{username}</span>
      <span>{caption}</span>
    </div>
  );
}

Footer.propTypes = {
  caption: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
};