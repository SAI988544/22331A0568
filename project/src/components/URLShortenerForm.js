import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, List, ListItem, ListItemText } from '@mui/material';
import { logger } from '../utils/Logger';
import { generateShortCode, storeURL, validateURL } from '../utils/helpers';

const URLShortenerForm = ({ onShorten }) => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', shortCode: '' }]);
  const [errors, setErrors] = useState([]);
  const [results, setResults] = useState([]);

  const handleAddUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', shortCode: '' }]);
      logger.info('Added new URL input field', { urlCount: urls.length + 1 });
    } else {
      setErrors(['Cannot add more than 5 URLs']);
      logger.warn('Attempted to add more than 5 URLs');
    }
  };

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const newErrors = [];
    const newResults = [];

    for (let i = 0; i < urls.length; i++) {
      const { longUrl, validity, shortCode } = urls[i];

      if (!validateURL(longUrl)) {
        newErrors.push(`Invalid URL at position ${i + 1}`);
        logger.error('Invalid URL provided', { url: longUrl, position: i + 1 });
        continue;
      }

      const validityMinutes = validity ? parseInt(validity, 10) : 30;
      if (validity && (isNaN(validityMinutes) || validityMinutes <= 0)) {
        newErrors.push(`Invalid validity period at position ${i + 1}`);
        logger.error('Invalid validity period', { validity, position: i + 1 });
        continue;
      }

      if (shortCode && !/^[a-zA-Z0-9]{3,10}$/.test(shortCode)) {
        newErrors.push(`Invalid shortcode at position ${i + 1}. Must be alphanumeric, 3-10 characters.`);
        logger.error('Invalid shortcode', { shortCode, position: i + 1 });
        continue;
      }

      try {
        const finalShortCode = shortCode || generateShortCode();
        const result = await storeURL(longUrl, validityMinutes, finalShortCode);
        newResults.push(result);
        logger.info('URL shortened successfully', { longUrl, shortCode: finalShortCode });
      } catch (err) {
        newErrors.push(err.message);
        logger.error('Failed to shorten URL', { longUrl, error: err.message });
      }
    }

    setErrors(newErrors);
    setResults(newResults);
    if (newResults.length > 0) {
      onShorten(newResults);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.map((err, idx) => <div key={idx}>{err}</div>)}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        {urls.map((url, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <TextField
              fullWidth
              label="Long URL"
              value={url.longUrl}
              onChange={(e) => handleChange(index, 'longUrl', e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Validity (minutes)"
              type="number"
              value={url.validity}
              onChange={(e) => handleChange(index, 'validity', e.target.value)}
              margin="normal"
              placeholder="30"
            />
            <TextField
              fullWidth
              label="Custom Shortcode (optional)"
              value={url.shortCode}
              onChange={(e) => handleChange(index, 'shortCode', e.target.value)}
              margin="normal"
            />
          </Box>
        ))}
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handleAddUrl} disabled={urls.length >= 5}>
            Add Another URL
          </Button>
          <Button variant="contained" type="submit" sx={{ ml: 2 }}>
            Shorten URLs
          </Button>
        </Box>
      </form>
      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Shortened URLs</Typography>
          <List>
            {results.map((result, idx) => (
              <ListItem key={idx}>
                <ListItemText
                  primary={`Short URL: http://localhost:3000/${result.shortCode}`}
                  secondary={`Original: ${result.longUrl} | Expires: ${new Date(result.expiry).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default URLShortenerForm;