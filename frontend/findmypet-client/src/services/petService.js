import axios from 'axios';

const API_URL = 'http://localhost:5001/api';
// Создаем экземпляр axios с настройками
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  timeout: 15000, // Увеличиваем таймаут до 15 секунд
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
});

// Обработка ошибок сетевого соединения
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.error('Network connection error:', error);
      alert('Server connection error. Please check if the server is running and accessible at ' + API_URL);
    }
    return Promise.reject(error);
  }
);

// Helper to get auth header
const authHeader = () => {
  const token = localStorage.getItem('token');
  console.log('Current auth token:', token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all pet posts with optional filters
export const getAllPets = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.pet_type) params.append('pet_type', filters.pet_type);
    if (filters.status) params.append('status', filters.status);
    
    const response = await axiosInstance.get(`/pets/?${params.toString()}`);
    return { success: true, data: response.data.pet_posts };
  } catch (error) {
    console.error('Error fetching pets:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch pet posts' 
    };
  }
};

// Get a specific pet post by id
export const getPetById = async (id) => {
  try {
    const response = await axiosInstance.get(`/pets/${id}`);
    return { success: true, data: response.data.pet_post };
  } catch (error) {
    console.error('Error fetching pet details:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch pet post' 
    };
  }
};

// Функция проверки доступности сервера
export const checkServerAvailability = async () => {
  try {
    await axios.get(`${API_URL}/pets/`, { timeout: 5000 });
    return true;
  } catch (error) {
    console.error('Server availability check failed:', error);
    return false;
  }
};

// Create a new pet post
export const createPet = async (petData) => {
  try {
    // Проверяем доступность сервера перед отправкой
    const serverAvailable = await checkServerAvailability();
    if (!serverAvailable) {
      return { 
        success: false, 
        error: 'Server is not available. Please make sure the backend is running.' 
      };
    }
    
    // Check if user is authenticated first
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('User is not authenticated. Cannot create pet post.');
      return { 
        success: false, 
        error: 'Authentication required. Please log in to create a listing.' 
      };
    }
    
    // FormData for file upload
    const formData = new FormData();
    
    // Создаем очищенные данные
    const cleanData = {
      title: String(petData.title || ""),
      description: String(petData.description || ""),
      pet_type: String(petData.pet_type || "cat"),
      status: String(petData.status || "missing"),
      last_seen_address: String(petData.last_seen_address || ""),
      last_seen_date: String(petData.last_seen_date || ""),
    };

    // Проверяем обязательные поля
    if (!cleanData.title) {
      return { success: false, error: 'Title is required' };
    }
    if (!cleanData.description) {
      return { success: false, error: 'Description is required' };
    }
    if (!cleanData.last_seen_address) {
      return { success: false, error: 'Last seen location is required' };
    }
    if (!cleanData.last_seen_date) {
      return { success: false, error: 'Last seen date is required' };
    }
    
    // Log the data we are about to send
    console.log('Creating pet post with clean data:', cleanData);
    
    // Append text fields using clean data
    Object.keys(cleanData).forEach(key => {
      if (key === 'title') {
        // Добавляем поле subject со значением title
        formData.append('subject', cleanData[key]);
        console.log(`Appending field subject:`, cleanData[key]);
      }
      // Все равно добавляем исходное поле для обратной совместимости
      formData.append(key, cleanData[key]);
      console.log(`Appending field ${key}:`, cleanData[key]);
    });

    // Handle coordinates separately
    if (petData.latitude && petData.latitude !== '') {
      const lat = parseFloat(petData.latitude);
      if (!isNaN(lat)) {
        formData.append('latitude', lat);
        console.log(`Appending field latitude:`, lat);
      }
    }
    
    if (petData.longitude && petData.longitude !== '') {
      const lng = parseFloat(petData.longitude);
      if (!isNaN(lng)) {
        formData.append('longitude', lng);
        console.log(`Appending field longitude:`, lng);
      }
    }
    
    // Append image if it exists
    if (petData.image) {
      formData.append('image', petData.image);
      console.log('Image attached:', petData.image.name, 'Size:', petData.image.size, 'Type:', petData.image.type);
    } else {
      console.log('No image attached');
    }
    
    // Get auth headers and log them
    const headers = {
      ...authHeader(),
      'Content-Type': 'multipart/form-data'
    };
    console.log('Request headers:', headers);
    
    // Make the request
    console.log('Sending POST request to:', `${API_URL}/pets/`);
    
    // Debug: log form data contents
    for (let pair of formData.entries()) {
      console.log(`FormData contains: ${pair[0]}: ${pair[1]}`);
    }
    
    const response = await axiosInstance.post(`/pets/`, formData, {
      headers: headers
    });
    
    console.log('Pet post created successfully:', response.data);
    return { success: true, data: response.data.pet_post };
  } catch (error) {
    console.error('Error creating pet post:', error);
    
    // Обработка ошибок соединения
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      return { 
        success: false, 
        error: 'Could not connect to the server. Please check your connection and server status.' 
      };
    }
    
    if (error.response) {
      console.error('Server response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
      
      // Handle specific error cases
      if (error.response.status === 401) {
        return { 
          success: false, 
          error: 'Your session has expired. Please log in again.' 
        };
      }
      
      // Specific error for 422
      if (error.response.status === 422) {
        const errorMsg = error.response.data.message || error.response.data.msg || 'Validation error';
        return {
          success: false,
          error: `Data validation error: ${errorMsg}`
        };
      }
    }
    
    if (error.request) {
      console.error('Request made but no response received');
      return { 
        success: false, 
        error: 'Request was sent but no response received. Please check if the backend is working.' 
      };
    }
    
    return { 
      success: false, 
      error: error.response?.data?.message || error.response?.data?.msg || 'Failed to create pet post' 
    };
  }
};

// Update an existing pet post
export const updatePet = async (id, petData) => {
  try {
    // Проверяем доступность сервера перед отправкой
    const serverAvailable = await checkServerAvailability();
    if (!serverAvailable) {
      return { 
        success: false, 
        error: 'Server is not available. Please make sure the backend is running.' 
      };
    }
    
    // FormData for file upload
    const formData = new FormData();
    
    // Создаем очищенные данные
    const cleanData = {};
    
    if (petData.title !== undefined) 
      cleanData.title = String(petData.title || "");
    if (petData.description !== undefined) 
      cleanData.description = String(petData.description || "");
    if (petData.pet_type !== undefined) 
      cleanData.pet_type = String(petData.pet_type || "cat");
    if (petData.status !== undefined) 
      cleanData.status = String(petData.status || "missing");
    if (petData.last_seen_address !== undefined) 
      cleanData.last_seen_address = String(petData.last_seen_address || "");
    if (petData.last_seen_date !== undefined) 
      cleanData.last_seen_date = String(petData.last_seen_date || "");
    
    // Append text fields
    Object.keys(cleanData).forEach(key => {
      formData.append(key, cleanData[key]);
    });
    
    // Handle coordinates separately
    if (petData.latitude && petData.latitude !== '') {
      const lat = parseFloat(petData.latitude);
      if (!isNaN(lat)) {
        formData.append('latitude', lat);
      }
    }
    
    if (petData.longitude && petData.longitude !== '') {
      const lng = parseFloat(petData.longitude);
      if (!isNaN(lng)) {
        formData.append('longitude', lng);
      }
    }
    
    // Append image if it exists
    if (petData.image) {
      formData.append('image', petData.image);
    }
    
    const response = await axiosInstance.put(`/pets/${id}`, formData, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return { success: true, data: response.data.pet_post };
  } catch (error) {
    console.error('Error updating pet post:', error);
    
    // Обработка ошибок соединения
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      return { 
        success: false, 
        error: 'Could not connect to the server. Please check your connection and server status.' 
      };
    }
    
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to update pet post' 
    };
  }
};

// Delete a pet post
export const deletePet = async (id) => {
  try {
    const response = await axiosInstance.delete(`/pets/${id}`, {
      headers: authHeader()
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting pet post:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to delete pet post' 
    };
  }
};

// Get current user's pet posts
export const getUserPets = async () => {
  try {
    const response = await axiosInstance.get(`/pets/user`, {
      headers: authHeader()
    });
    
    return { success: true, data: response.data.pet_posts };
  } catch (error) {
    console.error('Error fetching user pets:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch user pet posts' 
    };
  }
}; 