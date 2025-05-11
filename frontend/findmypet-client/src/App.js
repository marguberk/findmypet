import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pet components
import PetMap from './components/map/PetMap';
import PetList from './components/pets/PetList';
import PetDetail from './components/pets/PetDetail';
import AddPetPost from './components/pets/AddPetPost';
import EditPetPost from './components/pets/EditPetPost';
import UserPets from './components/pets/UserPets';

// Page components
import Home from './components/layout/Home';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import ShopPage from './components/pages/ShopPage';

// Auth context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/map" element={<PetMap />} />
            <Route path="/pets" element={<PetList />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shop" element={<ShopPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/pets/add" 
              element={
                <ProtectedRoute>
                  <AddPetPost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pets/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditPetPost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/pets" 
              element={
                <ProtectedRoute>
                  <UserPets />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-pets" 
              element={
                <ProtectedRoute>
                  <UserPets />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
