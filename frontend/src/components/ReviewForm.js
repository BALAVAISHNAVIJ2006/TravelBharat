import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import StarRating from './StarRating';

const ReviewForm = ({ placeId, onReviewSubmitted }) => {
  const { t, i18n } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error(t('loginToReview'));
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/reviews`,
        {
          placeId,
          rating,
          comment: comment.trim(),
          language: i18n.language
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(t('reviewSuccess'));
      setRating(0);
      setComment('');
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      const message = error.response?.data?.message || t('reviewError');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{
        padding: '20px',
        background: '#f3f4f6',
        borderRadius: '8px',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <p>{t('loginToReview')}</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginTop: '20px'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>{t('writeReview')}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            {t('rating')} *
          </label>
          <StarRating rating={rating} onRatingChange={setRating} size={32} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            {t('comment')} *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('yourReview')}
            maxLength={1000}
            rows={5}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            required
          />
          <small style={{ color: '#666' }}>{comment.length}/1000</small>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            background: loading ? '#9ca3af' : '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
        >
          {loading ? t('loading') : t('submit')}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
