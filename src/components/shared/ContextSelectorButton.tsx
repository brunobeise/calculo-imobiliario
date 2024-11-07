import { Divider, Sheet } from "@mui/joy";
import { ReactNode } from "react";

interface ContextSelectorButtonProps {
  title?: ReactNode;
  desc?: ReactNode;
  icon?: ReactNode;
  extra?: ReactNode;
  onClick?: () => void;
}

export default function ContextSelectorButton(
  props: ContextSelectorButtonProps
) {
  return (
    <>
      <Sheet
        onClick={props.onClick}
        className="w-full p-5 flex flex-col justify-center cursor-pointer hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className={props.extra ? "w-[45%]" : "w-[100%]"}>
            <div className="text-primary font-bold flex gap-2 items-center mb-1">
              <span className="text-md"> {props.icon && props.icon}</span>
              <h6
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {props.title}
              </h6>
            </div>
            <span className="text-grayText text-sm">{props.desc}</span>
          </div>
          {props.extra}
        </div>
      </Sheet>
      {props.extra && <Divider />}
    </>
  );
}
