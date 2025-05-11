import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    // For now, we'll just simulate a successful submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };
  
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Contact</h1>
          
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title mb-4">Get in Touch</h5>
                  
                  {submitted ? (
                    <div className="alert alert-success">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Your message has been sent successfully! We'll get back to you soon.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Your Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="name" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          id="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="subject" className="form-label">Subject</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="subject" 
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="message" className="form-label">Message</label>
                        <textarea 
                          className="form-control" 
                          id="message" 
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                      
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-send me-2"></i>
                        Send Message
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title mb-4">Contact Information</h5>
                  
                  <div className="mb-4">
                    <h6 className="text-success">
                      <i className="bi bi-globe me-2"></i>
                      Online Contact Form
                    </h6>
                    <p className="text-muted ms-4 mb-0">Available 24 hours a day</p>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="text-success">
                      <i className="bi bi-telephone me-2"></i>
                      Phone
                    </h6>
                    <p className="text-muted ms-4 mb-0">
                      +1-888-444-555<br />
                      Mon. - Fri. from 8:00 am to 5:00 pm<br />
                      Sat. 8:00 am to 2:00 pm
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="text-success">
                      <i className="bi bi-geo-alt me-2"></i>
                      Address
                    </h6>
                    <p className="text-muted ms-4 mb-0">
                      384 Tenney Mountain Highway<br />
                      Plymouth, NH 03264
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="text-success">
                      <i className="bi bi-envelope me-2"></i>
                      Email
                    </h6>
                    <p className="text-muted ms-4 mb-0">
                      <a href="mailto:info@findmypet.com" className="text-decoration-none">
                        info@findmypet.com
                      </a>
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <h6>Follow Us</h6>
                    <div className="social-icons mt-2">
                      <a href="#" className="btn btn-outline-secondary me-2">
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a href="#" className="btn btn-outline-secondary me-2">
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a href="#" className="btn btn-outline-secondary">
                        <i className="bi bi-twitter-x"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Our Location</h5>
              <div className="ratio ratio-21x9">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2904.2816073957894!2d-71.69098392342215!3d43.75638587109751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cb309b14d11e8d5%3A0x9d8d2c724a36f3e!2s384%20Tenney%20Mountain%20Hwy%2C%20Plymouth%2C%20NH%2003264%2C%20USA!5e0!3m2!1sen!2sus!4v1702939528046!5m2!1sen!2sus"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="FindMyPet Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 