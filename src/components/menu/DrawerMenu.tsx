import {
  Button,
  List,
  ListItem,
  ListItemDecorator,
  Skeleton,
  Typography,
} from "@mui/joy";

import { FaBars, FaFileAlt } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { FaFileCirclePlus } from "react-icons/fa6";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import Cookies from "js-cookie";
import logo from "@/assets/imobDeal.png";
import { useAuth } from "@/auth";
import { usePageContext } from "vike-react/usePageContext";
import ListDivider from "@mui/joy/ListDivider";
import { useMenu } from "./MenuContext";
import { FaBuilding } from "react-icons/fa";
import { navigate } from "vike/client/router";
import { PiHandshakeBold } from "react-icons/pi";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export default function DrawerMenu({ isCaseMenu }: { isCaseMenu: boolean }) {
  const { isAuthenticated, user } = useAuth();
  const userData = useSelector((state: RootState) => state.user.userData);
  const pageContext = usePageContext();

  const { backdropVisible, menuOpen, toggleMenu, toggleBackdrop } = useMenu();

  if (!isAuthenticated || pageContext.urlPathname.includes("/proposta/"))
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
        className={`w-64 z-[1000] fixed top-0 left-0 h-full bg-whitefull text-primary transform transition-transform ${
          menuOpen || !isCaseMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center my-6 mb-10 flex-col">
          <img className="w-[80px]" src={logo} />
          <span className="text-primary">
            Imob<span className="font-bold">Deal</span>
          </span>
        </div>
        <div
          className="cursor-pointer hover:opacity-90"
          onClick={() => {
            navigate("/usuario");
            toggleBackdrop(false);
          }}
        >
          <ListItem
            className={`!ms-5 !h-12 !px-2 !my-3 !mb-4 !flex items-center ${
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

            <Typography className="!ms-4 flex-1">
              {userData?.fullName ? (
                <p
                  className={`font-bold ${
                    pageContext.urlPathname === "/usuario"
                      ? "!text-primary"
                      : "!text-black"
                  }`}
                >
                  {`${userData.fullName.split(" ")[0]} ${
                    userData.fullName.split(" ").slice(-1)[0]
                  }`}
                </p>
              ) : (
                <Skeleton
                  variant="text"
                  width={100}
                  className={`font-bold ${
                    pageContext.urlPathname === "/usuario"
                      ? "!text-primary"
                      : "!text-black"
                  }`}
                />
              )}
              {userData?.role ? (
                <p
                  className={`text-sm ${
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
          <div
            className="cursor-pointer hover:opacity-90"
            onClick={() => {
              toggleMenu(false);
              toggleBackdrop(false);
              navigate("/cenarios");
            }}
          >
            <ListItem className="!ms-5 cursor-pointer">
              <ListItemDecorator>
                <FaFileCirclePlus />
              </ListItemDecorator>
              <Typography className="font-bold !ms-[-10px]">
                Nova Proposta
              </Typography>
            </ListItem>
          </div>
          <ListDivider />
          <div
            className="cursor-pointer hover:opacity-90"
            onClick={() => {
              navigate("/dashboard");
              toggleBackdrop(false);
            }}
          >
            <ListItem
              className={`!ms-5 ${
                pageContext.urlPathname === "/dashboard" ? "!text-primary" : ""
              }`}
            >
              <ListItemDecorator>
                <BiSolidDashboard />
              </ListItemDecorator>
              <Typography
                className={`font-bold !ms-[-10px] ${
                  pageContext.urlPathname === "/dashboard"
                    ? "!text-primary"
                    : ""
                }`}
              >
                Dashboard
              </Typography>
            </ListItem>
          </div>
          <ListDivider />
          <div
            className="cursor-pointer hover:opacity-90"
            onClick={() => {
              navigate("/propostas");
              toggleBackdrop(false);
            }}
          >
            <ListItem
              className={`!ms-5 ${
                pageContext.urlPathname === "/propostas" ? "!text-primary" : ""
              }`}
            >
              <ListItemDecorator>
                <FaFileAlt />
              </ListItemDecorator>
              <Typography
                className={`font-bold !ms-[-10px] ${
                  pageContext.urlPathname === "/propostas"
                    ? "!text-primary"
                    : ""
                }`}
              >
                Propostas
              </Typography>
            </ListItem>
          </div>
          {user?.owner && (
            <>
              <ListDivider />
              <div
                className="cursor-pointer hover:opacity-90"
                onClick={() => {
                  navigate("/imobiliaria");
                  toggleBackdrop(false);
                }}
              >
                <ListItem
                  className={`!ms-5 ${
                    pageContext.urlPathname === "/imobiliaria"
                      ? "!text-primary"
                      : ""
                  }`}
                >
                  <ListItemDecorator>
                    <MdOutlineRealEstateAgent />
                  </ListItemDecorator>
                  <Typography
                    className={`font-bold !ms-[-10px] ${
                      pageContext.urlPathname === "/imobiliaria"
                        ? "!text-primary"
                        : ""
                    }`}
                  >
                    Imobiliária
                  </Typography>
                </ListItem>
              </div>
            </>
          )}
          <ListDivider />
          <div
            className="cursor-pointer hover:opacity-90"
            onClick={() => {
              navigate("/imoveis");
              toggleBackdrop(false);
            }}
          >
            <ListItem
              className={`!ms-5 ${
                pageContext.urlPathname === "/imoveis" ? "!text-primary" : ""
              }`}
            >
              <ListItemDecorator>
                <FaBuilding />
              </ListItemDecorator>
              <Typography
                className={`font-bold !ms-[-10px] ${
                  pageContext.urlPathname === "/imoveis" ? "!text-primary" : ""
                }`}
              >
                Imóveis
              </Typography>
            </ListItem>
          </div>
          <ListDivider />
          {user.admin && (
            <>
              {" "}
              <div
                className="cursor-pointer hover:opacity-90"
                onClick={() => {
                  toggleMenu(false);
                  toggleBackdrop(false);
                  navigate("/onboarding");
                }}
              >
                <ListItem
                  className={`!ms-5 ${
                    pageContext.urlPathname === "/onboarding"
                      ? "!text-primary"
                      : ""
                  }`}
                >
                  <ListItemDecorator>
                    <PiHandshakeBold />
                  </ListItemDecorator>
                  <Typography
                    className={`font-bold !ms-[-10px] ${
                      pageContext.urlPathname === "/onboarding"
                        ? "!text-primary"
                        : ""
                    }`}
                  >
                    Onboarding
                  </Typography>
                </ListItem>
              </div>
              <ListDivider />
            </>
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
