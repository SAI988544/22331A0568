import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getURLByShortCode, recordClick } from '../utils/helpers';
import { logger } from '../utils/Logger';

const RedirectHandler = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = getURLByShortCode(shortCode);
    if (url) {
      const source = document.referrer || 'direct';
      const location = navigator.language || 'unknown';
      recordClick(shortCode, source, location);
      logger.info('Redirecting to long URL', { shortCode, longUrl: url.longUrl });
      window.location.href = url.longUrl;
    } else {
      logger.error('Invalid or expired shortcode', { shortCode });
      navigate('/error', { state: { message: 'Invalid or expired short URL' } });
    }
  }, [shortCode, navigate]);

  return null;
};

export default RedirectHandler;