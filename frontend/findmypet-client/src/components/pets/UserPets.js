import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserPets, deletePet } from '../../services/petService';
import { useAuth } from '../../context/AuthContext';

const UserPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  
  const { currentUser } = useAuth();
  
  useEffect(() => {
    fetchUserPets();
  }, []);
  
  const fetchUserPets = async () => {
    setLoading(true);
    try {
      const result = await getUserPets();
      if (result.success) {
        setPets(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error loading listings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      const result = await deletePet(id);
      if (result.success) {
        setPets(pets.filter(pet => pet.id !== id));
        setDeleteId(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error deleting listing');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };
  
  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Listings</h2>
        <Link to="/pets/add" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Create Listing
        </Link>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Loading spinner */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading listings...</p>
        </div>
      ) : (
        <>
          {/* No results message */}
          {pets.length === 0 ? (
            <div className="alert alert-info" role="alert">
              You don't have any listings. Create a new listing to start the search.
              <div className="mt-3">
                <Link to="/pets/add" className="btn btn-primary">
                  Create Listing
                </Link>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Publication Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.map(pet => (
                    <tr key={pet.id}>
                      <td>
                        {pet.image_url ? (
                          <img 
                            src={`http://localhost:5001${pet.image_url}`}
                            alt={pet.title}
                            className="img-thumbnail"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/no-image.jpg';
                            }}
                          />
                        ) : (
                          <img 
                            src="/images/no-image.jpg"
                            alt="No image"
                            className="img-thumbnail"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                        )}
                      </td>
                      <td>
                        <Link to={`/pets/${pet.id}`}>
                          {pet.title}
                        </Link>
                      </td>
                      <td>
                        {pet.pet_type === 'cat' ? 'Cat' : 
                         pet.pet_type === 'dog' ? 'Dog' : 
                         pet.pet_type === 'bird' ? 'Bird' : 'Other'}
                      </td>
                      <td>
                        <span className={`badge ${pet.status === 'missing' ? 'bg-danger' : 'bg-success'}`}>
                          {pet.status === 'missing' ? 'Missing' : 'Found'}
                        </span>
                      </td>
                      <td>{formatDate(pet.created_at)}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link 
                            to={`/pets/${pet.id}`} 
                            className="btn btn-sm btn-outline-primary"
                            title="View"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link 
                            to={`/pets/edit/${pet.id}`} 
                            className="btn btn-sm btn-outline-secondary"
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() => setDeleteId(pet.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {/* Confirmation Modal */}
      {deleteId && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setDeleteId(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this listing?</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => handleDelete(deleteId)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPets; 