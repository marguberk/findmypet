import React, { useState, useEffect } from 'react';
import { getCommentsByPetId, deleteComment } from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';
import CommentForm from './CommentForm';

const CommentList = ({ petId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, isAuthenticated } = useAuth();
  
  useEffect(() => {
    fetchComments();
  }, [petId]);
  
  const fetchComments = async () => {
    setLoading(true);
    try {
      const result = await getCommentsByPetId(petId);
      if (result.success) {
        setComments(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error loading comments');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCommentAdded = (newComment) => {
    setComments(prevComments => [newComment, ...prevComments]);
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      const result = await deleteComment(petId, commentId);
      if (result.success) {
        setComments(prevComments => 
          prevComments.filter(comment => comment.id !== commentId)
        );
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error deleting comment');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const isCommentOwner = (comment) => {
    return isAuthenticated() && currentUser && comment.userId === currentUser.id;
  };
  
  if (loading && comments.length === 0) {
    return (
      <div className="text-center my-3">
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Loading comments...</span>
        </div>
        <span className="ms-2">Loading comments...</span>
      </div>
    );
  }
  
  return (
    <div className="comments-section mt-4">
      <h4>
        Comments 
        <span className="badge bg-secondary ms-2">{comments.length}</span>
      </h4>
      <hr />
      
      <CommentForm petId={petId} onCommentAdded={handleCommentAdded} />
      
      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}
      
      {comments.length === 0 ? (
        <div className="text-center text-muted my-4">
          <i className="bi bi-chat-square-text fs-4 mb-2"></i>
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="comment-list mt-4">
          {comments.map(comment => (
            <div key={comment.id} className="comment card mb-3">
              <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
                <div>
                  <span className="fw-bold">{comment.userName}</span>
                  <small className="text-muted ms-2">{formatDate(comment.createdAt)}</small>
                </div>
                {isCommentOwner(comment) && (
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
              <div className="card-body py-3">
                <p className="card-text mb-0">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList; 