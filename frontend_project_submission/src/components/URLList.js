import React from 'react';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { logger } from '../utils/Logger';

const URLList = ({ urls, onClick }) => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>Shortened URLs</Typography>
      <List>
        {urls.map((url, index) => (
          <ListItem
            key={index}
            button
            onClick={() => {
              logger.info('Short URL clicked', { shortCode: url.shortCode, longUrl: url.longUrl });
              onClick(url.shortCode);
            }}
          >
            <ListItemText
              primary={`http://localhost:3000/${url.shortCode}`}
              secondary={
                <>
                  Original: {url.longUrl}<br />
                  Created: {new Date(url.createdAt).toLocaleString()}<br />
                  Expires: {new Date(url.expiry).toLocaleString()}<br />
                  Clicks: {url.clicks.length}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default URLList;
