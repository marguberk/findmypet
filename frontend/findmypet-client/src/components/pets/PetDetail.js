import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPetById, deletePet } from '../../services/petService';
import { useAuth } from '../../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import CommentList from '../comments/CommentList';
import ChatInterface from '../comments/ChatInterface';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for missing and found pets
const missingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const foundIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const PetDetail = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  
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
  
  const hasValidCoordinates = (pet) => {
    return pet && 
           pet.latitude && 
           pet.longitude && 
           !isNaN(parseFloat(pet.latitude)) && 
           !isNaN(parseFloat(pet.longitude));
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
                onClick={() => setShowChatInterface(true)}
              >
                <i className="bi bi-chat-dots me-2"></i>
                Send Message
              </button>
            </div>
          </div>
          
          {hasValidCoordinates(pet) && (
            <div className="mt-4">
              <h4>Map</h4>
              <hr />
              <div style={{ height: '400px', width: '100%' }}>
                <MapContainer 
                  center={[parseFloat(pet.latitude), parseFloat(pet.longitude)]} 
                  zoom={15} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker 
                    position={[parseFloat(pet.latitude), parseFloat(pet.longitude)]}
                    icon={pet.status === 'missing' ? missingIcon : foundIcon}
                  >
                    <Popup>
                      <div>
                        <h6>{pet.title}</h6>
                        <p><strong>Last seen:</strong> {formatDate(pet.last_seen_date)}</p>
                        <p><strong>Address:</strong> {pet.last_seen_address}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}
          
          {/* Comments Section */}
          <CommentList petId={pet.id} />
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
      
      {/* Chat Interface */}
      {showChatInterface && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-body p-0">
                <ChatInterface 
                  pet={pet} 
                  onClose={() => setShowChatInterface(false)} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetail; 