import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Если пользователь уже авторизован, редиректим на главную
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        console.log('Login successful, redirecting...');
        setLoginSuccess(true);
        
        // Переход на главную страницу после небольшой задержки
        setTimeout(() => {
          // Пытаемся перейти по страновому URL или на главную
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }, 500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Login submission error:', err);
      setError('Произошла ошибка при входе. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 text-center">
          <div className="bg-light p-4 rounded" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h3 className="mb-4">Login</h3>
            
            <div className="text-end mb-3">
              <Link to="/register" className="text-decoration-none">Register</Link>
            </div>
            
            {loginSuccess && (
              <div className="alert alert-success" role="alert">
                Вход выполнен успешно! Перенаправление...
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label text-start d-block">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  required
                />
              </div>
              
              <div className="mb-2">
                <label htmlFor="password" className="form-label text-start d-block">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                <div className="text-start text-muted small mt-1">
                  min. 6, max. 70 characters
                </div>
              </div>
              
              <div className="text-end mb-4">
                <Link to="/forgot-password" className="text-decoration-none text-secondary">
                  Forgot password?
                </Link>
              </div>
              
              <div className="d-grid">
                <button 
                  type="submit" 
                  className="btn btn-primary rounded-pill py-2"
                  disabled={loading || loginSuccess}
                >
                  {loading ? 'Logging in...' : (loginSuccess ? 'Logged in!' : 'Log in')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 