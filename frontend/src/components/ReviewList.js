import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import StarRating from './StarRating';

const ReviewList = ({ placeId, refreshTrigger }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const token = localStorage.getItem('token');
  const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    fetchReviews();
  }, [placeId, pagination.page, refreshTrigger]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/reviews/place/${placeId}?page=${pagination.page}&limit=10`
      );
      setReviews(response.data.reviews);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm(t('confirmDelete'))) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t('deleteSuccess'));
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  if (loading && pagination.page === 1) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        background: '#f9fafb',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <p style={{ color: '#666', fontSize: '16px' }}>{t('noReviews')}</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>
        {t('reviews')} ({pagination.total})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reviews.map((review) => (
          <div
            key={review._id}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div>
                <div style={{
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '4px'
                }}>
                  {review.userName || review.userId?.username || 'Anonymous'}
                </div>
                <StarRating rating={review.rating} readOnly size={20} />
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <small style={{ color: '#9ca3af' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
                {currentUserId === review.userId?._id && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    style={{
                      padding: '4px 8px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {t('delete')}
                  </button>
                )}
              </div>
            </div>

            <p style={{
              color: '#4b5563',
              lineHeight: '1.6',
              margin: 0
            }}>
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            style={{
              padding: '8px 16px',
              background: pagination.page === 1 ? '#e5e7eb' : '#4f46e5',
              color: pagination.page === 1 ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: pagination.page === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            {t('previous')}
          </button>
          
          <span style={{ color: '#666' }}>
            {t('page')} {pagination.page} {t('of')} {pagination.pages}
          </span>
          
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page === pagination.pages}
            style={{
              padding: '8px 16px',
              background: pagination.page === pagination.pages ? '#e5e7eb' : '#4f46e5',
              color: pagination.page === pagination.pages ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer'
            }}
          >
            {t('next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
