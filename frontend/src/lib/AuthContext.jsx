import { createContext, useContext, useState } from "react";
import { setTokenGetter } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  const saveToken = (t) => {
    setToken(t);
    setTokenGetter(() => t);
  };

  const logout = () => {
    setToken(null);
    setTokenGetter(() => null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken: saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
