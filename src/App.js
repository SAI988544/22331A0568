import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Alert } from '@mui/material';
import URLShortenerForm from './components/URLShortenerForm';
import StatisticsPage from './components/StatisticsPage';
import RedirectHandler from './components/RedirectHandler';
import { getURLs } from './utils/helpers';
import { logger } from './utils/Logger';
import './App.css';

const App = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urls = getURLs() || [];
    setUrls(urls);
    logger.info('Initialized app with stored URLs', { urlCount: urls.length });
  }, []);

  const handleShorten = () => {
    setUrls(getURLs() || []);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>URL Shortener</Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>
      <Container>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <Routes>
          <Route
            path="/"
            element={<URLShortenerForm onShorten={handleShorten} />}
          />
          <Route
            path="/stats"
            element={<StatisticsPage urls={urls} />}
          />
          <Route
            path="/:shortCode"
            element={<RedirectHandler />}
          />
          <Route
            path="/error"
            element={<Typography variant="h6" sx={{ mt: 4 }}>Error: Invalid or expired URL</Typography>}
          />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;