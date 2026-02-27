import React from 'react';

const StarRating = ({ rating, onRatingChange, readOnly = false, size = 24 }) => {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          style={{
            fontSize: `${size}px`,
            cursor: readOnly ? 'default' : 'pointer',
            color: star <= rating ? '#f59e0b' : '#d1d5db',
            transition: 'color 0.2s'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
