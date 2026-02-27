import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import StarRating from '../components/StarRating';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [coverImages, setCoverImages] = useState({});
  const [stats, setStats] = useState({ places: 0, states: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch Unsplash cover images for featured places that lack images
  useEffect(() => {
    const fetchCovers = async () => {
      if (!featuredPlaces || featuredPlaces.length === 0) return;
      try {
        const placesNeeding = featuredPlaces.filter(p => !p.images || p.images.length === 0);
        if (placesNeeding.length === 0) return;

        const newCovers = {};
        for (const p of placesNeeding) {
          try {
            const query = `${p.name} India landmark`;
            const res = await axios.get(
              `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`,
              { headers: { Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}` } }
            );
            if (res.data && res.data.results && res.data.results[0]) {
              newCovers[p._id] = res.data.results[0].urls.regular;
            }
          } catch (err) {
            // ignore per-place errors
            console.warn('Unsplash cover fetch failed for', p.name, err?.message || err);
          }
        }
        if (Object.keys(newCovers).length > 0) {
          setCoverImages(prev => ({ ...prev, ...newCovers }));
        }
      } catch (err) {
        console.error('Error fetching cover images:', err);
      }
    };

    fetchCovers();
  }, [featuredPlaces]);

  const fetchData = async () => {
    try {
      const [statesRes, featuredRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/places/states`),
        axios.get(`${process.env.REACT_APP_API_URL}/places/featured?limit=6`)
      ]);
      
      setStates(statesRes.data);
      setFeaturedPlaces(featuredRes.data);
      
      const totalPlaces = statesRes.data.reduce((sum, s) => sum + s.count, 0);
      setStats({ places: totalPlaces, states: statesRes.data.length });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { name: t('heritage'), value: 'Heritage', color: '#8b5cf6' },
    { name: t('nature'), value: 'Nature', color: '#10b981' },
    { name: t('adventure'), value: 'Adventure', color: '#f59e0b' },
    { name: t('religious'), value: 'Religious', color: '#ef4444' }
  ];

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        color: 'white',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px', fontWeight: 'bold' }}>
          {t('welcome')}
        </h1>
        <p style={{ fontSize: '20px', marginBottom: '32px', opacity: 0.9 }}>
          {t('tagline')}
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-bar" style={{ maxWidth: '600px' }}>
          <input
            type="text"
            placeholder={t('searchPlaces')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '16px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '8px',
              flex: 1
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '16px 32px', fontSize: '16px' }}
          >
            {t('search')}
          </button>
        </form>
      </section>

      {/* Statistics */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', color: '#4f46e5', fontWeight: 'bold' }}>
            {stats.places}
          </div>
          <div style={{ fontSize: '18px', color: '#666', marginTop: '8px' }}>
            {t('totalPlaces')}
          </div>
        </div>
        <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', color: '#10b981', fontWeight: 'bold' }}>
            {stats.states}
          </div>
          <div style={{ fontSize: '18px', color: '#666', marginTop: '8px' }}>
            {t('states')}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '32px' }}>
          {t('categories')}
        </h2>
        <div className="grid grid-cols-4">
          {categories.map(cat => (
            <Link
              key={cat.value}
              to={`/search?category=${cat.value}`}
              style={{
                textDecoration: 'none',
                background: cat.color,
                color: 'white',
                padding: '40px 20px',
                borderRadius: '12px',
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: '600',
                transition: 'transform 0.2s',
                display: 'block'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Places */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '32px' }}>
          {t('featured')}
        </h2>
        <div className="grid grid-cols-3">
          {featuredPlaces.map(place => {
            const cover = (place.images && place.images[0]) || coverImages[place._id] || 'https://via.placeholder.com/400x250?text=No+Image';
            return (
              <Link key={place._id} to={`/place/${place._id}`} style={{ textDecoration: 'none' }}>
                <div className="card">
                  <img
                    src={cover}
                    alt={place.name}
                    className="card-img"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Image+Not+Found'; }}
                  />
                  <div className="card-content">
                    <h3 className="card-title">{place.name}</h3>
                    <p className="card-text">{place.city}, {place.state}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StarRating rating={place.averageRating || 0} readOnly size={18} />
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        ({place.totalReviews || 0})
                      </span>
                    </div>
                    <span className="badge badge-primary" style={{ marginTop: '8px' }}>
                      {place.category}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* States List */}
      <section>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '32px' }}>
          {t('exploreIndia')}
        </h2>
        <div className="grid grid-cols-4">
          {states.map(state => (
            <Link
              key={state.state}
              to={`/state/${state.state}`}
              className="card"
              style={{ textDecoration: 'none', overflow: 'hidden' }}
            >
              {state.image && (
                <img
                  src={state.image}
                  alt={state.state}
                  className="card-img"
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=' + encodeURIComponent(state.state);
                  }}
                />
              )}
              <div className="card-content">
                <h3 className="card-title">{state.state}</h3>
                <p className="card-text">{state.count} {t('places')}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
