import { createContext, useContext, useState, ReactNode } from "react";
interface MenuContextType {
  isOpen: boolean;
  toggleMenu: () => void;
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
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <MenuContext.Provider value={{ isOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
}
