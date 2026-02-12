
import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { User } from '../types';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
  phone: string;
}

// Internal type for storing user with password, not exposed to the app
interface StoredUser extends User {
  password_hash: string; // In a real app, this would be a proper hash
}

const ADMIN_CODE = '1234567';

const useAuth = () => {
  const [storedUsers, setStoredUsers] = useLocalStorage<StoredUser[]>('veramagrin-users', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('veramagrin-currentUser', null);
  
  // This is the reactive state for the current user session
  const [user, setUser] = useState<User | null>(currentUser);

  const login = useCallback(async (credentials: AuthCredentials): Promise<User | null> => {
    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const userToLogin = storedUsers.find(
      u => u && u.email && u.email.toLowerCase() === credentials.email.toLowerCase() && u.password_hash === credentials.password
    );

    if (userToLogin) {
      // Strip password before returning user object
      const { password_hash, ...userWithoutPassword } = userToLogin;
      setCurrentUser(userWithoutPassword);
      setUser(userWithoutPassword);
      return userWithoutPassword;
    }
    
    return null;
  }, [storedUsers, setCurrentUser]);

  const loginAdmin = useCallback(async (code: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (code === ADMIN_CODE) {
        const adminUser: User = {
            id: 'admin_user',
            name: 'Admin',
            email: '',
            phone: '',
            isAdmin: true,
        };
        setCurrentUser(adminUser);
        setUser(adminUser);
        return adminUser;
    }
    return null;
  }, [setCurrentUser]);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const isEmailTaken = storedUsers.some(u => u && u.email && u.email.toLowerCase() === credentials.email.toLowerCase());
    if (isEmailTaken) {
      // In a real app, you'd throw an error with a specific message
      return null;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: credentials.name,
      email: credentials.email,
      phone: credentials.phone,
    };
    
    const newStoredUser: StoredUser = {
      ...newUser,
      password_hash: credentials.password, // Storing plain text password for this mock
    };

    setStoredUsers(prev => [...prev, newStoredUser]);
    setCurrentUser(newUser);
    setUser(newUser);

    return newUser;
  }, [storedUsers, setStoredUsers, setCurrentUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUser(null);
  }, [setCurrentUser]);
  
  const getUserById = useCallback((userId: string): User | undefined => {
      const foundUser = storedUsers.find(u => u.id === userId);
      if (foundUser) {
          const { password_hash, ...userWithoutPassword } = foundUser;
          return userWithoutPassword;
      }
      return undefined;
  }, [storedUsers]);

  // Expose setUser to allow AppContext to modify the state directly if needed
  return { user, login, register, logout, setUser, loginAdmin, getUserById };
};

export default useAuth;
