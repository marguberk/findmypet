import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MarkerPosition = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  // Center the map on the marker when position changes
  useEffect(() => {
    if (position && position.length === 2) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({ value, onChange }) => {
  // Default center for the map (can be configured based on user's location)
  const defaultCenter = [43.238949, 76.889709]; // Almaty, Kazakhstan
  const [position, setPosition] = useState(null);
  const mapRef = useRef(null);
  
  // Initialize position from props only once on mount or when value changes significantly
  useEffect(() => {
    if (value && value.latitude && value.longitude) {
      const lat = parseFloat(value.latitude);
      const lng = parseFloat(value.longitude);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        setPosition([lat, lng]);
      }
    }
  }, [value.latitude, value.longitude]);

  // When position changes locally (from map click), update the parent component
  useEffect(() => {
    if (position) {
      // Only call onChange if the values are actually different
      if (
        !value.latitude || 
        !value.longitude || 
        Math.abs(parseFloat(value.latitude) - position[0]) > 0.000001 ||
        Math.abs(parseFloat(value.longitude) - position[1]) > 0.000001
      ) {
        onChange({
          latitude: position[0],
          longitude: position[1]
        });
      }
    }
  }, [position]);

  const handleClearLocation = () => {
    setPosition(null);
    onChange({ latitude: '', longitude: '' });
  };

  return (
    <div className="location-picker">
      <div className="card mb-3">
        <div className="card-body p-0">
          <div style={{ height: '400px', width: '100%' }}>
            <MapContainer 
              center={position || defaultCenter} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerPosition position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-muted">
          <small>Click on the map to set the location where the pet was last seen.</small>
        </div>
        {position && (
          <button 
            type="button" 
            className="btn btn-outline-secondary btn-sm"
            onClick={handleClearLocation}
          >
            <i className="bi bi-x-circle me-1"></i>
            Clear Location
          </button>
        )}
      </div>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="number"
              className="form-control"
              id="latitude"
              name="latitude"
              value={position ? position[0] : ''}
              onChange={(e) => {
                const lat = e.target.value;
                if (lat && !isNaN(lat)) {
                  setPosition([parseFloat(lat), position ? position[1] : 0]);
                }
              }}
              placeholder="Latitude"
              step="any"
              readOnly
            />
            <label htmlFor="latitude">Latitude</label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="number"
              className="form-control"
              id="longitude"
              name="longitude"
              value={position ? position[1] : ''}
              onChange={(e) => {
                const lng = e.target.value;
                if (lng && !isNaN(lng)) {
                  setPosition([position ? position[0] : 0, parseFloat(lng)]);
                }
              }}
              placeholder="Longitude"
              step="any"
              readOnly
            />
            <label htmlFor="longitude">Longitude</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker; 