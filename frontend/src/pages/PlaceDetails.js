import React, { useEffect, useState } from 'react';
import { normalizeCategory } from '../utils/categoryHelper';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const PlaceDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchPlace();
    incrementViews();
  }, [id]);

  const fetchPlace = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/places/${id}`);
      setPlace(response.data);
      // Fetch Unsplash images if place images are empty
      if (!response.data.images || response.data.images.length === 0) {
        fetchUnsplashImages(response.data.name);
      } else {
        setImages(response.data.images);
      }
    } catch (error) {
      console.error('Error fetching place:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnsplashImages = async (placeName) => {
    if (!process.env.REACT_APP_UNSPLASH_ACCESS_KEY) {
      console.warn('Unsplash API key missing in .env');
      setImages([]);
      return;
    }

    try {
      const query = `${placeName} India tourism landmark`;
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape&content_filter=high`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (response.data.results && response.data.results.length > 0) {
        const photos = response.data.results.map((photo) => photo.urls.regular);
        setImages(photos);
      } else {
        setImages([]);
      }
    } catch (err) {
      console.error('Unsplash fetch error:', err.response?.data || err.message);
      setImages([]);
    }
  };

  const incrementViews = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/places/${id}/view`);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleReviewSubmitted = () => {
    setReviewRefresh(prev => prev + 1);
    fetchPlace(); // Refresh place to get updated rating
  };

  const getLocalizedContent = (field, fallback) => {
    const langField = `${field}_${i18n.language}`;
    return place[langField] || place[field] || fallback;
  };

  const descriptionText = (() => {
    if (!place) return '';
    const text = getLocalizedContent('description', place.description || '');
    // If migrated data mistakenly stores category in description, avoid showing it
    if (place.category && text && text.trim() === place.category.trim()) {
      return '';
    }
    return text;
  })();

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!place) {
    return (
      <div className="container text-center" style={{ padding: '60px 20px' }}>
        <h2>Place not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Cover Image Banner */}
      {(images && images.length > 0) && (
        <div style={{ width: '100%', height: '420px', overflow: 'hidden', borderRadius: '12px', marginBottom: '20px' }}>
          <img
            src={images[0]}
            alt={place.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x420?text=Image+Not+Found'; }}
          />
        </div>
      )}
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        <Link to="/" style={{ color: '#4f46e5' }}>{t('home')}</Link>
        {' > '}
        <Link to={`/state/${place.state}`} style={{ color: '#4f46e5' }}>{place.state}</Link>
        {' > '}
        <span>{getLocalizedContent('name', place.name)}</span>
      </nav>

      {/* Header Section */}
      <div style={{
        background: 'white',
        padding: '32px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '16px', color: '#333' }}>
          {getLocalizedContent('name', place.name)}
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StarRating rating={place.averageRating || 0} readOnly size={24} />
            <span style={{ fontWeight: '600', fontSize: '18px' }}>
              {place.averageRating ? place.averageRating.toFixed(1) : '0.0'}
            </span>
            <span style={{ color: '#666' }}>
              ({place.totalReviews || 0} {t('reviews')})
            </span>
          </div>
          <span className="badge badge-success">{place.state}, {place.city}</span>
        </div>

        <div style={{
          background: '#f0f9ff',
          padding: '16px',
          borderRadius: '8px',
          border: '2px solid #bfdbfe',
          marginBottom: '24px'
        }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#1e40af', fontWeight: '500' }}>
            📂 Category: <strong>{normalizeCategory(place.category)}</strong>
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ padding: '12px', background: '#f3f4f6', borderRadius: '8px' }}>
            <p style={{ margin: '0', fontSize: '12px', color: '#666', marginBottom: '4px' }}>best time to visit</p>
            <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
              🗓️ {place.bestTimeToVisit}
            </p>
          </div>
          {place.entryFees && (
            <div style={{ padding: '12px', background: '#f3f4f6', borderRadius: '8px' }}>
              <p style={{ margin: '0', fontSize: '12px', color: '#666', marginBottom: '4px' }}>entry fees</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                💵 {place.entryFees}
              </p>
            </div>
          )}
          {place.timings && (
            <div style={{ padding: '12px', background: '#f3f4f6', borderRadius: '8px' }}>
              <p style={{ margin: '0', fontSize: '12px', color: '#666', marginBottom: '4px' }}>timings</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                ⏰ {place.timings}
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main Content */}
        <div>
          {/* Description */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '16px' }}>{t('description')}</h2>
            <p style={{ lineHeight: '1.8', color: '#4b5563' }}>
              {descriptionText || 'Description not available for this place.'}
            </p>
          </div>

          {/* Image Gallery */}
          {images && images.length > 0 && (
            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '16px' }}>{t('gallery')}</h2>
              <div className="grid grid-cols-2" style={{ gap: '12px' }}>
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${place.name} ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x250?text=Image+Not+Found';
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <ReviewForm placeId={id} onReviewSubmitted={handleReviewSubmitted} />
            <ReviewList placeId={id} refreshTrigger={reviewRefresh} />
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Location Map */}
          {place.location && (() => {
            // If the stored location isn't a full URL, try to format it as
            // a Google Maps link. Common case: coordinates "lat,lng".
            let mapHref = place.location;
            if (!/^https?:\/\//i.test(mapHref)) {
              const parts = mapHref.split(',').map((s) => s.trim());
              if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                mapHref = `https://www.google.com/maps/search/?api=1&query=${parts[0]},${parts[1]}`;
              }
            }

            return (
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '12px' }}>{t('location')}</h3>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  {t('viewOnMap')}
                </a>
              </div>
            );
          })()}

          {/* Nearby Attractions */}
          {place.nearbyAttractions && place.nearbyAttractions.length > 0 && (
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '12px' }}>{t('nearbyAttractions')}</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {place.nearbyAttractions.map((attraction, index) => (
                  <li
                    key={index}
                    style={{
                      padding: '8px 0',
                      borderBottom: index < place.nearbyAttractions.length - 1 ? '1px solid #e5e7eb' : 'none',
                      color: '#4b5563'
                    }}
                  >
                    • {attraction}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        @media (max-width: 768px) {
          .container > div:nth-child(3) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
     </div>
  );
};

export default PlaceDetails;
