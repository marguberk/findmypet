import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { getAllPets } from '../../services/petService';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const PetMap = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    pet_type: '',
    status: ''
  });
  
  // Default center for Almaty, Kazakhstan
  const defaultCenter = [43.238949, 76.889709];
  const defaultZoom = 12;
  
  useEffect(() => {
    fetchPets();
  }, [filters]);
  
  const fetchPets = async () => {
    setLoading(true);
    try {
      const result = await getAllPets(filters);
      if (result.success) {
        // Filter pets with coordinates
        const petsWithCoordinates = result.data.filter(
          pet => pet.latitude && pet.longitude && 
                 !isNaN(parseFloat(pet.latitude)) && 
                 !isNaN(parseFloat(pet.longitude))
        );
        setPets(petsWithCoordinates);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error loading map data');
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
    return date.toLocaleDateString('en-US');
  };
  
  return (
    <div className="container">
      <h2 className="mb-4">Pet Location Map</h2>
      
      {/* Filters */}
      <div className="bg-light p-3 rounded mb-4">
        <div className="row">
          <div className="col-md-4">
            <div className="mb-2">
              <label htmlFor="pet_type" className="form-label">Pet Type</label>
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
          
          <div className="col-md-4">
            <div className="mb-2">
              <label htmlFor="status" className="form-label">Status</label>
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
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Map */}
      <div className="card mb-4">
        <div className="card-body p-0">
          <div style={{ height: '600px', width: '100%' }}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mb-0 ms-3">Loading map...</p>
              </div>
            ) : (
              <MapContainer 
                center={defaultCenter} 
                zoom={defaultZoom} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {pets.map(pet => (
                  <Marker 
                    key={pet.id}
                    position={[parseFloat(pet.latitude), parseFloat(pet.longitude)]}
                    icon={pet.status === 'missing' ? missingIcon : foundIcon}
                  >
                    <Popup>
                      <div>
                        <h6>{pet.title}</h6>
                        {pet.image_url && (
                          <img 
                            src={`http://localhost:5001${pet.image_url}`}
                            alt={pet.title}
                            style={{ width: '100%', maxHeight: '120px', objectFit: 'cover' }}
                            className="mb-2 rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/no-image.jpg';
                            }}
                          />
                        )}
                        <p className="mb-1">
                          <strong>Status:</strong> {pet.status === 'missing' ? 'Missing' : 'Found'}
                        </p>
                        <p className="mb-1">
                          <strong>Address:</strong> {pet.last_seen_address}
                        </p>
                        <p className="mb-1">
                          <strong>Date:</strong> {formatDate(pet.last_seen_date)}
                        </p>
                        <Link 
                          to={`/pets/${pet.id}`} 
                          className="btn btn-primary btn-sm w-100 mt-2"
                        >
                          View Details
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="card">
        <div className="card-body">
          <h5>Map Legend</h5>
          <div className="d-flex">
            <div className="me-4">
              <img 
                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" 
                alt="Missing pet marker"
                style={{ width: '20px' }}
              />
              <span className="ms-2">Missing Pets</span>
            </div>
            <div>
              <img 
                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" 
                alt="Found pet marker"
                style={{ width: '20px' }}
              />
              <span className="ms-2">Found Pets</span>
            </div>
          </div>
          <p className="text-muted mt-2 mb-0">
            Click on a marker to view pet details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetMap; 