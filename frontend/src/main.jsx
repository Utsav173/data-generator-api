import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ForgotApiKey from './pages/ForgotApiKey';
import GenerateData from './pages/GenerateData';
import Profile from './pages/Profile';
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
import { SnackbarProvider } from 'notistack';
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App />
      </ThemeProvider>
    ),
    errorElement: <div>error</div>,
  },
  {
    path: 'about',
    element: <div>about</div>,
  },
  {
    path: 'forgot-api-key',
    element: <ForgotApiKey />,
  },
  {
    path: 'generate-data',
    element: <GenerateData />,
  },
  {
    path: 'profile',
    element: <Profile />,
  },
]);
root.render(
  <React.StrictMode>
      <SnackbarProvider maxSnack={3}>

    <RouterProvider router={router} />
    </SnackbarProvider>
  </React.StrictMode>
);
