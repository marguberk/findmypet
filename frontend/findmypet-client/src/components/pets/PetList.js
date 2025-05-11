import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPets } from '../../services/petService';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    pet_type: '',
    status: ''
  });
  
  useEffect(() => {
    fetchPets();
  }, [filters]);
  
  const fetchPets = async () => {
    setLoading(true);
    try {
      const result = await getAllPets(filters);
      if (result.success) {
        setPets(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error loading pet listings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Helper function to get pet type display name
  const getPetTypeLabel = (type) => {
    const types = {
      'cat': 'Cat',
      'dog': 'Dog',
      'bird': 'Bird',
      'other': 'Other'
    };
    return types[type] || type;
  };
  
  // Helper function to get pet status icon
  const getStatusIcon = (status) => {
    return status === 'missing' ? 
      <i className="fas fa-search me-1"></i> : 
      <i className="fas fa-check-circle me-1"></i>;
  };
  
  // Helper function to get color class based on pet type
  const getPetTypeColorClass = (type) => {
    return `pet-${type}`;
  };
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="fas fa-paw me-2 text-primary"></i>
          Pet Listings
        </h2>
        <Link to="/pets/add" className="btn btn-primary">
          <i className="fas fa-plus-circle me-2"></i>
          Create Listing
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-light p-4 rounded mb-4 shadow-sm">
        <h5 className="mb-3">
          <i className="fas fa-filter me-2"></i>
          Filter Listings
        </h5>
        <div className="row">
          <div className="col-md-5">
            <div className="mb-2">
              <label htmlFor="pet_type" className="form-label fw-bold">Pet Type</label>
              <select 
                id="pet_type"
                name="pet_type"
                className="form-select"
                value={filters.pet_type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
                <option value="bird">Bird</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="col-md-5">
            <div className="mb-2">
              <label htmlFor="status" className="form-label fw-bold">Status</label>
              <select 
                id="status"
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="missing">Missing</option>
                <option value="found">Found</option>
              </select>
            </div>
          </div>
          
          <div className="col-md-2 d-flex align-items-end">
            <button 
              className="btn btn-outline-secondary w-100" 
              onClick={() => setFilters({ pet_type: '', status: '' })}
            >
              <i className="fas fa-undo me-1"></i> Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}
      
      {/* Loading spinner */}
      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading pet listings...</p>
        </div>
      ) : (
        <>
          {/* No results message */}
          {pets.length === 0 ? (
            <div className="alert alert-info" role="alert">
              <i className="fas fa-info-circle me-2"></i>
              No listings found. Try changing your filter settings or create a new listing.
            </div>
          ) : (
            <div className="row">
              {pets.map(pet => (
                <div className="col-lg-4 col-md-6 mb-4" key={pet.id}>
                  <div className="card h-100 shadow-sm border-0 hover-shadow">
                    <div className="position-relative">
                      {pet.image_url ? (
                        <img 
                          src={`http://localhost:5001${pet.image_url}`}
                          alt={pet.title}
                          className="card-img-top"
                          style={{ height: '220px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/no-image.jpg';
                          }}
                        />
                      ) : (
                        <img 
                          src="/images/no-image.jpg"
                          alt="No image available"
                          className="card-img-top"
                          style={{ height: '220px', objectFit: 'cover' }}
                        />
                      )}
                      <span className={`position-absolute top-0 end-0 m-2 badge ${pet.status === 'missing' ? 'bg-danger' : 'bg-success'}`}>
                        {getStatusIcon(pet.status)}
                        {pet.status === 'missing' ? 'Missing' : 'Found'}
                      </span>
                    </div>
                    
                    <div className="card-body">
                      <div className={`mb-2 small fw-bold ${getPetTypeColorClass(pet.pet_type)}`}>
                        <i className="fas fa-paw me-1"></i>
                        {getPetTypeLabel(pet.pet_type)}
                      </div>
                      <h5 className="card-title">{pet.title}</h5>
                      <p className="card-text text-truncate">{pet.description}</p>
                      <p className="card-text">
                        <small className="text-muted">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          {pet.last_seen_address}
                        </small>
                      </p>
                      <Link to={`/pets/${pet.id}`} className="btn btn-outline-primary w-100">
                        <i className="fas fa-info-circle me-1"></i> View Details
                      </Link>
                    </div>
                    <div className="card-footer bg-white text-center">
                      <small className="text-muted">
                        <i className="far fa-calendar-alt me-1"></i>
                        Posted {formatDate(pet.created_at)}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PetList;