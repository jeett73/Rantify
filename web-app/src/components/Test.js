import React, { useState } from 'react';

const ImageSlider = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div>
      <div>
        <img src={images[currentImageIndex]} alt={`Image ${currentImageIndex}`} />
      </div>
      <button onClick={nextImage}>Next</button>
    </div>
  );
};

// Usage
const Test = () => {
  const images = [
    'https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1&h=180-can-of-coke-on-a-tree-stump-by-the-beach.jpg',
    'https://electrek.co/wp-content/uploads/sites/3/2020/01/propella-header.jpg?quality=82&strip=all&w=1600',
    // Add more image URLs as needed
  ];

  return (
    <div>
      <h1>Image Slider</h1>
      <ImageSlider images={images} />
    </div>
  );
};

export default Test;
