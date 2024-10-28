import {
  Button,
  List,
  ListItem,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { FaBars, FaBook, FaHome, FaUser, FaCalculator } from "react-icons/fa";
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import Cookies from "js-cookie";
import logo from "@/assets/imobDeal.png";
import { useAuth } from "@/auth";
import { usePageContext } from "vike-react/usePageContext";
import ListDivider from "@mui/joy/ListDivider";
import { financingRoutes } from "@/routes/financing";

export default function DrawerMenu({ isCaseMenu }: { isCaseMenu: boolean }) {
  const { isAuthenticated, user } = useAuth();
  const pageContext = usePageContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [backdropVisible, setBackdropVisible] = useState(false);
  const [casesOpen, setCasesOpen] = useState(false);

  if (!isAuthenticated || pageContext.urlPathname.includes("proposta"))
    return null;

  return (
    <>
      {isCaseMenu && (
        <Button
          className="!absolute translate-x-[10px] translate-y-[10px] !bg-[#f0f0f0] !text-primary h-min"
          onClick={() => {
            setMenuOpen(true);
            setBackdropVisible(true); // Exibe o backdrop ao abrir o menu
          }}
        >
          <FaBars />
        </Button>
      )}

      {/* Overlay para o backdrop */}
      {backdropVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-20"
          onClick={() => {
            setMenuOpen(false);
            setBackdropVisible(false);
          }}
        ></div>
      )}

      {/* Menu principal */}
      <div
        className={`w-64 z-[1000] fixed top-0 left-0 h-full bg-white text-primary transform transition-transform ${
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
          {/* Home */}
          <a
            href={"/"}
            onClick={() => {
              setBackdropVisible(false);
              setMenuOpen(false);
            }}
          >
            <ListItem
              className={`!ms-5 ${
                pageContext.urlPathname === "/" ? "!text-grayText" : ""
              }`}
            >
              <ListItemDecorator>
                <FaHome />
              </ListItemDecorator>
              <Typography
                className={`font-bold !ms-[-10px] ${
                  pageContext.urlPathname === "/" ? "!text-grayText" : ""
                }`}
              >
                Home
              </Typography>
            </ListItem>
          </a>
          <ListDivider />

          {/* Meus Dados */}
          <a href={"/usuario"} onClick={() => setBackdropVisible(false)}>
            <ListItem
              className={`!ms-5 ${
                pageContext.urlPathname === "/usuario" ? "!text-grayText" : ""
              }`}
            >
              <ListItemDecorator>
                <FaUser />
              </ListItemDecorator>
              <Typography
                className={`font-bold !ms-[-10px] ${
                  pageContext.urlPathname === "/usuario" ? "!text-grayText" : ""
                }`}
              >
                Meus dados
              </Typography>
            </ListItem>
          </a>
          <ListDivider />

          {/* Meus Estudos */}
          <a href={"/estudos"} onClick={() => setBackdropVisible(false)}>
            <ListItem
              className={`!ms-5 ${
                pageContext.urlPathname === "/estudos" ? "!text-grayText" : ""
              }`}
            >
              <ListItemDecorator>
                <FaBook />
              </ListItemDecorator>
              <Typography
                className={`font-bold !ms-[-10px] ${
                  pageContext.urlPathname === "/estudos" ? "!text-grayText" : ""
                }`}
              >
                Meus estudos
              </Typography>
            </ListItem>
          </a>

          {/* Imobiliária */}
          {user?.owner && (
            <>
              <ListDivider />
              <a
                href={"/imobiliaria"}
                onClick={() => setBackdropVisible(false)}
              >
                <ListItem
                  className={`!ms-5 ${
                    pageContext.urlPathname === "/imobiliaria"
                      ? "!text-grayText"
                      : ""
                  }`}
                >
                  <ListItemDecorator>
                    <MdOutlineRealEstateAgent />
                  </ListItemDecorator>
                  <Typography
                    className={`font-bold !ms-[-10px] ${
                      pageContext.urlPathname === "/imobiliaria"
                        ? "!text-grayText"
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

          {/* Cases */}
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
            <Typography className="font-bold !ms-[-10px]">Cases</Typography>
          </ListItem>
          {casesOpen && (
            <List>
              {financingRoutes
                .filter((r) => !r.href.includes("/:id"))
                .map((i) => (
                  <a
                    onClick={() => {
                      setMenuOpen(false);
                      setBackdropVisible(false);
                    }}
                    href={i.href}
                    key={i.href}
                  >
                    <ListItem
                      className={`cursor-pointer !px-6 ${
                        pageContext.urlPathname === i.href
                          ? "!text-grayText"
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
        {/* Botão de logout */}
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
