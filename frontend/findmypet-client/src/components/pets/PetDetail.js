import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPetById, deletePet } from '../../services/petService';
import { useAuth } from '../../context/AuthContext';

const PetDetail = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchPetDetails();
  }, [id]);
  
  const fetchPetDetails = async () => {
    setLoading(true);
    try {
      const result = await getPetById(id);
      if (result.success) {
        setPet(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      const result = await deletePet(id);
      if (result.success) {
        navigate('/pets');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error deleting listing');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const isOwner = () => {
    return isAuthenticated() && currentUser && pet && currentUser.id === pet.user_id;
  };

  const handleShowPhone = () => {
    setShowPhoneModal(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real app, this would send the message to the server
      console.log("Message to be sent:", message);
      console.log("Recipient user ID:", pet.user_id);
      
      // Simulate sending success
      setMessageSent(true);
      setTimeout(() => {
        setShowMessageModal(false);
        setMessage('');
        setMessageSent(false);
      }, 2000);
    }
  };
  
  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/pets" className="btn btn-primary">
          Back to listings
        </Link>
      </div>
    );
  }
  
  if (!pet) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning" role="alert">
          Listing not found
        </div>
        <Link to="/pets" className="btn btn-primary">
          Back to listings
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container my-4">
      <div className="card">
        <div className="card-header bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">{pet.title}</h2>
            <span className={`badge ${pet.status === 'missing' ? 'bg-danger' : 'bg-success'}`}>
              {pet.status === 'missing' ? 'Missing' : 'Found'}
            </span>
          </div>
        </div>
        
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              {pet.image_url ? (
                <img 
                  src={`http://localhost:5001${pet.image_url}`}
                  alt={pet.title}
                  className="img-fluid rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/no-image.jpg';
                  }}
                />
              ) : (
                <img 
                  src="/images/no-image.jpg"
                  alt="No image available"
                  className="img-fluid rounded"
                />
              )}
            </div>
            
            <div className="col-md-6">
              <h4 className="mt-3 mt-md-0">Information</h4>
              <hr />
              
              <div className="mb-3">
                <p><strong>Pet Type:</strong> {
                  pet.pet_type === 'cat' ? 'Cat' :
                  pet.pet_type === 'dog' ? 'Dog' :
                  pet.pet_type === 'bird' ? 'Bird' :
                  'Other'
                }</p>
                
                <p><strong>Last Seen:</strong> {formatDate(pet.last_seen_date)}</p>
                
                <p><strong>Address:</strong> {pet.last_seen_address}</p>
                
                <p><strong>Publication Date:</strong> {formatDate(pet.created_at)}</p>
              </div>
              
              <h4>Description</h4>
              <hr />
              <p>{pet.description}</p>
              
              {isOwner() && (
                <div className="mt-4">
                  <Link to={`/pets/edit/${pet.id}`} className="btn btn-primary me-2">
                    Edit
                  </Link>
                  
                  <button 
                    className="btn btn-danger"
                    onClick={() => setShowConfirmDelete(true)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h4>Contact Information</h4>
            <hr />
            <div className="d-grid gap-2 d-md-block">
              <button 
                className="btn btn-success me-md-2"
                onClick={handleShowPhone}
              >
                <i className="bi bi-telephone me-2"></i>
                Show Phone Number
              </button>
              <button 
                className="btn btn-outline-primary"
                onClick={() => setShowMessageModal(true)}
              >
                <i className="bi bi-chat-dots me-2"></i>
                Send Message
              </button>
            </div>
          </div>
          
          {pet.latitude && pet.longitude && (
            <div className="mt-4">
              <h4>Map</h4>
              <hr />
              <div className="bg-light p-3 text-center">
                <p className="text-muted mb-0">Map location will be displayed here</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="card-footer">
          <Link to="/pets" className="btn btn-outline-secondary">
            Back to listings
          </Link>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowConfirmDelete(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this listing?</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Phone Number Modal */}
      {showPhoneModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contact Phone</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPhoneModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <i className="bi bi-telephone-fill text-success" style={{ fontSize: '2rem' }}></i>
                  <h4 className="my-3">+1 (555) 123-4567</h4>
                  <p className="text-muted">When calling, please mention that you found this listing on FindMyPet</p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowPhoneModal(false)}
                >
                  Close
                </button>
                <a 
                  href="tel:+15551234567" 
                  className="btn btn-success"
                >
                  <i className="bi bi-telephone-fill me-2"></i>
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Message</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessage('');
                    setMessageSent(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {messageSent ? (
                  <div className="alert alert-success text-center">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Your message has been sent successfully!
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage}>
                    <div className="mb-3">
                      <label htmlFor="messageSubject" className="form-label">Subject</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="messageSubject" 
                        defaultValue={`Regarding: ${pet.title}`}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="messageText" className="form-label">Message</label>
                      <textarea 
                        className="form-control" 
                        id="messageText" 
                        rows="4" 
                        placeholder="Write your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </form>
                )}
              </div>
              <div className="modal-footer">
                {!messageSent && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setShowMessageModal(false);
                        setMessage('');
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <i className="bi bi-send me-2"></i>
                      Send
                    </button>
                  </>
                )}
                {messageSent && (
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowMessageModal(false);
                      setMessage('');
                      setMessageSent(false);
                    }}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetail; 