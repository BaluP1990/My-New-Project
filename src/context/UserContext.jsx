import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
   
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      if (username === 'admin' && password === 'admin@123') {
        const newUser = { role: 'admin' };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser)); 
        resolve();
      } else if (username === 'user' && password === 'user@123') {
        const newUser = { role: 'user' };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser)); 
        resolve();
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
