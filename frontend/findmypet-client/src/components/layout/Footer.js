import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>FindMyPet</h5>
            <p className="text-muted">
              A platform to help find missing pets and return them to their loving owners.
            </p>
          </div>
          
          <div className="col-md-3 mb-3">
            <h5>Links</h5>
            <ul className="list-unstyled">
              <li><Link className="text-muted" to="/">Home</Link></li>
              <li><Link className="text-muted" to="/pets">Listings</Link></li>
              <li><Link className="text-muted" to="/map">Map</Link></li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-3">
            <h5>Account</h5>
            <ul className="list-unstyled">
              <li><Link className="text-muted" to="/login">Log In</Link></li>
              <li><Link className="text-muted" to="/register">Register</Link></li>
              <li><Link className="text-muted" to="/profile/pets">My Listings</Link></li>
            </ul>
          </div>
          
          <div className="col-md-2 mb-3">
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li><a className="text-muted" href="mailto:contact@findmypet.kz">Email</a></li>
              <li><a className="text-muted" href="tel:+77001234567">Phone</a></li>
            </ul>
          </div>
        </div>
        
        <hr />
        
        <div className="row">
          <div className="col-md-6 mb-2">
            <p className="mb-0 text-muted">
              &copy; {new Date().getFullYear()} FindMyPet. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="social-icons">
              <a href="#" className="text-muted me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-muted me-3">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 