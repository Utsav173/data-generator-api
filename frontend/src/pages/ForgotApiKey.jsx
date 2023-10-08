import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import axios from 'axios';
import { TextField } from '@mui/material';
import { API } from '../api';

/**
 * React component that allows users to request a forgotten API key by providing their email address.
 * @returns {JSX.Element} The ForgotApiKey component.
 */
export default function ForgotApiKey() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  /**
   * Handles the form submission.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API.FORGOT_API_KEY, {
        email: email,
      });

      setSuccess(true);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Forgot API Key
        </Typography>
        {success ? (
          <Typography variant="body1" color="success">
            An email with your API key has been sent.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </Container>
  );
}
