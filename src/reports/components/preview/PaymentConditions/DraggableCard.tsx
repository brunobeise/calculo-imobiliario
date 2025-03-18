import { ReactNode, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { usePageContext } from "vike-react/usePageContext";

const CARD_TYPE = "CARD";

export const DraggableCard: React.FC<{
  id: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  isResizing?: boolean;
  children: ReactNode;
}> = ({ id, index, moveCard, isResizing, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const pageContext = usePageContext();
  const isProposalRoute = pageContext.urlPathname.includes("/proposta/");

  const [, drop] = useDrop({
    accept: CARD_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: CARD_TYPE,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isProposalRoute && !isResizing,
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="cursor-grab active:cursor-grabbing"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isProposalRoute ? "default" : "grab",
        userSelect: "text",
      }}
    >
      {children}
    </div>
  );
};
