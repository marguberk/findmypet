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
          pet => pet.latitude && pet.longitude
        );
        setPets(petsWithCoordinates);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Ошибка при загрузке данных для карты');
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
    return date.toLocaleDateString('ru-RU');
  };
  
  return (
    <div className="container">
      <h2 className="mb-4">Карта потерянных и найденных животных</h2>
      
      {/* Filters */}
      <div className="bg-light p-3 rounded mb-4">
        <div className="row">
          <div className="col-md-4">
            <div className="mb-2">
              <label htmlFor="pet_type" className="form-label">Тип животного</label>
              <select 
                id="pet_type"
                name="pet_type"
                className="form-select"
                value={filters.pet_type}
                onChange={handleFilterChange}
              >
                <option value="">Все типы</option>
                <option value="cat">Кошка</option>
                <option value="dog">Собака</option>
                <option value="bird">Птица</option>
                <option value="other">Другое</option>
              </select>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="mb-2">
              <label htmlFor="status" className="form-label">Статус</label>
              <select 
                id="status"
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Все статусы</option>
                <option value="missing">Потерян</option>
                <option value="found">Найден</option>
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
                  <span className="visually-hidden">Загрузка...</span>
                </div>
                <p className="mb-0 ms-3">Загрузка карты...</p>
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
                    position={[pet.latitude, pet.longitude]}
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
                          <strong>Статус:</strong> {pet.status === 'missing' ? 'Потерян' : 'Найден'}
                        </p>
                        <p className="mb-1">
                          <strong>Адрес:</strong> {pet.last_seen_address}
                        </p>
                        <p className="mb-1">
                          <strong>Дата:</strong> {formatDate(pet.last_seen_date)}
                        </p>
                        <Link 
                          to={`/pets/${pet.id}`} 
                          className="btn btn-primary btn-sm w-100 mt-2"
                        >
                          Подробнее
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
          <h5>Обозначения на карте</h5>
          <div className="d-flex">
            <div className="me-4">
              <img 
                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" 
                alt="Missing pet marker"
                style={{ width: '20px' }}
              />
              <span className="ms-2">Потерянные животные</span>
            </div>
            <div>
              <img 
                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" 
                alt="Found pet marker"
                style={{ width: '20px' }}
              />
              <span className="ms-2">Найденные животные</span>
            </div>
          </div>
          <p className="text-muted mt-2 mb-0">
            Нажмите на маркер, чтобы увидеть подробную информацию о животном.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetMap; 