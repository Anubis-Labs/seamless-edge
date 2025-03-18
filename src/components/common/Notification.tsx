import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  open: boolean;
  message: string;
  type: NotificationType;
  duration?: number;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  type,
  duration = 6000,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={type}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification; 