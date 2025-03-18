declare module 'react-big-calendar';
declare module 'moment';
declare module '@/lib/supabaseClient';
declare module '@mui/material';
declare module '@mui/x-date-pickers/DateTimePicker';
declare module '@mui/x-date-pickers/AdapterMoment';
declare module '@mui/x-date-pickers/LocalizationProvider';
declare module '@mui/x-date-pickers/DatePicker';
declare module '@mui/x-date-pickers';
declare module '@mui/x-data-grid';
declare module '@mui/icons-material';
declare module 'react-quill';
declare module 'chart.js';
declare module 'react-chartjs-2';
declare module '@supabase/supabase-js';
declare module 'web-vitals';

// For environment variables in Create React App
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_SUPABASE_URL: string;
    REACT_APP_SUPABASE_ANON_KEY: string;
    [key: string]: string | undefined;
  }
} 