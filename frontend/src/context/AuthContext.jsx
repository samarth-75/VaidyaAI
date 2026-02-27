import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const API_URL = 'http://localhost:5000/api/auth';

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Check if user is logged in on mount
    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    const response = await axios.get(`${API_URL}/me`);
                    if (response.data.success) {
                        setUser(response.data.user);
                    } else {
                        localStorage.removeItem('token');
                        setToken(null);
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, []);

    // Register function
    const register = async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                name,
                email,
                password
            });

            if (response.data.success) {
                const { token: newToken, user: newUser } = response.data;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(newUser);
                return { success: true, message: response.data.message };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });

            if (response.data.success) {
                const { token: newToken, user: newUser } = response.data;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(newUser);
                return { success: true, message: response.data.message };
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
           user,
           token,
           loading,
           register,
           login,
           logout,
           isAuthenticated: !!user,
           setUser,
           setToken
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
