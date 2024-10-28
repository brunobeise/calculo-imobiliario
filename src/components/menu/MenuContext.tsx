import { createContext, useContext, useState, ReactNode } from "react";
interface MenuContextType {
  menuOpen: boolean;
  toggleMenu: (v: boolean) => void;
  backdropVisible: boolean;
  toggleBackdrop: (v: boolean) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu deve ser usado dentro de um MenuProvider");
  }
  return context;
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [backdropVisible, setBackdropVisible] = useState(false);

  const toggleMenu = (v: boolean) => setMenuOpen(v);
  const toggleBackdrop = (v: boolean) => setBackdropVisible(v);

  return (
    <MenuContext.Provider
      value={{ menuOpen, toggleMenu, backdropVisible, toggleBackdrop }}
    >
      {children}
    </MenuContext.Provider>
  );
}
