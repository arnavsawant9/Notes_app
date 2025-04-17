// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(localStorage.getItem('token') || null);

//   useEffect(() => {
//     // Check if user is logged in
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setCurrentUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   // Add this useEffect to keep token in sync
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const storedToken = localStorage.getItem('token');
//       if (storedToken !== token) {
//         setToken(storedToken);
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [token]);

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/login', {
//         email, 
//         password
//       });
      
//       const data = response.data;
      
//       // Save token and user data
//       localStorage.setItem('token', data.token);
//       const userData = {
//         id: data.user_id,
//         name: data.name,
//         email: email,
//         verified: true
//       };
//       localStorage.setItem('user', JSON.stringify(userData));
      
//       setToken(data.token);
//       setCurrentUser(userData);
      
//       return data;
//     } catch (error) {
//       // Special handling for 403 unverified user error
//       if (error.response && 
//           error.response.status === 403 && 
//           error.response.data &&
//           error.response.data.verified === false) {
        
//         // Throw a specific error that can be caught by the login component
//         const customError = new Error('Account not verified');
//         customError.email = error.response.data.email;
//         customError.status = 403;
//         throw customError;
//       }
      
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const signup = async (name, email, password) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/signup', {
//         name,
//         email,
//         password
//       });
      
//       return {
//         success: true,
//         email: email
//       };
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     }
//   };

//   const verifyOtp = async (email, otp) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/verify-otp', {
//         email,
//         otp
//       });
      
//       // Handle automatic login after OTP verification
//       if (response.data.token) {
//         // Save token and user data
//         localStorage.setItem('token', response.data.token);
//         const userData = {
//           id: response.data.user_id,
//           name: response.data.name,
//           email: email,
//           verified: true
//         };
//         localStorage.setItem('user', JSON.stringify(userData));
        
//         // Update state
//         setToken(response.data.token);
//         setCurrentUser(userData);
//       }
      
//       return {
//         success: true,
//         message: response.data.message,
//         autoLogin: !!response.data.token
//       };
//     } catch (error) {
//       console.error('OTP verification error:', error);
//       throw error;
//     }
//   };

//   const resendOtp = async (email) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/resend-otp', {
//         email
//       });
      
//       return {
//         success: true,
//         message: response.data.message
//       };
//     } catch (error) {
//       console.error('Resend OTP error:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setToken(null);
//     setCurrentUser(null);
//   };

//   // Updated authFetch function with better error handling and proper method handling
//   const authFetch = async (url, options = {}) => {
//     const currentToken = localStorage.getItem('token');
    
//     if (!currentToken) {
//       console.error('No authentication token found in localStorage');
//       logout();
//       window.location.href = '/login';
//       throw new Error('No authentication token found');
//     }

//     try {
//       const config = {
//         url,
//         method: options.method || 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${currentToken}`,
//           ...(options.headers || {})
//         }
//       };
      
//       // Add data to the request if provided
//       if (options.data) {
//         config.data = options.data;
//       }
      
//       return await axios(config);
//     } catch (error) {
//       console.error('API request error:', error);
      
//       if (error.response) {
//         console.error('Response status:', error.response.status);
//         console.error('Response data:', error.response.data);
        
//         if (error.response.status === 401 || error.response.status === 403) {
//           console.error('Authentication error, redirecting to login');
//           logout();
//           window.location.href = '/login';
//         }
//       }
      
//       throw error;
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         currentUser,
//         setCurrentUser,
//         loading,
//         login,
//         signup,
//         verifyOtp,
//         resendOtp,
//         logout,
//         authFetch
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
























import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);


  useEffect(() => {
    const validateSession = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/verify-token', {
            headers: { Authorization: `Bearer ${token}` },
          });
          // If backend confirms token is valid, keep user
        } catch (err) {
          logout(); // If token is invalid or expired
        }
      }
      setLoading(false);
    };
  
    validateSession();
  }, []);
  

  // Add this useEffect to keep token in sync
  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken !== token) {
        setToken(storedToken);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email, 
        password
      });
      
      const data = response.data;
      
      // Save token and user data
      localStorage.setItem('token', data.token);
      const userData = {
        id: data.user_id,
        name: data.name,
        email: email,
        verified: true
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(data.token);
      setCurrentUser(userData);
      
      return data;
    } catch (error) {
      // Special handling for 403 unverified user error
      if (error.response && 
          error.response.status === 403 && 
          error.response.data &&
          error.response.data.verified === false) {
        
        // Throw a specific error that can be caught by the login component
        const customError = new Error('Account not verified');
        customError.email = error.response.data.email;
        customError.status = 403;
        throw customError;
      }
      
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        name,
        email,
        password
      });
      
      return {
        success: true,
        email: email
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', {
        email,
        otp
      });
      
      // Handle automatic login after OTP verification
      if (response.data.token) {
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        const userData = {
          id: response.data.user_id,
          name: response.data.name,
          email: email,
          verified: true
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        setToken(response.data.token);
        setCurrentUser(userData);
      }
      
      return {
        success: true,
        message: response.data.message,
        autoLogin: !!response.data.token
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const resendOtp = async (email) => {
    try {
      const response = await axios.post('http://localhost:5000/api/resend-otp', {
        email
      });
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
  };

  // Updated authFetch function with better error handling and proper method handling
  const authFetch = async (url, options = {}) => {
    const currentToken = localStorage.getItem('token');
    
    if (!currentToken) {
      console.error('No authentication token found in localStorage');
      logout();
      window.location.href = '/login';
      throw new Error('No authentication token found');
    }

    try {
      const config = {
        url,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
          ...(options.headers || {})
        }
      };
      
      // Add data to the request if provided
      if (options.data) {
        config.data = options.data;
      }
      
      return await axios(config);
    } catch (error) {
      console.error('API request error:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        if (error.response.status === 401 || error.response.status === 403) {
          console.error('Authentication error, redirecting to login');
          logout();
          window.location.href = '/login';
        }
      }
      
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
        authFetch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};