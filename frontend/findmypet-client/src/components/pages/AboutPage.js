import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">About Us</h1>
          
          <div className="card mb-4">
            <div className="card-body">
              <p className="lead">
                Welcome to Find My Pet, your trusted companion in pet care and services! We are dedicated to helping pet owners 
                connect with reliable solutions for their furry friends, whether it's finding lost pets, pet boarding, walking, or shopping for 
                quality pet products.
              </p>
              
              <p>
                Our mission is to ensure every pet gets the love, care, and safety they deserve. Losing a pet can be heartbreaking, which is 
                why we offer a Lost & Found service to help reunite missing pets with their owners.
              </p>
              
              <p>
                Beyond that, we provide pet boarding for when you need a safe place for your pet, dog walking to keep them active, and a 
                pet shop filled with everything they need to stay happy and healthy.
              </p>
              
              <p>
                At Find My Pet, we believe pets are family, and we're here to support you every step of the way. Join our community and 
                let's make the world a better place for our beloved pets!
              </p>
            </div>
          </div>
          
          <h2 className="mb-4">Our Services</h2>
          
          <div className="row mb-5">
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-search fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Lost & Found</h5>
                  <p className="card-text">Help reunite pets with their owners through our platform.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-house-heart fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Pet Boarding</h5>
                  <p className="card-text">Safe and comfortable accommodation for your pets when you're away.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-person-walking fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Dog Walking</h5>
                  <p className="card-text">Professional dog walking services to keep your pet active and healthy.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-bag-heart fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Pet Shop</h5>
                  <p className="card-text">Quality products for all your pet's needs, from food to toys and accessories.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/pets" className="btn btn-primary me-2">Find Lost Pets</Link>
            <Link to="/contact" className="btn btn-outline-secondary">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 