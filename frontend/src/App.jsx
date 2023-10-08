import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TextField } from '@mui/material';
import { API } from './api';

export default function App() {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const generateApiKey = async () => {
    try {
      const response = await axios.request({
        url: API.GET_API_KEY,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          email,
        },
      });
      const data = await response.data;
      setApiKey(data.apiKey);
      setCopied(false);
      setError(null); // Reset error state
    } catch (error) {
      console.error('Error generating API key:', error);
      setError(error.response?.data?.message); // Set error message
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate API Key
        </Typography>
        <TextField
          variant="outlined"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={generateApiKey}>
          Generate API Key
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}{' '}
        {/* Display error */}
        {apiKey && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Generated API Key:</Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {apiKey}
              </Typography>
              <IconButton
                color="primary"
                aria-label="Copy API Key"
                onClick={copyApiKey}
              >
                <FileCopyIcon />
              </IconButton>
            </Box>
            {copied && (
              <Typography variant="body2" color="success">
                Copied to clipboard!
              </Typography>
            )}
          </Box>
        )}
      </Box>
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="text"
          color="secondary"
          component={Link}
          to="/forgot-api-key"
        >
          Forgot API Key
        </Button>
        <Button
          variant="outlined"
          color="thirdary"
          component={Link}
          to="/generate-data"
        >
          Generate Data
        </Button>
        <Button
          variant="text"
          color="secondary"
          component={Link}
          to="/profile"
        >
          Profile
        </Button>
      </Box>
    </Container>
  );
}
