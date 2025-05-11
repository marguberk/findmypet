import React, { useState } from 'react';
import { addComment } from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const CommentForm = ({ petId, onCommentAdded }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { currentUser, isAuthenticated } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const commentData = {
        text,
        userId: currentUser.id,
        userName: currentUser.username || currentUser.email.split('@')[0]
      };
      
      const result = await addComment(petId, commentData);
      
      if (result.success) {
        setText('');
        onCommentAdded(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error adding comment');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isAuthenticated()) {
    return (
      <div className="card mb-4">
        <div className="card-body text-center">
          <p>You need to be logged in to post comments.</p>
          <div>
            <Link to="/login" className="btn btn-primary me-2">Log In</Link>
            <Link to="/register" className="btn btn-outline-primary">Register</Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card mb-4">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="commentText" className="form-label">Add a comment</label>
            <textarea
              id="commentText"
              className="form-control"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="3"
              placeholder="Share your thoughts..."
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Posting...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2"></i>
                Post Comment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentForm; 