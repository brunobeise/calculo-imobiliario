import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { financingRoutes } from "@/routes/financing";
import { auxiliarRoutes } from "@/routes/auxiliar";
import { relatorioRoutes } from "@/routes/reports";
import { useAuth } from "@/auth";

export default function Header() {
  const location = useLocation();

  const routes = [...financingRoutes, ...auxiliarRoutes, ...relatorioRoutes];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  const title = routes.find((r) => r.href === location.pathname)?.title;
  return (
    <div className="flex justify-between p-1">
      <div className="absolute left-[50%] translate-x-[-50%] sm:mt-0  mt-10 text-center ">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-primary">
          {title || ""}
        </h1>
      </div>
    </div>
  );
}
