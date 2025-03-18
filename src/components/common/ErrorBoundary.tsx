import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, render the default error UI
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            p: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph align="center">
              An error occurred while rendering this component. The application might not
              work as expected until you reload the page.
            </Typography>
            
            {this.state.error && (
              <Typography
                variant="body2"
                component="pre"
                sx={{
                  bgcolor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  width: '100%',
                  mb: 2,
                }}
              >
                {this.state.error.toString()}
              </Typography>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.href = '/'}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
              <Button 
                variant="text" 
                color="inherit" 
                onClick={this.handleReset}
              >
                Try Again
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 