import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPetById, updatePet } from '../../services/petService';
import { useAuth } from '../../context/AuthContext';

const EditPetPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pet_type: 'cat',
    status: 'missing',
    last_seen_address: '',
    last_seen_date: '',
    latitude: '',
    longitude: '',
    image: null
  });
  
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchPetDetails();
  }, [id]);
  
  const fetchPetDetails = async () => {
    try {
      const result = await getPetById(id);
      
      if (result.success) {
        const pet = result.data;
        
        // Verify if the current user is the owner
        if (currentUser && pet.user_id !== currentUser.id) {
          setError('У вас нет прав на редактирование этого объявления');
          return;
        }
        
        // Format the date for the datetime-local input
        const lastSeenDate = new Date(pet.last_seen_date);
        const formattedDate = lastSeenDate.toISOString().substring(0, 16);
        
        setFormData({
          title: pet.title,
          description: pet.description,
          pet_type: pet.pet_type,
          status: pet.status,
          last_seen_address: pet.last_seen_address,
          last_seen_date: formattedDate,
          latitude: pet.latitude || '',
          longitude: pet.longitude || '',
          image: null
        });
        
        if (pet.image_url) {
          setCurrentImage(`http://localhost:5001${pet.image_url}`);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Ошибка при загрузке данных объявления');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const result = await updatePet(id, formData);
      
      if (result.success) {
        navigate(`/pets/${id}`);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Произошла ошибка при обновлении объявления');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2">Загрузка данных...</p>
      </div>
    );
  }
  
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3>Редактировать объявление</h3>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Заголовок объявления *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="pet_type" className="form-label">Тип животного *</label>
                    <select
                      className="form-select"
                      id="pet_type"
                      name="pet_type"
                      value={formData.pet_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="cat">Кошка</option>
                      <option value="dog">Собака</option>
                      <option value="bird">Птица</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="status" className="form-label">Статус *</label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="missing">Потерян</option>
                      <option value="found">Найден</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Описание *</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="last_seen_address" className="form-label">Адрес, где было потеряно/найдено животное *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_seen_address"
                    name="last_seen_address"
                    value={formData.last_seen_address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="last_seen_date" className="form-label">Дата и время пропажи/нахождения *</label>
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
                    <label htmlFor="latitude" className="form-label">Широта (необязательно)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      id="latitude"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="longitude" className="form-label">Долгота (необязательно)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      id="longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="image" className="form-label">Фотография питомца</label>
                  
                  {currentImage && !preview && (
                    <div className="mb-2">
                      <p>Текущее изображение:</p>
                      <img 
                        src={currentImage} 
                        alt="Текущее изображение" 
                        className="img-thumbnail" 
                        style={{ maxHeight: '200px' }} 
                      />
                    </div>
                  )}
                  
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small className="form-text text-muted">
                    Оставьте пустым, если хотите сохранить текущее изображение
                  </small>
                  
                  {preview && (
                    <div className="mt-2">
                      <p>Новое изображение:</p>
                      <img 
                        src={preview} 
                        alt="Предпросмотр" 
                        className="img-thumbnail" 
                        style={{ maxHeight: '200px' }} 
                      />
                    </div>
                  )}
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(`/pets/${id}`)}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPetPost; 