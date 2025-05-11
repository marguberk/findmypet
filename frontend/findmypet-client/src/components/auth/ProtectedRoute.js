import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Показываем индикатор загрузки, пока определяется статус авторизации
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2">Проверка авторизации...</p>
      </div>
    );
  }
  
  // Редирект на страницу входа, если пользователь не авторизован,
  // сохраняем текущий URL для возврата после авторизации
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Рендерим дочерние компоненты, если пользователь авторизован
  return children;
};

export default ProtectedRoute; 