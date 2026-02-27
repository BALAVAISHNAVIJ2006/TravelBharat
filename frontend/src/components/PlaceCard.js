import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';

const PlaceCard = ({ place }) => {
  const { t } = useTranslation();

  return (
    <Link to={`/place/${place._id}`} style={{ textDecoration: 'none' }}>
      <div className="card">
        <img
          src={(place.images && place.images[0]) || place.image || place.cover || 'https://via.placeholder.com/600x350?text=Beautiful+Place'}
          alt={place.name}
          className="card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/600x350?text=Image+Not+Available';
          }}
        />
        <div className="card-content">
          <h3 className="card-title">{place.name}</h3>
          <p className="card-text">{place.city}, {place.state}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <StarRating rating={place.averageRating || 0} readOnly size={18} />
            <span style={{ fontSize: '14px', color: '#666' }}>
              ({place.totalReviews || 0})
            </span>
          </div>
          <span className="badge badge-primary">{place.category}</span>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
