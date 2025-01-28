import {
  Button,
  List,
  ListItem,
  ListItemDecorator,
  Typography,
} from "@mui/joy";

import { FaBars, FaUser, FaFileAlt } from "react-icons/fa";
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

export default function DrawerMenu({ isCaseMenu }: { isCaseMenu: boolean }) {
  const { isAuthenticated, user } = useAuth();
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
        <div className="flex items-center my-4 flex-col">
          <img className="w-[100px]" src={logo} />
          <span className="text-primary">
            Imob<span className="font-bold">Deal</span>
          </span>
        </div>
        <List size="lg">
          <a
            href={"/dashboard"}
            onClick={() => {
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
          </a>
          <ListDivider />

          <a href={"/usuario"} onClick={() => toggleBackdrop(false)}>
            <ListItem
              className={`!ms-5 ${
                pageContext.urlPathname === "/usuario" ? "!text-primary" : ""
              }`}
            >
              <ListItemDecorator>
                <FaUser />
              </ListItemDecorator>
              <Typography
                className={`font-bold !ms-[-10px] ${
                  pageContext.urlPathname === "/usuario" ? "!text-primary" : ""
                }`}
              >
                Meus dados
              </Typography>
            </ListItem>
          </a>
          <ListDivider />

          <a href={"/propostas"} onClick={() => toggleBackdrop(false)}>
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
          </a>

          {user?.owner && (
            <>
              <ListDivider />
              <a href={"/imobiliaria"} onClick={() => toggleBackdrop(false)}>
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
              </a>
            </>
          )}
          <ListDivider />

          <a
            href={"/imoveis"}
            onClick={() => {
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
          </a>
          <ListDivider />

          <a
            onClick={() => {
              toggleMenu(false);
              toggleBackdrop(false);
            }}
            href="/cenarios"
          >
            <ListItem className="!ms-5 cursor-pointer">
              <ListItemDecorator>
                <FaFileCirclePlus />
              </ListItemDecorator>
              <Typography className="font-bold !ms-[-10px]">
                Nova Proposta
              </Typography>
            </ListItem>
          </a>
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
