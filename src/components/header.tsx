import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { forwardRef, useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "./ui/button";
import { financingRoutes } from "@/routes/financiamento";
import { auxiliarRoutes } from "@/routes/auxiliar";
import { relatorioRoutes } from "@/routes/relatorios";


export default function Header() {
  const location = useLocation();
  const routes = [...financingRoutes, ...auxiliarRoutes, ...relatorioRoutes];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const title = routes.find((r) => r.href === location.pathname)?.title;
  return (
    <div className="flex justify-between">
      <div className="flex">
        <Link to={"/"}>
          <Button variant="link" size="icon">
            <Home className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger onMouseEnter={() => {}}>
                Financiamento
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[500px] md:grid-cols-1 ">
                  {financingRoutes.map((component) => (
                    <Link
                      className="pg-primary"
                      key={component.title}
                      to={component.href}
                    >
                      <ListItem title={component.title}>
                        {component.description}
                      </ListItem>
                    </Link>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger onMouseEnter={() => {}}>
                Auxiliares
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[500px] md:grid-cols-1 ">
                  {auxiliarRoutes.map((component) => (
                    <Link
                      className="pg-primary"
                      key={component.title}
                      to={component.href}
                    >
                      <ListItem title={component.title}>
                        {component.description}
                      </ListItem>
                    </Link>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="absolute left-[50%] translate-x-[-50%] sm:mt-0  mt-10 text-center ">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-primary">
          {title || ""}
        </h1>
      </div>

      {/* <ModeToggle /> */}
    </div>
  );
}

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
