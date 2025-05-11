import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = 'http://localhost:5001/api';

// Создаем экземпляр axios с настройками
const authAxios = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
});

// Добавляем перехватчик для логирования запросов
authAxios.interceptors.request.use(
  config => {
    console.log('Outgoing request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Добавляем перехватчик для логирования ответов
authAxios.interceptors.response.use(
  response => {
    console.log('Response received:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Response error:', error.message);
    if (error.response) {
      console.error('Error details:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          console.log('Fetching user profile with token:', token);
          const response = await authAxios.get(`/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Profile response:', response.data);
          setCurrentUser(response.data.user);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Проверяем, является ли ошибка связанной с аутентификацией
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn('Invalid or expired token, logging out');
            logout();
          } else if (error.message === 'Network Error') {
            console.error('Network error. API might be unavailable.');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [token]);
  
  const register = async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      const response = await authAxios.post(`/auth/register`, userData);
      console.log('Registration response:', response.data);
      
      if (response.data && response.data.access_token) {
        setToken(response.data.access_token);
        setCurrentUser(response.data.user);
        localStorage.setItem('token', response.data.access_token);
        return { success: true, data: response.data };
      } else {
        console.error('No token in registration response');
        return { 
          success: false, 
          error: 'Server response does not contain token' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message === 'Network Error') {
        return { 
          success: false, 
          error: 'Network error. Please check your connection or try again later.' 
        };
      }
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };
  
  const login = async (credentials) => {
    try {
      console.log('Logging in with credentials:', { email: credentials.email });
      
      // Проверим содержимое локального хранилища перед логином
      console.log('localStorage before login:', {
        token: localStorage.getItem('token')
      });
      
      const response = await authAxios.post(`/auth/login`, credentials);
      console.log('Login response:', response.data);
      
      // Проверим присутствие токена в ответе
      if (!response.data.access_token) {
        console.error('No access token in response:', response.data);
        return { 
          success: false, 
          error: 'Server did not provide access token' 
        };
      }
      
      // Сначала сохраняем в localStorage
      localStorage.setItem('token', response.data.access_token);
      
      // Затем обновляем state
      setToken(response.data.access_token);
      setCurrentUser(response.data.user);
      
      // Проверим содержимое после логина
      console.log('After login:', {
        storedToken: localStorage.getItem('token'),
        currentUser: response.data.user,
        state: { token: response.data.access_token, user: response.data.user }
      });
      
      // Небольшая пауза перед возвратом результата
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.message === 'Network Error') {
        return { 
          success: false, 
          error: 'Network error. Please check your connection or try again later.' 
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };
  
  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };
  
  const isAuthenticated = () => {
    const hasToken = !!token;
    console.log('isAuthenticated check:', { hasToken, token });
    return hasToken;
  };
  
  const value = {
    currentUser,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 