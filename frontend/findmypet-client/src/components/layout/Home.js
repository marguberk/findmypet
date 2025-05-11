import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-image-left">
          <img 
            src="https://images.unsplash.com/photo-1583511655826-05700a84f4a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=576&q=80" 
            alt="" 
            className="img-fluid" 
            style={{ backgroundColor: '#fbdc8c', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 45% 100%)' }}
          />
          <img 
            src="/paw1.png" 
            alt="" 
            className="paw-print" 
            style={{ top: '20%', left: '30%', width: '40px' }}
            onError={(e) => {e.target.style.display = 'none'}}
          />
          <img 
            src="/paw2.png" 
            alt="" 
            className="paw-print" 
            style={{ top: '50%', left: '15%', width: '30px' }}
            onError={(e) => {e.target.style.display = 'none'}}
          />
          <img 
            src="/paw3.png" 
            alt="" 
            className="paw-print" 
            style={{ top: '70%', left: '30%', width: '25px' }}
            onError={(e) => {e.target.style.display = 'none'}}
          />
        </div>
        
        <div className="hero-image-right">
          <img 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1443&q=80" 
            alt="" 
            className="img-fluid" 
            style={{ backgroundColor: '#cae5ff', clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 0 100%)' }}
          />
          <img 
            src="/paw1.png" 
            alt="" 
            className="paw-print" 
            style={{ top: '30%', right: '25%', width: '35px' }}
            onError={(e) => {e.target.style.display = 'none'}}
          />
          <img 
            src="/paw2.png" 
            alt="" 
            className="paw-print" 
            style={{ top: '60%', right: '15%', width: '30px' }}
            onError={(e) => {e.target.style.display = 'none'}}
          />
        </div>
        
        <div className="container">
          <div className="hero-content">
            <h1 className="display-4 mb-3">Find My Pet <span role="img" aria-label="paw">🐾</span></h1>
            <p className="lead">
              Finding the Way Home!<br />
              We are your reliable partner in searching for lost pets. Our
              mission: reuniting beloved pets with their families.
            </p>
            <Link to="/pets/add" className="btn btn-primary rounded-pill px-4 py-2 mt-3">
              Post Now
            </Link>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <svg className="wave-divider" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path fill="#f8f8f5" fillOpacity="1" d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
      </svg>
      
      {/* Services Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Our Pet Care Solutions</h2>
          
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="service-card text-center h-100">
                <div className="mb-4">
                  <img 
                    src="/service-boarding.png" 
                    alt="Pet Boarding" 
                    width="64"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/no-image.jpg';
                    }}
                  />
                </div>
                <h5>Pet Boarding</h5>
                <p className="text-muted">
                  Leave your pet with us while you are away, knowing they will receive love and attention
                </p>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="service-card text-center h-100">
                <div className="mb-4">
                  <img 
                    src="/service-walking.png" 
                    alt="Dog Walking" 
                    width="64"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/no-image.jpg';
                    }}
                  />
                </div>
                <h5>Dog Walking</h5>
                <p className="text-muted">
                  Our trained walkers ensure your dog gets the exercise they need to stay happy
                </p>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="service-card text-center h-100">
                <div className="mb-4">
                  <img 
                    src="/service-lost.png" 
                    alt="Lost & Found" 
                    width="64"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/no-image.jpg';
                    }}
                  />
                </div>
                <h5>Lost & Found</h5>
                <p className="text-muted">
                  Post or search for lost and found pets in your area with our dedicated platform
                </p>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="service-card text-center h-100">
                <div className="mb-4">
                  <img 
                    src="/service-sitting.png" 
                    alt="Pet Sitting" 
                    width="64"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/no-image.jpg';
                    }}
                  />
                </div>
                <h5>Pet Sitting</h5>
                <p className="text-muted">
                  Professional care for your pets in the comfort of your own home when you're away
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Posts Section */}
      <div className="container py-5">
        <h2 className="text-center mb-5">Recent Lost & Found Pets</h2>
        
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="pet-card h-100">
              <img 
                src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Lost cat" 
                className="img-fluid w-100"
                style={{height: '220px', objectFit: 'cover'}}
              />
              <div className="p-3">
                <span className="badge bg-danger">Missing</span>
                <h5 className="mt-2">The cat is missing, Matrosova str.</h5>
                <p className="text-muted">MY CAT IS MISSING SOS! At 19:30 in Almaty...</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">fr, 21.02.2025</small>
                  <div>
                    <button className="btn btn-sm btn-outline-secondary me-1">
                      <i className="bi bi-share"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="pet-card h-100">
              <img 
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80" 
                alt="Lost dog" 
                className="img-fluid w-100"
                style={{height: '220px', objectFit: 'cover'}}
              />
              <div className="p-3">
                <span className="badge bg-danger">Missing</span>
                <h5 className="mt-2">The dog is missing, Abay street</h5>
                <p className="text-muted">Last time seen in Nauryzbayskii district...</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">tu, 18.02.2025</small>
                  <div>
                    <button className="btn btn-sm btn-outline-secondary me-1">
                      <i className="bi bi-share"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="pet-card h-100">
              <img 
                src="https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Found pet" 
                className="img-fluid w-100"
                style={{height: '220px', objectFit: 'cover'}}
              />
              <div className="p-3">
                <span className="badge bg-success">Found</span>
                <h5 className="mt-2">The dog was found, Old Square</h5>
                <p className="text-muted">The dog, seemingly kind, was found today...</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">mo, 24.02.2025</small>
                  <div>
                    <button className="btn btn-sm btn-outline-secondary me-1">
                      <i className="bi bi-share"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <Link to="/pets" className="btn btn-outline-secondary rounded-pill px-4">
            View All Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 