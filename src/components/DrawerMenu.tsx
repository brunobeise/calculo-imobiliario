import {
  Button,
  List,
  ListItem,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { FaBars, FaHome, FaUser } from "react-icons/fa";
import logo from "@/assets/CÁLCULO-IMOBILIÁRIO.png";
import { Link } from "react-router-dom";
import ListDivider from "@mui/joy/ListDivider";
import { FaCalculator } from "react-icons/fa";
import { financingRoutes } from "@/routes/financing";
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from "@/auth";

export default function DrawerMenu() {
  const { isAuthenticated } = useAuth();

  const [open, setOpen] = useState(false);
  const [casesOpen, setCasesOpen] = useState(false);

  if (!isAuthenticated) return null;

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
          <Link to={"/"} onClick={() => setOpen(false)}>
            <ListItem className="!ms-5">
              <ListItemDecorator>
                <FaHome />
              </ListItemDecorator>
              <Typography className="font-bold !ms-[-10px]">Home</Typography>
            </ListItem>
          </Link>
          <ListDivider />
          <Link to={"/user"} onClick={() => setOpen(false)}>
            <ListItem className="!ms-5">
              <ListItemDecorator>
                <FaUser />
              </ListItemDecorator>
              <Typography className="font-bold !ms-[-10px]">
                Meus dados
              </Typography>
            </ListItem>
          </Link>
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
              {financingRoutes.map((i) => (
                <>
                  <Link onClick={() => setOpen(false)} to={i.href}>
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
                  </Link>
                  <ListDivider />
                </>
              ))}
            </List>
          )}
        </List>
        <List size="lg" className="!absolute bottom-0">
          <ListItem
            onClick={() => {
              localStorage.removeItem("token");
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
