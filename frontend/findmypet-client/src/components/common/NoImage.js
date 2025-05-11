import React from 'react';

const NoImage = ({ width = '100%', height = '200px', className = '' }) => {
  return (
    <img 
      src="/images/no-image.jpg"
      alt="No image available"
      style={{ width, height, objectFit: 'cover' }}
      className={className}
    />
  );
};

export default NoImage; 