import React from 'react';
import { List, ListItem, ListItemText, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { logger } from '../utils/Logger';

const StatisticsPage = ({ urls }) => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>URL Statistics</Typography>
      <List>
        {urls.map((url, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Short URL: http://localhost:3000/${url.shortCode}`}
              secondary={
                <>
                  Original: {url.longUrl}<br />
                  Created: {new Date(url.createdAt).toLocaleString()}<br />
                  Expires: {new Date(url.expiry).toLocaleString()}<br />
                  Total Clicks: {url.clicks.length}
                </>
              }
            />
            {url.clicks.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Click Details</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {url.clicks.map((click, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{click.source}</TableCell>
                        <TableCell>{click.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default StatisticsPage;