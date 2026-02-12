
import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { User } from '../types';

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

  return { user, logout, setUser, loginAdmin, getUserById };
};

export default useAuth;