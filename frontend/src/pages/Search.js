import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import PlaceCard from '../components/PlaceCard';

const Search = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    const cat = params.get('category') || '';
    
    setQuery(q);
    setCategory(cat);
    
    if (q || cat) {
      handleSearch(q, cat);
    }
  }, [location.search]);

  const handleSearch = async (searchQuery = query, searchCategory = category, searchState = state) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (searchCategory) params.append('category', searchCategory);
      if (searchState) params.append('state', searchState);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/places/search?${params.toString()}`
      );
      setResults(response.data.places || response.data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '24px' }}>{t('searchPlaces')}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        {/* Filter Sidebar */}
        <div className="filter-sidebar">
          <form onSubmit={handleSubmit}>
            <div className="filter-group">
              <h4>{t('search')}</h4>
              <input
                type="text"
                placeholder={t('searchPlaces')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <h4>{t('category')}</h4>
              <select value={category} onChange={(e) => { setCategory(e.target.value); handleSearch(query, e.target.value, state); }}>
                <option value="">All Categories</option>
                <option value="Heritage">{t('heritage')}</option>
                <option value="Nature">{t('nature')}</option>
                <option value="Adventure">{t('adventure')}</option>
                <option value="Religious">{t('religious')}</option>
              </select>
            </div>

            <div className="filter-group">
              <h4>{t('state')}</h4>
              <input
                type="text"
                placeholder="Enter state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {t('search')}
            </button>

            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('');
                setState('');
                setResults([]);
              }}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '8px' }}
            >
              Clear Filters
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {loading ? (
            <div className="spinner"></div>
          ) : results.length > 0 ? (
            <>
              <p style={{ marginBottom: '16px', color: '#666' }}>
                {t('showingResults')}: {results.length} {t('places')}
              </p>
              <div className="grid grid-cols-3">
                {results.map(place => (
                  <PlaceCard key={place._id} place={place} />
                ))}
              </div>
            </>
          ) : (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: 'white',
              borderRadius: '12px'
            }}>
              <h2>{t('noResults')}</h2>
              <p style={{ color: '#666', marginTop: '8px' }}>Try different search terms or filters</p>
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        @media (max-width: 768px) {
          .container > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Search;
