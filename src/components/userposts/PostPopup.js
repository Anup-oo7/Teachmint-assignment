import React from 'react';
import './postpopup.css'


const PostPopup = ({ post, onClose }) => {
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('post-popup-backdrop')) {
      onClose();
    }
  };

  return (
    <div className="post-popup-backdrop" onClick={handleBackdropClick}>
      <div className="post-popup-content">
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>
    </div>
  );
};

export default PostPopup;
