import React from "react";
import { Button, Tooltip } from "@mui/joy";


interface ButtonConfig {
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
  icon: React.ReactNode;
  href?: string;
  tooltip?: string;
  loading?: boolean;
}

interface FloatingButtonListProps {
  buttons: ButtonConfig[];
}

export default function FloatingButtonList({
  buttons,
}: FloatingButtonListProps) {
  return (
    <div className="fixed bottom-4 right-4 z-10 flex flex-col gap-4 mb-10 md:mb-0">
      {buttons.map((button, index) => (
        <div key={index}>
          {button.href ? (
            <a href={button.href} target="_blank">
              <Tooltip placement="left-start" title={button.tooltip || ""}>
                <Button
                  className="!rounded-full w-[40px] h-[40px]"
                  onClick={button.onClick}
                >
                  <span className="text-xl">{button.icon}</span>
                </Button>
              </Tooltip>
            </a>
          ) : (
            <Tooltip placement="left-start" title={button.tooltip || ""}>
              <Button
                loading={button.loading}
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
