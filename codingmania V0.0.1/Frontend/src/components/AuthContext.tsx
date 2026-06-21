

// import { createContext, useState, useContext, useEffect } from 'react';

// interface User {
//   name: string;
//   email: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   token: string | null;
//   login: (userData: User, token: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

//   // Load user and token from localStorage on refresh
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const storedToken = localStorage.getItem('token');

//     if (storedUser && storedToken) {
//       const parsedUser: User = JSON.parse(storedUser);
//       setUser(parsedUser);
//       setToken(storedToken);
//       setIsAuthenticated(true);
//       console.log("Auth restored from localStorage:", parsedUser, storedToken);
//     }
//   }, []);

//   // Save user and token to localStorage on login
//   useEffect(() => {
//     if (user && token) {
//       localStorage.setItem('user', JSON.stringify(user));
//       localStorage.setItem('token', token);
//       setIsAuthenticated(true);
//     } else {
//       localStorage.removeItem('user');
//       localStorage.removeItem('token');
//       setIsAuthenticated(false);
//     }
//   }, [user, token]);

//   const login = (userData: User, jwtToken: string) => {
//     setUser(userData);
//     setToken(jwtToken);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };








// import { createContext, useState, useContext, useEffect } from 'react';

// interface User {
//   name: string;
//   email: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   token: string | null;
//   login: (userData: User, token: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

//   // Load user and token from localStorage on app start
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const storedToken = localStorage.getItem('token');

//     if (storedUser && storedToken) {
//       try {
//         const parsedUser: User = JSON.parse(storedUser);
//         setUser(parsedUser);
//         setToken(storedToken);
//         setIsAuthenticated(true);
//         console.log("Auth restored from localStorage:", parsedUser, storedToken);
//       } catch (error) {
//         console.error("Error parsing stored user data:", error);
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//       }
//     }
//   }, []);

//   const login = (userData: User, jwtToken: string) => {
//     console.log("Login called with:", userData, jwtToken);
//     setUser(userData);
//     setToken(jwtToken);
//     setIsAuthenticated(true);
    
//     // Store in localStorage
//     localStorage.setItem('user', JSON.stringify(userData));
//     localStorage.setItem('token', jwtToken);
//   };

//   const logout = () => {
//     console.log("Logout called");
//     setUser(null);
//     setToken(null);
//     setIsAuthenticated(false);
    
//     // Remove from localStorage
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };












import { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  appliedRole?: string;
  applicationStatus?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isAuthInitialized: boolean;
  isUserProfileReady: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState<boolean>(false);
  const [isUserProfileReady, setIsUserProfileReady] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      setIsUserProfileReady(true);
    }

    setIsAuthInitialized(true);
  }, []);

  useEffect(() => {
    if (!isAuthInitialized) {
      return;
    }

    if (!isAuthenticated || !token || !user) {
      setIsUserProfileReady(true);
      return;
    }

    let isCancelled = false;

    const refreshUserProfile = async () => {
      setIsUserProfileReady(false);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const json = await response.json();
        const userData = json.data;

        if (!userData || isCancelled) {
          return;
        }

        const updatedUser = {
          ...user,
          id: userData.id,
          name: userData.name || user.name,
          email: userData.email || user.email,
          role: userData.role,
          appliedRole: userData.appliedRole,
          applicationStatus: userData.applicationStatus,
        };

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (err: any) {
        console.error('Failed to refresh user profile:', err);
      } finally {
        if (!isCancelled) {
          setIsUserProfileReady(true);
        }
      }
    };

    refreshUserProfile();

    return () => {
      isCancelled = true;
    };
  }, [isAuthInitialized, isAuthenticated, token]);

  const login = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    setIsAuthenticated(true);
    setIsUserProfileReady(false);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsUserProfileReady(true);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, token, isAuthInitialized, isUserProfileReady, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
