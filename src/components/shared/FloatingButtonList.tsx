import React from "react";
import { Button, Tooltip } from "@mui/joy";
import { Link } from "react-router-dom";

interface ButtonConfig {
  onClick?: () => void;
  icon: React.ReactNode;
  href?: string;
  tooltip?: string;
}

interface FloatingButtonListProps {
  buttons: ButtonConfig[];
}

export default function FloatingButtonList({
  buttons,
}: FloatingButtonListProps) {
  return (
    <div className="fixed bottom-4 right-4 z-10 flex flex-col gap-4">
      {buttons.map((button, index) => (
        <div key={index}>
          {button.href ? (
            <Link to={button.href}>
              <Tooltip placement="left-start" title={button.tooltip || ""}>
                <Button
                  className="!rounded-full w-[40px] h-[40px]"
                  onClick={button.onClick}
                >
                  <span className="text-xl">{button.icon}</span>
                </Button>
              </Tooltip>
            </Link>
          ) : (
            <Tooltip placement="left-start" title={button.tooltip || ""}>
              <Button
                className="!rounded-full w-[40px] h-[40px]"
                onClick={button.onClick}
              >
                <span className="text-xl">{button.icon}</span>
              </Button>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
}
