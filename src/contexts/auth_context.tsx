import {
  useEffect,
  useMemo,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import { isExpired } from "react-jwt";
import {
  loginUser,
  registerUser,
  logoutUser,
  LoginData,
  RegisterData,
} from "../api/auth";
import { resetApp, loadApp } from "../lib/store";
import { User } from "../lib/types";

interface AuthContextInterface {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  login: (data: LoginData) => void;
  register: (data: RegisterData) => void;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

interface Props {
  children: ReactNode;
}
function AuthProvider({ children }: Props) {
  const [user, setUser] = useLocalStorage<User | null>("user", null);

  const logout = () => {
    logoutUser();
    setUser(null);

    // Clear stored user data
    resetApp();
  };

  // Logout when token expires
  useEffect(() => {
    if (user && isExpired(user.token)) logout();
  }, [user?.token]);

  const login = async (data: LoginData) => {
    const res = await loginUser(data);
    setUser(res);
    loadApp();
  };

  const register = async (data: RegisterData) => {
    const res = await registerUser(data);
    setUser(res);
    loadApp();
  };

  const providerValue = useMemo(
    () => ({
      user,
      setUser,
      logout,
      login,
      register,
    }),
    [user, setUser, logout, login, register]
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext) as AuthContextInterface;
}

export default AuthProvider;
