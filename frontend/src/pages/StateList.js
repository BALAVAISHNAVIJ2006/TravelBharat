import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import PlaceCard from '../components/PlaceCard';

const StateList = () => {
  const { state } = useParams();
  const { t } = useTranslation();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchPlaces();
  }, [state]);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/places/state/${state}`
      );
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlaces = selectedCategory === 'all'
    ? places
    : places.filter(place => place.category === selectedCategory);

  const categories = ['all', 'Heritage', 'Nature', 'Adventure', 'Religious'];

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        <Link to="/" style={{ color: '#4f46e5' }}>{t('home')}</Link>
        {' > '}
        <span>{state}</span>
      </nav>

      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px',
        borderRadius: '12px',
        color: 'white',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>
          {state}
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          {places.length} {t('places')} to explore
        </p>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '10px 20px',
              background: selectedCategory === cat ? '#4f46e5' : 'white',
              color: selectedCategory === cat ? 'white' : '#333',
              border: '2px solid #4f46e5',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            {cat === 'all' ? 'All' : t(cat.toLowerCase())}
          </button>
        ))}
      </div>

      {/* Places Grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-3">
          {filteredPlaces.map(place => (
            <PlaceCard key={place._id} place={place} />
          ))}
        </div>
      ) : (
        <div style={
{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'white',
          borderRadius: '12px'
        }}>
          <h2>{t('noResults')}</h2>
          <p style={{ color: '#666', marginTop: '8px' }}>
            No places found in this category
          </p>
        </div>
      )}
    </div>
  );
};

export default StateList;
