import {
  Button,
  List,
  ListItem,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { FaBars, FaHome, FaUser, FaCalculator, FaFileAlt } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import Cookies from "js-cookie";
import logo from "@/assets/imobDeal.png";
import { useAuth } from "@/auth";
import { usePageContext } from "vike-react/usePageContext";
import ListDivider from "@mui/joy/ListDivider";
import { financingRoutes } from "@/routes/financing";
import { useMenu } from "./MenuContext";

export default function DrawerMenu({ isCaseMenu }: { isCaseMenu: boolean }) {
  const { isAuthenticated, user } = useAuth();
  const pageContext = usePageContext();

  const { backdropVisible, menuOpen, toggleMenu, toggleBackdrop } = useMenu();
  const [casesOpen, setCasesOpen] = useState(false);

  if (!isAuthenticated || pageContext.urlPathname.includes("proposta"))
    return null;

  return (
    <>
      {isCaseMenu && (
        <Button
          className="!absolute translate-x-[10px] translate-y-[10px] !bg-[#f0f0f0] !text-primary h-min"
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
        <List size="lg" >
          <a
            href={"/"}
            onClick={() => {
              toggleBackdrop(false);
              toggleMenu(false);
            }}
          >
            <ListItem
              className={`!ms-5  ${
                pageContext.urlPathname === "/" ? "!text-primary" : ""
              }`}
            >
              <ListItemDecorator>
                <FaHome />
              </ListItemDecorator>
              <Typography
                className={`font-bold !ms-[-10px] ${
                  pageContext.urlPathname === "/" ? "!text-primary" : ""
                }`}
              >
                Home
              </Typography>
            </ListItem>
          </a>
          <ListDivider />
          <a
            href={"/dashboard"}
            onClick={() => {
              toggleBackdrop(false);
              toggleMenu(false);
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

          <a href={"/estudos"} onClick={() => toggleBackdrop(false)}>
            <ListItem
              className={`!ms-5 ${
                pageContext.urlPathname === "/estudos" ? "!text-primary" : ""
              }`}
            >
              <ListItemDecorator>
                <FaFileAlt />
              </ListItemDecorator>
              <Typography
                className={`font-bold !ms-[-10px] ${
                  pageContext.urlPathname === "/estudos" ? "!text-primary" : ""
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

          <ListItem
            endAction={
              casesOpen ? (
                <FaAngleDown className="me-5" />
              ) : (
                <FaAngleRight className="me-5" />
              )
            }
            onClick={() => setCasesOpen(!casesOpen)}
            className="!ms-5 cursor-pointer"
          >
            <ListItemDecorator>
              <FaCalculator />
            </ListItemDecorator>
            <Typography className="font-bold !ms-[-10px]">Cenários</Typography>
          </ListItem>
          {casesOpen && (
            <List>
              {financingRoutes
                .filter((r) => !r.href.includes("/:id"))
                .map((i) => (
                  <a
                    onClick={() => {
                      toggleMenu(false);
                      toggleBackdrop(false);
                    }}
                    href={i.href}
                    key={i.href}
                  >
                    <ListItem
                      className={`cursor-pointer !px-6 ${
                        pageContext.urlPathname === i.href
                          ? "!text-primary"
                          : ""
                      }`}
                      nested
                      sx={{ my: 1 }}
                    >
                      <Typography className="font-bold !ms-[10px]">
                        {i.title}
                      </Typography>
                    </ListItem>
                  </a>
                ))}
            </List>
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
