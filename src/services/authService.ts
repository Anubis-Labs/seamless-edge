// Authentication service for handling admin login

// Mock admin credentials for development purposes
// In a production app, this would be handled on the server side
const MOCK_ADMIN = {
  id: '1',
  username: 'admin',
  password: 'seamlessedge2023', // This would never be stored in plain text in a real app
  name: 'Admin User'
};

// Local storage keys
const TOKEN_KEY = 'seamlessedge_admin_token';
const USER_KEY = 'seamlessedge_admin_user';

// Interface for user data
export interface User {
  id: string;
  username: string;
  name: string;
}

/**
 * Login with username and password
 */
const login = async (username: string, password: string): Promise<User | null> => {
  // In a real app, this would be an API call
  // For now, we'll simulate an API call with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === MOCK_ADMIN.username && password === MOCK_ADMIN.password) {
        // Create a simple token (this would be a JWT in a real app)
        const token = btoa(`${username}:${Date.now()}`);
        
        // User data without sensitive information
        const user: User = {
          id: MOCK_ADMIN.id,
          username: MOCK_ADMIN.username,
          name: MOCK_ADMIN.name
        };
        
        // Store in local storage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        
        resolve(user);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

/**
 * Logout the current user
 */
const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Get the current user from localStorage
 */
const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if the user is logged in
 */
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEY);
};

const authService = {
  login,
  logout,
  getCurrentUser,
  isAuthenticated
};

export default authService; 