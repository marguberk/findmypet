import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPet } from '../../services/petService';
import { useAuth } from '../../context/AuthContext';

const AddPetPost = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pet_type: 'cat',
    status: 'missing',
    last_seen_address: '',
    last_seen_date: new Date().toISOString().substring(0, 16),
    latitude: '',
    longitude: '',
    image: null
  });
  
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detailedError, setDetailedError] = useState('');
  const [authError, setAuthError] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  
  const navigate = useNavigate();
  
  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      setAuthError(true);
      setError('You must be logged in to create a pet listing.');
    } else {
      console.log('User is authenticated:', currentUser);
      setAuthError(false);
    }
  }, [isAuthenticated, currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for title field to ensure it's a string
    if (name === 'title') {
      const stringValue = String(value);
      console.log(`Setting title to: "${stringValue}" (${typeof stringValue})`);
      
      setFormData(prev => ({
        ...prev,
        [name]: stringValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Function to validate form data before submission
  const validateFormData = () => {
    // Check required fields
    if (!formData.title) return 'Title is required';
    if (!formData.description) return 'Description is required';
    if (!formData.last_seen_address) return 'Last seen location is required';
    if (!formData.last_seen_date) return 'Last seen date is required';
    
    // Check that title is a string
    if (typeof formData.title !== 'string') {
      console.error(`Title is not a string: ${typeof formData.title}`);
      return 'Title must be a string';
    }
    
    return null; // No errors
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check again if user is authenticated
    if (!isAuthenticated()) {
      setError('You must be logged in to create a pet listing.');
      setAuthError(true);
      return;
    }
    
    // Validate data before submission
    const validationError = validateFormData();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError('');
    setDetailedError('');
    
    try {
      // Create a clean copy of data for submission and debugging
      const submissionData = {
        title: String(formData.title),
        description: String(formData.description),
        pet_type: String(formData.pet_type),
        status: String(formData.status),
        last_seen_address: String(formData.last_seen_address),
        last_seen_date: String(formData.last_seen_date),
        latitude: formData.latitude,
        longitude: formData.longitude,
        image: formData.image
      };
      
      console.log('Submitting form data:', submissionData);
      console.log('Title type:', typeof submissionData.title);
      
      const result = await createPet(submissionData);
      
      if (result.success) {
        console.log('Pet post created successfully:', result.data);
        setPostSuccess(true);
        
        // Navigate after a small delay to show success message
        setTimeout(() => {
          navigate(`/pets/${result.data.id}`);
        }, 1000);
      } else {
        // Handle user ID format error
        if (result.error && result.error.includes('ID')) {
          console.error('User ID format error:', result.error);
          setAuthError(true);
          setError('User identification error. Please log out and log in again.');
        } else {
          setError(result.error);
        }
        
        // Display detailed error for debugging
        setDetailedError(`Detailed error info: ${JSON.stringify(result)}`);
        console.error('Error details:', result);
        
        // Set auth error flag if the error is related to authentication
        if (result.error && (result.error.includes('Authentication') || 
                            result.error.includes('log in') || 
                            result.error.includes('ID'))) {
          setAuthError(true);
        }
      }
    } catch (err) {
      console.error('Error in form submission:', err);
      setError('An error occurred while creating the post');
      setDetailedError(`Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8 text-center">
          <div className="bg-light p-4 rounded" style={{ margin: '0 auto' }}>
            <h3 className="mb-4">Create Pet Listing</h3>
            
            {postSuccess && (
              <div className="alert alert-success" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                Pet listing created successfully! Redirecting...
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
                
                {detailedError && (
                  <div className="mt-2 small">
                    <details>
                      <summary>Technical details</summary>
                      <pre className="text-wrap">{detailedError}</pre>
                    </details>
                  </div>
                )}
                
                {authError && (
                  <div className="mt-2">
                    <Link to="/login" className="btn btn-outline-primary btn-sm">
                      <i className="fas fa-sign-in-alt me-1"></i> Log In
                    </Link>
                    <span className="mx-2">or</span>
                    <Link to="/register" className="btn btn-outline-secondary btn-sm">
                      <i className="fas fa-user-plus me-1"></i> Register
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {authError ? (
              <div className="text-center py-5">
                <i className="fas fa-lock fa-4x text-muted mb-3"></i>
                <h4>Authentication Required</h4>
                <p className="text-muted">You need to be logged in to create a pet listing.</p>
                <div className="mt-4">
                  <Link to="/login" className="btn btn-primary me-2">
                    <i className="fas fa-sign-in-alt me-1"></i> Log In
                  </Link>
                  <Link to="/register" className="btn btn-outline-primary">
                    <i className="fas fa-user-plus me-1"></i> Register
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label text-start d-block">Post Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="E.g.: Lost gray cat in Downtown area"
                  />
                  <div className="text-start text-muted small mt-1">
                    This will be the main headline for your listing
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="pet_type" className="form-label text-start d-block">Pet Type *</label>
                    <select
                      className="form-control"
                      id="pet_type"
                      name="pet_type"
                      value={formData.pet_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="cat">Cat</option>
                      <option value="dog">Dog</option>
                      <option value="bird">Bird</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="status" className="form-label text-start d-block">Status *</label>
                    <select
                      className="form-control"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="missing">Missing</option>
                      <option value="found">Found</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label text-start d-block">Description *</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe the pet's appearance, distinctive features, and circumstances of loss/finding"
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="last_seen_address" className="form-label text-start d-block">Last Seen Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_seen_address"
                    name="last_seen_address"
                    value={formData.last_seen_address}
                    onChange={handleChange}
                    required
                    placeholder="Full address or location description"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="last_seen_date" className="form-label text-start d-block">Date and Time *</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="last_seen_date"
                    name="last_seen_date"
                    value={formData.last_seen_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="latitude" className="form-label text-start d-block">Latitude (optional)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      id="latitude"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="E.g.: 43.238949"
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="longitude" className="form-label text-start d-block">Longitude (optional)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      id="longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="E.g.: 76.889709"
                    />
                  </div>
                  <div className="col-12 mt-1">
                    <small className="text-start text-muted d-block fst-italic">
                      <i className="fas fa-info-circle me-1"></i>
                      Coordinates can be obtained by marking a point on the map or from Google Maps
                    </small>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="image" className="form-label text-start d-block">Pet Photo</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small className="text-start text-muted d-block mt-1">
                    <i className="fas fa-camera me-1"></i>
                    Upload a clear photo of the pet to increase chances of a successful search
                  </small>
                  
                  {preview && (
                    <div className="mt-3 text-center">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="img-thumbnail rounded" 
                        style={{ maxHeight: '250px' }} 
                      />
                    </div>
                  )}
                </div>
                
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary rounded-pill py-2"
                    disabled={loading || postSuccess}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Post...
                      </>
                    ) : postSuccess ? (
                      <>
                        <i className="fas fa-check me-2"></i>
                        Post Created!
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Publish Listing
                      </>
                    )}
                  </button>
                  
                  <div className="text-center mt-3">
                    <button 
                      type="button" 
                      className="btn btn-link text-decoration-none"
                      onClick={() => navigate('/pets')}
                    >
                      <i className="fas fa-arrow-left me-1"></i>
                      Back to listings
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPetPost; 