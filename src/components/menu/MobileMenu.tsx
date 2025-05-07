import { IconButton } from "@mui/joy";
import { FaFileAlt, FaBuilding } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { FaFileCirclePlus } from "react-icons/fa6";
import { GrMultiple } from "react-icons/gr";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { useAuth } from "@/auth";

const menuItems = [
  { path: "/dashboard", icon: <BiSolidDashboard />, requires: null },
  { path: "/cenarios", icon: <FaFileCirclePlus />, requires: null },
  { path: "/propostas", icon: <FaFileAlt />, requires: null },
  { path: "/portfolios", icon: <GrMultiple />, requires: null },
  { path: "/imoveis", icon: <FaBuilding />, requires: null },
];

export default function MobileBottomMenu() {
  const { isAuthenticated, user } = useAuth();
  const pageContext = usePageContext();

  if (
    !isAuthenticated ||
    pageContext.urlPathname.includes("/proposta/") ||
    pageContext.urlPathname.includes("/portfolio/")
  )
    return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex overflow-x-auto bg-white shadow-md py-1 z-[1100] justify-around md:hidden">
      {menuItems.map(({ path, icon, requires }) => {
        if (
          (requires === "owner" && !user?.owner) ||
          (requires === "admin" && !user?.admin)
        ) {
          return null;
        }
        const active = pageContext.urlPathname === path;
        return (
          <IconButton
            key={path}
            onClick={() => navigate(path)}
            sx={{ color: active ? "primary.main" : "text.secondary" }}
          >
            {icon}
          </IconButton>
        );
      })}
    </div>
  );
}
