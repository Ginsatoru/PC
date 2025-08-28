import { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
    case "GOOGLE_LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
    case "GOOGLE_LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
    case "GOOGLE_LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case "LOAD_USER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case "UPDATE_USER":
      const updatedUser = action.payload;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return {
        ...state,
        user: updatedUser,
      };
    case "SET_LOADING":
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    console.log("Loading user from localStorage:", {
      token: token ? "exists" : "none",
      user: user ? "exists" : "none",
    });

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log("Parsed user from localStorage:", parsedUser);
        dispatch({
          type: "LOAD_USER",
          payload: {
            user: parsedUser,
            token: token,
          },
        });
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (credentials) => {
    try {
      console.log("AuthContext - Starting login for:", credentials.email);
      dispatch({ type: "LOGIN_START" });

      const response = await authAPI.login(credentials);
      console.log("AuthContext - Login API response:", response.data);

      if (!response.data.token || !response.data.user) {
        throw new Error("Invalid response structure from login API");
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: response.data });

      console.log("AuthContext - Login successful, user:", response.data.user);
      toast.success(`Welcome back, ${response.data.user.name}!`);

      return response.data;
    } catch (error) {
      console.error("AuthContext - Login error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log("AuthContext - Starting registration");
      dispatch({ type: "REGISTER_START" });

      const response = await authAPI.register(userData);
      console.log("AuthContext - Register API response:", response.data);

      if (!response.data.token || !response.data.user) {
        throw new Error("Invalid response structure from register API");
      }

      dispatch({ type: "REGISTER_SUCCESS", payload: response.data });

      console.log(
        "AuthContext - Registration successful, user:",
        response.data.user
      );
      toast.success(`Welcome, ${response.data.user.name}!`);

      return response.data;
    } catch (error) {
      console.error("AuthContext - Registration error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      dispatch({ type: "REGISTER_FAILURE", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // NEW: Google login method
  const googleLogin = async (googleToken) => {
    try {
      console.log("AuthContext - Starting Google login");
      dispatch({ type: "GOOGLE_LOGIN_START" });

      const response = await authAPI.googleLogin(googleToken);
      console.log("AuthContext - Google login API response:", response.data);

      if (!response.data.token || !response.data.user) {
        throw new Error("Invalid response structure from Google login API");
      }

      dispatch({ type: "GOOGLE_LOGIN_SUCCESS", payload: response.data });

      console.log(
        "AuthContext - Google login successful, user:",
        response.data.user
      );
      toast.success(`Welcome, ${response.data.user.name}!`);

      return response.data;
    } catch (error) {
      console.error("AuthContext - Google login error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Google login failed";
      dispatch({ type: "GOOGLE_LOGIN_FAILURE", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const setAuthData = (token, user) => {
    console.log("AuthContext - Setting auth data directly:", {
      user: user.name,
    });
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { token, user },
    });
  };

  const logout = () => {
    console.log("AuthContext - Logging out user");
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      dispatch({ type: "UPDATE_USER", payload: response.data });
      toast.success("Profile updated successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
      throw error;
    }
  };

  const updateUser = (updatedUserData) => {
    console.log("AuthContext - Updating user in context:", updatedUserData);
    dispatch({ type: "UPDATE_USER", payload: updatedUserData });
  };

  const isAdmin = () => {
    const result = state.user?.role === "admin";
    console.log("AuthContext - isAdmin check:", {
      user: state.user,
      isAdmin: result,
    });
    return result;
  };

  useEffect(() => {
    console.log("AuthContext - State changed:", {
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      loading: state.loading,
      error: state.error,
    });
  }, [state]);

  const value = {
    ...state,
    login,
    register,
    googleLogin, // NEW: Add googleLogin to context
    logout,
    updateProfile,
    updateUser,
    setAuthData,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
