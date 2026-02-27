import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={() => changeLanguage('en')}
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
          border: i18n.language === 'en' ? '2px solid #4f46e5' : '1px solid #ddd',
          background: i18n.language === 'en' ? '#4f46e5' : 'white',
          color: i18n.language === 'en' ? 'white' : '#333',
          cursor: 'pointer',
          fontWeight: i18n.language === 'en' ? 'bold' : 'normal'
        }}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('hi')}
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
          border: i18n.language === 'hi' ? '2px solid #4f46e5' : '1px solid #ddd',
          background: i18n.language === 'hi' ? '#4f46e5' : 'white',
          color: i18n.language === 'hi' ? 'white' : '#333',
          cursor: 'pointer',
          fontWeight: i18n.language === 'hi' ? 'bold' : 'normal'
        }}
      >
        हिं
      </button>
      <button
        onClick={() => changeLanguage('ta')}
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
          border: i18n.language === 'ta' ? '2px solid #4f46e5' : '1px solid #ddd',
          background: i18n.language === 'ta' ? '#4f46e5' : 'white',
          color: i18n.language === 'ta' ? 'white' : '#333',
          cursor: 'pointer',
          fontWeight: i18n.language === 'ta' ? 'bold' : 'normal'
        }}
      >
        த
      </button>
    </div>
  );
};

export default LanguageSwitcher;
