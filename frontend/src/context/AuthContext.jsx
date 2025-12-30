import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser, getToken, setUser, setToken, removeUser, removeToken } from '../services/api';

const AuthContext = createContext(null);

// 개발 환경 자동 관리자 계정
const DEV_ADMIN_USER = {
  id: 'dev-admin-001',
  email: 'admin@ottshare.com',
  nickname: '관리자',
  role: 'admin',
  profileImage: null,
  createdAt: new Date().toISOString()
};

const DEV_ADMIN_TOKEN = 'dev-admin-token-for-local-development';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 개발 환경(localhost)인 경우 자동으로 관리자로 로그인
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      // 개발 환경: 자동 관리자 로그인
      setToken(DEV_ADMIN_TOKEN);
      setUser(DEV_ADMIN_USER);
      setUserState(DEV_ADMIN_USER);
      setLoading(false);
      console.log('🔧 개발 환경: 자동 관리자 로그인 활성화');
      return;
    }
    
    // 프로덕션 환경: 기존 로직 유지
    const savedUser = getUser();
    const token = getToken();
    
    if (savedUser && token) {
      setUserState(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setToken(token);
    setUser(userData);
    setUserState(userData);
  };

  const logout = () => {
    removeToken();
    removeUser();
    setUserState(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    setUserState(userData);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated, 
      isAdmin,
      login, 
      logout,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

