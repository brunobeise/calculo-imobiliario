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
import { useDispatch } from "react-redux";
import { fetchUserData } from "./store/userReducer";
import { AppDispatch } from "./store/store";
import { fetchRealEstateData } from "./store/realEstateReducer";
import Clarity from "@microsoft/clarity";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: {
    id: string;
    owner: boolean;
    admin: boolean;
    imobzi: boolean;
    jetimob: boolean;
    isAutonomous: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!Cookies.get("token");
  });

  const dispatch = useDispatch<AppDispatch>();

  const token = decodeToken();

  const [user, setUser] = useState<{
    id: string;
    owner: boolean;
    admin: boolean;
    imobzi: boolean;
    jetimob: boolean;
    isAutonomous: boolean;
  }>(() => {
    if (token) {
      return {
        id: token.userId,
        owner: Cookies.get("owner") === "true",
        admin: Cookies.get("admin") === "true",
        imobzi: Cookies.get("imobzi") === "true",
        jetimob: Cookies.get("jetimob") === "true",
        isAutonomous: Cookies.get("isAutonomous") === "true",
      };
    }
    return {
      id: "",
      owner: false,
      admin: false,
      imobzi: false,
      jetimob: false,
      isAutonomous: false,
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
        Cookies.set("isAutonomous", permissions.isAutonomous.toString());
        Cookies.set("imobzi", permissions.imobzi.toString());
        dispatch(fetchRealEstateData()).unwrap();
      }
      return permissions;
    } catch (error) {
      console.error("Erro ao obter permissões do usuário", error);
      return null;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getPermissions().then(async (permissions) => {
        if (permissions) {
          setUser(permissions);
          const userData = await dispatch(fetchUserData()).unwrap();
          Clarity.init(import.meta.env.PUBLIC_ENV__CLARITY_TAG);
          Clarity.setTag("userId", userData.fullName);
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
