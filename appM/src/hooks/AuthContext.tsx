import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { API_CONFIG } from "../services/apiConfig";

// Set axios default base URL
axios.defaults.baseURL = API_CONFIG.BASE_URL;

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  biometricLogin: () => Promise<void>;
  guestLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Set axios default header
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error("Error loading stored auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/api/users/login`,
        {
          email,
          password,
        },
      );

      const { user: userData, token: newToken } = response.data;

      setUser(userData);
      setToken(newToken);

      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));

      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
  ) => {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/api/users/register`,
        {
          name,
          email,
          phone,
          password,
        },
      );

      const { user: userData, token: newToken } = response.data;

      setUser(userData);
      setToken(newToken);

      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));

      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);

    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);

    delete axios.defaults.headers.common["Authorization"];
  };

  const biometricLogin = async () => {
    // Demo biometric login - sets fake user for testing
    const demoUser: User = {
      id: "demo-id",
      name: "Demo User",
      email: "demo@example.com",
      phone: "123-456-7890",
      role: "user",
    };
    const demoToken = "demo-token";

    setUser(demoUser);
    setToken(demoToken);

    await SecureStore.setItemAsync(TOKEN_KEY, demoToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(demoUser));

    axios.defaults.headers.common["Authorization"] = `Bearer ${demoToken}`;
  };

  const guestLogin = async () => {
    // Guest login - sets guest user for browsing
    const guestUser: User = {
      id: "guest-id",
      name: "Guest User",
      email: "guest@example.com",
      phone: "",
      role: "guest",
    };
    const guestToken = "guest-token";

    setUser(guestUser);
    setToken(guestToken);

    await SecureStore.setItemAsync(TOKEN_KEY, guestToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(guestUser));

    axios.defaults.headers.common["Authorization"] = `Bearer ${guestToken}`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        biometricLogin,
        guestLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
