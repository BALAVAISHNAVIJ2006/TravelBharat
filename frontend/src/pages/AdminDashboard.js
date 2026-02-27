import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import { normalizeCategory } from '../utils/categoryHelper';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [places, setPlaces] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    else if (activeTab === 'places') fetchPlaces();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'reviews') fetchReviews();
  }, [activeTab, pagination.page]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/places?page=${pagination.page}&search=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlaces(response.data.places);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch places');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/users?page=${pagination.page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/reviews/all?page=${pagination.page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(response.data.reviews);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlace = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/places/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t('deleteSuccess'));
      fetchPlaces();
    } catch (error) {
      toast.error('Failed to delete place');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/reviews/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t('deleteSuccess'));
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPagination({ page: 1, pages: 1 });
    setTimeout(() => fetchPlaces(), 0);
  };

  const handleSavePlace = async (formData) => {
    try {
      if (editingPlace) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/admin/places/${editingPlace._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(t('updateSuccess'));
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/admin/places`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(t('createSuccess'));
      }
      setShowModal(false);
      setEditingPlace(null);
      fetchPlaces();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const tabs = [
    { id: 'dashboard', label: t('dashboard'), icon: '📊' },
    { id: 'places', label: t('managePlaces'), icon: '🏛️' },
    { id: 'users', label: t('manageUsers'), icon: '👥' },
    { id: 'reviews', label: t('manageReviews'), icon: '⭐' }
  ];

  return (
    <div className="container">
      <h1 style={{ marginBottom: '32px', fontSize: '32px' }}>{t('admin')} {t('dashboard')}</h1>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '32px',
        borderBottom: '2px solid #e5e7eb',
        overflowX: 'auto'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setPagination({ page: 1, pages: 1 }); }}
            style={{
              padding: '12px 24px',
              background: activeTab === tab.id ? '#4f46e5' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#666',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #4f46e5' : 'none',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {activeTab === 'dashboard' && stats && <DashboardView stats={stats} t={t} />}
          {activeTab === 'places' && (
            <PlacesView
              places={places}
              onAdd={() => { setEditingPlace(null); setShowModal(true); }}
              onEdit={(place) => { setEditingPlace(place); setShowModal(true); }}
              onDelete={handleDeletePlace}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={() => fetchPlaces()}
              onClear={handleClearSearch}
              pagination={pagination}
              setPagination={setPagination}
              t={t}
            />
          )}
          {activeTab === 'users' && (
            <UsersView users={users} pagination={pagination} setPagination={setPagination} t={t} />
          )}
          {activeTab === 'reviews' && (
            <ReviewsView
              reviews={reviews}
              onDelete={handleDeleteReview}
              pagination={pagination}
              setPagination={setPagination}
              t={t}
            />
          )}
        </>
      )}

      {/* Place Modal */}
      {showModal && (
        <PlaceModal
          place={editingPlace}
          onClose={() => { setShowModal(false); setEditingPlace(null); }}
          onSave={handleSavePlace}
          t={t}
        />
      )}
    </div>
  );
};

// Dashboard View Component
const DashboardView = ({ stats, t }) => (
  <div>
    {/* Stats Cards */}
    <div className="grid grid-cols-4" style={{ marginBottom: '32px' }}>
      <StatsCard title={t('totalPlaces')} value={stats.overview.totalPlaces} color="#4f46e5" />
      <StatsCard title={t('totalUsers')} value={stats.overview.totalUsers} color="#10b981" />
      <StatsCard title={t('totalReviews')} value={stats.overview.totalReviews} color="#f59e0b" />
      <StatsCard title={t('totalViews')} value={stats.overview.totalViews} color="#ef4444" />
    </div>

    {/* Charts */}
    <div className="grid grid-cols-2" style={{ marginBottom: '32px' }}>
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>{t('categories')} Distribution</h3>
        {stats.analytics.categoryDistribution.map(cat => (
          <div key={cat._id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>{cat._id}</span>
              <span>{cat.count}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
              <div style={{
                width: `${(cat.count / stats.overview.totalPlaces) * 100}%`,
                height: '100%',
                background: '#4f46e5',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Top {t('states')}</h3>
        {stats.analytics.stateDistribution.map(state => (
          <div key={state._id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>{state._id}</span>
              <span>{state.count}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
              <div style={{
                width: `${(state.count / stats.overview.totalPlaces) * 100}%`,
                height: '100%',
                background: '#10b981',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Top Rated Places */}
    <div className="card" style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '16px' }}>{t('topRated')} {t('places')}</h3>
      <table style={{ width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>{t('name')}</th>
            <th style={{ padding: '12px' }}>{t('state')}</th>
            <th style={{ padding: '12px'}}>{t('rating')}</th>
            <th style={{ padding: '12px' }}>{t('reviews')}</th>
          </tr>
        </thead>
        <tbody>
          {stats.analytics.topRatedPlaces.map(place => (
            <tr key={place._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px' }}>{place.name}</td>
              <td style={{ padding: '12px' }}>{place.state}</td>
              <td style={{ padding: '12px' }}>⭐ {place.averageRating.toFixed(1)}</td>
              <td style={{ padding: '12px' }}>{place.totalReviews}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StatsCard = ({ title, value, color }) => (
  <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
    <div style={{ fontSize: '36px', fontWeight: 'bold', color, marginBottom: '8px' }}>
      {value}
    </div>
    <div style={{ color: '#666' }}>{title}</div>
  </div>
);

// Places View Component
const PlacesView = ({ places, onAdd, onEdit, onDelete, searchTerm, setSearchTerm, onSearch, onClear, pagination, setPagination, t }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '300px' }}>
        <input
          type="text"
          placeholder={t('searchPlaces')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          style={{ flex: 1 }}
        />
        <button onClick={onSearch} className="btn btn-secondary">{t('search')}</button>
        <button onClick={onClear} className="btn btn-secondary">Clear</button>
      </div>
      <button onClick={onAdd} className="btn btn-primary">{t('addPlace')}</button>
    </div>

    <div className="card" style={{ overflow: 'auto' }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', background: '#f9fafb' }}>
            <th style={{ padding: '12px' }}>{t('name')}</th>
            <th style={{ padding: '12px' }}>{t('state')}</th>
            <th style={{ padding: '12px' }}>{t('city')}</th>
            <th style={{ padding: '12px' }}>{t('category')}</th>
            <th style={{ padding: '12px' }}>{t('rating')}</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {places.map(place => (
            <tr key={place._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px' }}>{place.name}</td>
              <td style={{ padding: '12px' }}>{place.state}</td>
              <td style={{ padding: '12px' }}>{place.city}</td>
              <td style={{ padding: '12px' }}>
                <span className="badge badge-primary">{normalizeCategory(place.category)}</span>
              </td>
              <td style={{ padding: '12px' }}>
                ⭐ {place.averageRating ? place.averageRating.toFixed(1) : '0.0'} ({place.totalReviews || 0})
              </td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => onEdit(place)} className="btn btn-secondary" style={{ marginRight: '8px', padding: '6px 12px' }}>
                  {t('edit')}
                </button>
                <button onClick={() => onDelete(place._id)} className="btn btn-danger" style={{ padding: '6px 12px' }}>
                  {t('delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Pagination pagination={pagination} setPagination={setPagination} t={t} />
  </div>
);

// Users View Component
const UsersView = ({ users, pagination, setPagination, t }) => (
  <div>
    <div className="card" style={{ overflow: 'auto' }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', background: '#f9fafb' }}>
            <th style={{ padding: '12px' }}>{t('username')}</th>
            <th style={{ padding: '12px' }}>{t('role')}</th>
            <th style={{ padding: '12px' }}>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px' }}>{user.username}</td>
              <td style={{ padding: '12px' }}>
                <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                  {user.role}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                {new Date(user._id.toString().substring(0, 8), 16).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Pagination pagination={pagination} setPagination={setPagination} t={t} />
  </div>
);

// Reviews View Component
const ReviewsView = ({ reviews, onDelete, pagination, setPagination, t }) => (
  <div>
    <div className="card" style={{ overflow: 'auto' }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', background: '#f9fafb' }}>
            <th style={{ padding: '12px' }}>Place</th>
            <th style={{ padding: '12px' }}>User</th>
            <th style={{ padding: '12px' }}>{t('rating')}</th>
            <th style={{ padding: '12px' }}>{t('comment')}</th>
            <th style={{ padding: '12px' }}>Date</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(review => (
            <tr key={review._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px' }}>{review.placeId?.name || 'N/A'}</td>
              <td style={{ padding: '12px' }}>{review.userId?.username || 'Unknown'}</td>
              <td style={{ padding: '12px' }}>⭐ {review.rating}</td>
              <td style={{ padding: '12px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {review.comment}
              </td>
              <td style={{ padding: '12px' }}>{new Date(review.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => onDelete(review._id)} className="btn btn-danger" style={{ padding: '6px 12px' }}>
                  {t('delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Pagination pagination={pagination} setPagination={setPagination} t={t} />
  </div>
);

// Pagination Component
const Pagination = ({ pagination, setPagination, t }) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
    <button
      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
      disabled={pagination.page === 1}
      className="btn btn-secondary"
      style={{ opacity: pagination.page === 1 ? 0.5 : 1 }}
    >
      {t('previous')}
    </button>
    <span style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
      {t('page')} {pagination.page} {t('of')} {pagination.pages || 1}
    </span>
    <button
      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
      disabled={pagination.page >= pagination.pages}
      className="btn btn-secondary"
      style={{ opacity: pagination.page >= pagination.pages ? 0.5 : 1 }}
    >
      {t('next')}
    </button>
  </div>
);

// Place Modal Component
const PlaceModal = ({ place, onClose, onSave, t }) => {
  const [formData, setFormData] = useState({
    name: place?.name || '',
    state: place?.state || '',
    city: place?.city || '',
    category: normalizeCategory(place?.category) || 'Heritage',
    description: place?.description || '',
    bestTimeToVisit: place?.bestTimeToVisit || '',
    location: place?.location || '',
    images: place?.images?.join(', ') || '',
    entryFees: place?.entryFees || '',
    timings: place?.timings || '',
    nearbyAttractions: place?.nearbyAttractions?.join(', ') || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // convert simple coordinate pair into a Google Maps search URL
    let locationValue = formData.location.trim();
    if (locationValue && !/^https?:\/\//i.test(locationValue)) {
      const coords = locationValue.split(',').map(s => s.trim());
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        locationValue = `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`;
      }
    }

    const data = {
      ...formData,
      location: locationValue,
      images: formData.images.split(',').map(img => img.trim()).filter(Boolean),
      nearbyAttractions: formData.nearbyAttractions.split(',').map(attr => attr.trim()).filter(Boolean)
    };
    onSave(data);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      overflow: 'auto'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '32px'
      }}>
        <h2 style={{ marginBottom: '24px' }}>
          {place ? t('editPlace') : t('addPlace')}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div>
              <label>{t('name')} *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label>{t('category')} *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="Heritage">Heritage</option>
                <option value="Nature">Nature</option>
                <option value="Adventure">Adventure</option>
                <option value="Religious">Religious</option>
              </select>
            </div>

            <div>
              <label>{t('state')} *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>

            <div>
              <label>{t('city')} *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label>{t('description')} *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2" style={{ gap: '16px', marginTop: '16px' }}>
            <div>
              <label>{t('bestTime')} *</label>
              <input
                type="text"
                value={formData.bestTimeToVisit}
                onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                required
              />
            </div>

            <div>
              <label>{t('location')}</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Map URL or coordinates (lat,lng)"
              />
            </div>

            <div>
              <label>{t('entryFees')}</label>
              <input
                type="text"
                value={formData.entryFees}
                onChange={(e) => setFormData({ ...formData, entryFees: e.target.value })}
              />
            </div>

            <div>
              <label>{t('timings')}</label>
              <input
                type="text"
                value={formData.timings}
                onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label>{t('images')} (comma-separated URLs)</label>
            <input
              type="text"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="url1, url2, url3"
            />
          </div>

          <div style={{ marginTop: '16px' }}>
            <label>{t('nearbyAttractions')} (comma-separated)</label>
            <input
              type="text"
              value={formData.nearbyAttractions}
              onChange={(e) => setFormData({ ...formData, nearbyAttractions: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {t('save')}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
