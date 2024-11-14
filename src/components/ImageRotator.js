// src/components/ImageRotator.js
import React, { useState, useEffect } from 'react';
import ck from './ck.jpg';
import pizza from './pizza.jpg';
import burger from './burger.jpg';

const images = [ck, pizza, burger];

const ImageRotator = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Adjust time as needed (3000ms = 3 seconds)

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <img
        src={images[currentImageIndex]}
        alt="Rotating display"
        style={{ width: '100%', maxWidth: '300px', height: 'auto', borderRadius: '8px' }}
      />
    </div>
  );
};

export default ImageRotator;
