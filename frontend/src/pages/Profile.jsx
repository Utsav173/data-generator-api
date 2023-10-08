import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { API } from '../api';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('user-apiKey') || ''
  );
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: API.PROFILE,
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    };
    try {
      const response = await axios.request(config);
      setProfileData(response.data);
    } catch (error) {
      setError(error.response?.data?.message);
    }
  };
  return (
    <Container maxWidth="lg">
      <Box my={3}>
        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
            label="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            fullWidth
            required
            disabled={profileData}
            variant="outlined"
            color="success"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" type="submit" disabled={profileData}>
            Fetch Profile
          </Button>
        </form>
        {profileData && (
          <Box mt={2}>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Id</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Remaining Generations</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {profileData.id}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {profileData.email}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{
                        color:
                          profileData['remaining generations'] > 500
                            ? 'green'
                            : 'red',
                      }}
                    >
                      {profileData['remaining generations']}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
};

export default Profile;
