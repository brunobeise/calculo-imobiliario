import Cookies from "js-cookie";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { userService } from "./service/userService";
import { decodeToken } from "./lib/jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: {
    id: string;
    owner: boolean;
    admin: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!Cookies.get("token");
  });

  const token = decodeToken();

  const [user, setUser] = useState<{
    id: string;
    owner: boolean;
    admin: boolean;
  }>(() => {
    if (token) {
      return {
        id: token.userId,
        owner: Cookies.get("owner") === "true",
        admin: Cookies.get("admin") === "true",
      };
    }
    return {
      id: "",
      owner: false,
      admin: false,
    };
  });

  const login = async (token: string) => {
    Cookies.set("token", token);
    setIsAuthenticated(true);

    await getPermissions();
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
  };

  const getPermissions = async () => {
    try {
      const permissions = await userService.getUserPermissions();
      if (permissions) {
        setUser(permissions);
        Cookies.set("owner", permissions.owner.toString());
        Cookies.set("admin", permissions.admin.toString());
      }
      return permissions;
    } catch (error) {
      console.error("Erro ao obter permissões do usuário", error);
      return null;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getPermissions().then((permissions) => {
        if (permissions) {
          setUser(permissions);
        }
      });
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
