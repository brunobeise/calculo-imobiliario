import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { financingRoutes } from "@/routes/financing";
import { auxiliarRoutes } from "@/routes/auxiliar";
import { useAuth } from "@/auth";

export default function Header() {
  const location = useLocation();

  const routes = [...financingRoutes, ...auxiliarRoutes];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  if (location.pathname.includes("proposta")) return null;

  const title = routes.find((r) => location.pathname.startsWith(r.href))?.title;

  return (
    <div className="flex justify-between p-1 mt-2">
      <div className="absolute left-[50%] translate-x-[-50%] sm:mt-0  mt-10 text-center ">
        <h1 className="scroll-m-20 text-3xl font-extrabold font-bold">
          {title || ""}
        </h1>
      </div>
    </div>
  );
}
