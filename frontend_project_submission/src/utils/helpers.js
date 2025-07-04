import { logger } from './Logger';

const storage = {
  urls: JSON.parse(localStorage.getItem('shortenedUrls')) || [],
  save() {
    localStorage.setItem('shortenedUrls', JSON.stringify(this.urls));
  },
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const generateShortCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  if (storage.urls.some((u) => u.shortCode === code)) {
    return generateShortCode();
  }
  return code;
};

export const storeURL = async (longUrl, validityMinutes, shortCode) => {
  if (storage.urls.some((u) => u.shortCode === shortCode)) {
    throw new Error(`Shortcode ${shortCode} is already in use`);
  }

  const createdAt = new Date();
  const expiry = new Date(createdAt.getTime() + validityMinutes * 60 * 1000);
  const urlEntry = {
    longUrl,
    shortCode,
    createdAt: createdAt.toISOString(),
    expiry: expiry.toISOString(),
    clicks: [],
  };

  storage.urls.push(urlEntry);
  storage.save();
  logger.info('Stored new URL', { shortCode, longUrl, validityMinutes });
  return urlEntry;
};

export const getURLs = () => {
  storage.urls = storage.urls.filter((url) => new Date(url.expiry) > new Date());
  storage.save();
  return storage.urls;
};

export const recordClick = (shortCode, source = 'unknown', location = 'unknown') => {
  const url = storage.urls.find((u) => u.shortCode === shortCode);
  if (url && new Date(url.expiry) > new Date()) {
    url.clicks.push({
      timestamp: new Date().toISOString(),
      source,
      location,
    });
    storage.save();
    logger.info('Recorded click', { shortCode, source, location });
  }
};

export const getURLByShortCode = (shortCode) => {
  const url = storage.urls.find((u) => u.shortCode === shortCode);
  if (url && new Date(url.expiry) > new Date()) {
    return url;
  }
  return null;
};