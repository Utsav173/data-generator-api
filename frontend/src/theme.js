import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#546de3',
      secondary: '#324599',
    },
    secondary: {
      main: '#12b3a4',
      secondary: '#10c27d',
    },
    thirdary: {
      main: '#525354',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
