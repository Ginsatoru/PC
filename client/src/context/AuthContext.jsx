import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      // Store token and user data properly
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user, // Store user object, not the whole payload
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case 'LOAD_USER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'UPDATE_USER':
      const updatedUser = action.payload;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return {
        ...state,
        user: updatedUser,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    console.log('Loading user from localStorage:', { token: token ? 'exists' : 'none', user: user ? 'exists' : 'none' }); // Debug log

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('Parsed user from localStorage:', parsedUser); // Debug log
        dispatch({ 
          type: 'LOAD_USER', 
          payload: { 
            user: parsedUser, 
            token: token 
          } 
        });
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials) => {
    try {
      console.log('AuthContext - Starting login for:', credentials.email); // Debug log
      dispatch({ type: 'LOGIN_START' });
      
      const response = await authAPI.login(credentials);
      console.log('AuthContext - Login API response:', response.data); // Debug log
      
      // Make sure we have the expected response structure
      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid response structure from login API');
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      
      console.log('AuthContext - Login successful, user:', response.data.user); // Debug log
      toast.success(`Welcome back, ${response.data.user.name}!`);
      
      return response.data;
    } catch (error) {
      console.error('AuthContext - Login error:', error); // Debug log
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('AuthContext - Starting registration'); // Debug log
      dispatch({ type: 'REGISTER_START' });
      
      const response = await authAPI.register(userData);
      console.log('AuthContext - Register API response:', response.data); // Debug log
      
      // Make sure we have the expected response structure
      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid response structure from register API');
      }
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
      
      console.log('AuthContext - Registration successful, user:', response.data.user); // Debug log
      toast.success(`Welcome, ${response.data.user.name}!`);
      
      return response.data;
    } catch (error) {
      console.error('AuthContext - Registration error:', error); // Debug log
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext - Logging out user'); // Debug log
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      dispatch({ type: 'UPDATE_USER', payload: response.data });
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed');
      throw error;
    }
  };

  const isAdmin = () => {
    const result = state.user?.role === 'admin';
    console.log('AuthContext - isAdmin check:', { user: state.user, isAdmin: result }); // Debug log
    return result;
  };

  // Debug the current state
  useEffect(() => {
    console.log('AuthContext - State changed:', {
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      loading: state.loading,
      error: state.error
    });
  }, [state]);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };