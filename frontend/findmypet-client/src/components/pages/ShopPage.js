import React from 'react';

const ShopPage = () => {
  const products = [
    {
      id: 1,
      name: 'Premium Dog Food',
      price: 29.99,
      image: 'https://via.placeholder.com/150',
      category: 'Food',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Cat Scratching Post',
      price: 39.99,
      image: 'https://via.placeholder.com/150',
      category: 'Toys',
      rating: 4.2
    },
    {
      id: 3,
      name: 'Pet Carrier',
      price: 45.99,
      image: 'https://via.placeholder.com/150',
      category: 'Accessories',
      rating: 4.8
    },
    {
      id: 4,
      name: 'Dog Leash',
      price: 15.99,
      image: 'https://via.placeholder.com/150',
      category: 'Accessories',
      rating: 4.3
    },
    {
      id: 5,
      name: 'Cat Litter Box',
      price: 24.99,
      image: 'https://via.placeholder.com/150',
      category: 'Essentials',
      rating: 4.0
    },
    {
      id: 6,
      name: 'Bird Cage',
      price: 79.99,
      image: 'https://via.placeholder.com/150',
      category: 'Housing',
      rating: 4.6
    },
    {
      id: 7,
      name: 'Pet Shampoo',
      price: 12.99,
      image: 'https://via.placeholder.com/150',
      category: 'Grooming',
      rating: 4.4
    },
    {
      id: 8,
      name: 'Interactive Dog Toy',
      price: 19.99,
      image: 'https://via.placeholder.com/150',
      category: 'Toys',
      rating: 4.7
    }
  ];

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1>Pet Shop</h1>
          <p className="lead">Quality products for your beloved pets</p>
        </div>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Categories</h5>
            </div>
            <div className="list-group list-group-flush">
              <button className="list-group-item list-group-item-action">All Products</button>
              <button className="list-group-item list-group-item-action">Food</button>
              <button className="list-group-item list-group-item-action">Toys</button>
              <button className="list-group-item list-group-item-action">Accessories</button>
              <button className="list-group-item list-group-item-action">Grooming</button>
              <button className="list-group-item list-group-item-action">Housing</button>
              <button className="list-group-item list-group-item-action">Essentials</button>
            </div>
          </div>
        </div>
        
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="me-2">Sort by:</span>
              <select className="form-select form-select-sm d-inline-block w-auto">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
                <option>Newest</option>
              </select>
            </div>
            <div className="text-muted">
              Showing {products.length} products
            </div>
          </div>
          
          <div className="row">
            {products.map(product => (
              <div key={product.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                <div className="card h-100">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h6 className="card-title">{product.name}</h6>
                    <div className="mb-2">
                      <span className="text-warning">
                        {'★'.repeat(Math.floor(product.rating))}
                        {'☆'.repeat(5 - Math.floor(product.rating))}
                      </span>
                      <small className="text-muted ms-1">({product.rating})</small>
                    </div>
                    <p className="card-text text-primary fw-bold">${product.price}</p>
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    <button className="btn btn-sm btn-outline-primary w-100">
                      <i className="bi bi-cart-plus me-1"></i> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="alert alert-info mt-4 text-center">
            <i className="bi bi-info-circle me-2"></i>
            This is a demo shop page. In a real application, product data would come from a database.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage; 