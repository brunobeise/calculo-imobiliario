import {
  Button,
  List,
  ListItem,
  ListItemDecorator,
  Skeleton,
  Typography,
  ListDivider,
} from "@mui/joy";
import { FaBars, FaFileAlt, FaBuilding } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { FaFileCirclePlus } from "react-icons/fa6";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { PiHandshakeBold } from "react-icons/pi";
import Cookies from "js-cookie";
import logo from "@/assets/imobDeal.png";
import { useAuth } from "@/auth";
import { usePageContext } from "vike-react/usePageContext";
import { useMenu } from "./MenuContext";
import { navigate } from "vike/client/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { GrMultiple } from "react-icons/gr";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: <BiSolidDashboard /> },
  { path: "/cenarios", label: "Nova Proposta", icon: <FaFileCirclePlus /> },

  { path: "/propostas", label: "Propostas", icon: <FaFileAlt /> },
  {
    path: "/portfolios",
    label: "Portfolios",
    icon: <GrMultiple />,
    isNew: true,
  },
  {
    path: "/imobiliaria",
    label: "Imobiliária",
    icon: <MdOutlineRealEstateAgent />,
    requiresOwner: true,
  },
  { path: "/imoveis", label: "Imóveis", icon: <FaBuilding /> },
  {
    path: "/onboarding",
    label: "Onboarding",
    icon: <PiHandshakeBold />,
    requiresAdmin: true,
  },
];

export default function DrawerMenu({ isCaseMenu }: { isCaseMenu: boolean }) {
  const { isAuthenticated, user } = useAuth();
  const userData = useSelector((state: RootState) => state.user.userData);
  const pageContext = usePageContext();
  const { backdropVisible, menuOpen, toggleMenu, toggleBackdrop } = useMenu();

  if (
    !isAuthenticated ||
    pageContext.urlPathname.includes("/proposta/") ||
    pageContext.urlPathname.includes("/portfolio/")
  )
    return null;

  return (
    <>
      {isCaseMenu && (
        <Button
          className="!absolute translate-x-[10px] translate-y-[10px] !bg-[#f0f0f0] !text-primary h-min z-[2]"
          onClick={() => {
            toggleMenu(true);
            toggleBackdrop(true);
          }}
        >
          <FaBars />
        </Button>
      )}

      {backdropVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-20"
          onClick={() => {
            toggleMenu(false);
            toggleBackdrop(false);
          }}
        ></div>
      )}

      <div
        className={`w-[210px] z-[100] fixed top-0 left-0 h-full bg-whitefull text-primary transform transition-transform ${
          menuOpen || !isCaseMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center my-4  flex-col">
          <img className="w-[50px]" src={logo} />
          <span className="text-primary">
            Imob<span className="font-bold">Deal</span>
          </span>
        </div>
        <div
          className="cursor-pointer hover:opacity-90"
          onClick={() => navigate("/usuario").then(() => toggleBackdrop(false))}
        >
          <ListItem
            className={`!ms-5 !h-10 !px-1 !my-3 !mb-5 flex items-center ${
              pageContext.urlPathname === "/usuario" ? "!text-primary" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
              {userData?.photo ? (
                <img
                  className="w-full h-full object-cover"
                  src={userData.photo}
                  alt="User"
                />
              ) : (
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              )}
            </div>
            <Typography className="!ms-3 !text-[0.96rem] flex-1">
              {userData?.fullName ? (
                <p
                  className={`font-bold ${
                    pageContext.urlPathname === "/usuario"
                      ? "!text-primary"
                      : "!text-black"
                  }`}
                >{`${userData.fullName.split(" ")[0]} ${
                  userData.fullName.split(" ").slice(-1)[0]
                }`}</p>
              ) : (
                <Skeleton variant="text" width={100} className="font-bold" />
              )}
              {userData?.role ? (
                <p
                  className={`text-xs ${
                    pageContext.urlPathname === "/usuario"
                      ? "!text-primary"
                      : "!text-black"
                  }`}
                >
                  {userData.role}
                </p>
              ) : (
                <Skeleton variant="text" width={80} className="text-sm" />
              )}
            </Typography>
          </ListItem>
        </div>
        <ListDivider />
        <List size="lg">
          {menuItems.map(
            ({ path, label, icon, requiresOwner, requiresAdmin }) => {
              if (
                (requiresOwner && !user?.owner) ||
                (requiresAdmin && !user?.admin)
              )
                return null;
              return (
                <div
                  key={path}
                  className={`cursor-pointer hover:opacity-90 border-b border-grayScale-200 py-1 ${
                    pageContext.urlPathname === path
                      ? "bg-[#f1f2f4]"
                      : "!text-grayScale-500"
                  }`}
                  onClick={() => {
                    toggleBackdrop(false);
                    navigate(path).then(() => {
                      if (isCaseMenu) {
                        toggleMenu(false);
                      }
                    });
                  }}
                >
                  <ListItem
                    className={`!ms-5 ${
                      pageContext.urlPathname === path
                        ? "!text-primary"
                        : "!text-grayScale-600"
                    }`}
                  >
                    <ListItemDecorator className="!text-[1rem]">
                      {icon}
                    </ListItemDecorator>
                    <Typography
                      level="h4"
                      className={`!font-bold !text-[1rem] !font-sans  !ms-[-15px] ${
                        pageContext.urlPathname === path
                          ? "!text-primary"
                          : "!text-grayScale-600"
                      }`}
                    >
                      {label}
                    </Typography>
                  </ListItem>
                </div>
              );
            }
          )}
        </List>
        <List size="lg" className="!absolute bottom-0">
          <ListItem
            onClick={() => {
              Cookies.remove("token");
              window.location.reload();
            }}
            className="!ms-5 cursor-pointer"
          >
            <ListItemDecorator>
              <RiLogoutBoxRLine />
            </ListItemDecorator>
            <Typography className="font-bold !ms-[-10px]">Sair</Typography>
          </ListItem>
        </List>
      </div>
    </>
  );
}
