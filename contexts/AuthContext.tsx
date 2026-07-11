import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { StorageKeys } from '../constants/storageKeys';
import { loginUser } from '../services/api';

export interface AuthUser {
  id: number | string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
}

interface RegisteredUser extends AuthUser {
  password: string;
}

export interface RegisterInput {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isHydrating: boolean;
  isSubmitting: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function readRegisteredUsers(): Promise<RegisteredUser[]> {
  const raw = await AsyncStorage.getItem(StorageKeys.registeredUsers);
  return raw ? (JSON.parse(raw) as RegisteredUser[]) : [];
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(StorageKeys.authUser);
        if (raw) setUser(JSON.parse(raw) as AuthUser);
      } finally {
        setIsHydrating(false);
      }
    })();
  }, []);

  const login = async (username: string, password: string) => {
    setIsSubmitting(true);
    try {
      // DummyJSON only recognizes its seeded accounts (e.g. fitrikhodijah/fitri123).
      // We try the real API first, then fall back to accounts created locally
      // via Register, since DummyJSON has no persistent create-user endpoint.
      try {
        const response = await loginUser({ username, password });
        const authUser: AuthUser = {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          image: response.image,
          accessToken: response.accessToken,
        };
        await AsyncStorage.setItem(StorageKeys.authUser, JSON.stringify(authUser));
        setUser(authUser);
        return;
      } catch (apiError) {
        const registeredUsers = await readRegisteredUsers();
        const match = registeredUsers.find(
          (candidate) => candidate.username === username && candidate.password === password,
        );
        if (!match) {
          throw apiError instanceof Error ? apiError : new Error('Username atau password salah');
        }
        const { password: _password, ...authUser } = match;
        await AsyncStorage.setItem(StorageKeys.authUser, JSON.stringify(authUser));
        setUser(authUser);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (input: RegisterInput) => {
    setIsSubmitting(true);
    try {
      const registeredUsers = await readRegisteredUsers();
      const isDuplicate = registeredUsers.some((candidate) => candidate.username === input.username);
      if (isDuplicate) {
        throw new Error('Username sudah terdaftar');
      }

      const [firstName, ...rest] = input.name.trim().split(' ');
      const newUser: RegisteredUser = {
        id: `local-${Date.now()}`,
        username: input.username,
        email: input.email,
        firstName: firstName || input.name,
        lastName: rest.join(' '),
        image: `https://api.dicebear.com/7.x/thumbs/png?seed=${encodeURIComponent(input.username)}`,
        accessToken: 'local-session',
        password: input.password,
      };

      await AsyncStorage.setItem(
        StorageKeys.registeredUsers,
        JSON.stringify([...registeredUsers, newUser]),
      );

      const { password: _password, ...authUser } = newUser;
      await AsyncStorage.setItem(StorageKeys.authUser, JSON.stringify(authUser));
      setUser(authUser);
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(StorageKeys.authUser);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isHydrating, isSubmitting, login, register, logout }),
    [user, isHydrating, isSubmitting],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
