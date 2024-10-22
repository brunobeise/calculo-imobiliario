import {
  Button,
  List,
  ListItem,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { FaBars, FaBook, FaHome, FaUser } from "react-icons/fa";
import logo from "@/assets/CÁLCULO-IMOBILIÁRIO.png";
import ListDivider from "@mui/joy/ListDivider";
import { FaCalculator } from "react-icons/fa";
import { financingRoutes } from "@/routes/financing";
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from "@/auth";
import Cookies from "js-cookie";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { usePageContext } from "vike-react/usePageContext";

export default function DrawerMenu() {
  const { isAuthenticated } = useAuth();
  const location = usePageContext().urlPathname;

  const [open, setOpen] = useState(false);
  const [casesOpen, setCasesOpen] = useState(false);

  const { user } = useAuth();

  if (!isAuthenticated) return null;
  if (location.includes("proposta")) return null;

  return (
    <>
      <Button
        className="translate-x-[10px] !bg-[#f0f0f0] !text-primary"
        onClick={() => setOpen(!open)}
      >
        <FaBars />
      </Button>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-20 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      ></div>

      <div
        className={`z-[1000] fixed top-0 left-0 h-full w-64 bg-white text-white transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full flex justify-center mt-5 mb-5">
          <img className="w-[100px]" src={logo} />
        </div>
        <List size="lg">
          <a href={"/"} onClick={() => setOpen(false)}>
            <ListItem className="!ms-5">
              <ListItemDecorator>
                <FaHome />
              </ListItemDecorator>
              <Typography className="font-bold !ms-[-10px]">Home</Typography>
            </ListItem>
          </a>
          <ListDivider />
          <a href={"/usuario"} onClick={() => setOpen(false)}>
            <ListItem className="!ms-5">
              <ListItemDecorator>
                <FaUser />
              </ListItemDecorator>
              <Typography className="font-bold !ms-[-10px]">
                Meus dados
              </Typography>
            </ListItem>
            <ListDivider />
            <a href={"/estudos"} onClick={() => setOpen(false)}>
              <ListItem className="!ms-5">
                <ListItemDecorator>
                  <FaBook />
                </ListItemDecorator>
                <Typography className="font-bold !ms-[-10px]">
                  Meus estudos
                </Typography>
              </ListItem>
            </a>
          </a>

          {user?.owner && (
            <>
              <ListDivider />
              <a href={"/imobiliaria"} onClick={() => setOpen(false)}>
                <ListItem className="!ms-5">
                  <ListItemDecorator>
                    <MdOutlineRealEstateAgent />
                  </ListItemDecorator>
                  <Typography className="font-bold !ms-[-10px]">
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
            <Typography className="font-bold !ms-[-10px]">Cases</Typography>
          </ListItem>
          {casesOpen && (
            <List>
              {financingRoutes
                .filter((r) => !r.href.includes("/:id"))
                .map((i) => (
                  <>
                    <a onClick={() => setOpen(false)} href={i.href}>
                      <ListItem
                        onClick={() => setCasesOpen(!casesOpen)}
                        className="cursor-pointer !px-6"
                        nested
                        sx={{ my: 1 }}
                      >
                        <Typography className="font-bold !ms-[10px]">
                          {i.title}
                        </Typography>
                      </ListItem>
                    </a>
                    <ListDivider />
                  </>
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
