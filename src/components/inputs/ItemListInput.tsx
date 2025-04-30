import { useState, useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button, List, ListItem, FormLabel, Input } from "@mui/joy";
import { FaPlus, FaTrash } from "react-icons/fa";
import type { Identifier, XYCoord } from "dnd-core";

interface ItemListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}

interface DragItem {
  index: number;
  type: string;
}

const ItemTypes = {
  ITEM: "ITEM",
};

interface DraggableItemProps {
  item: string;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  handleDelete: (index: number) => void;
}

const DraggableItem = ({
  item,
  index,
  moveItem,
  handleDelete,
}: DraggableItemProps) => {
  const ref = useRef<HTMLLIElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.ITEM,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover(draggedItem, monitor) {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { index, type: ItemTypes.ITEM },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <ListItem
      ref={ref}
      data-handler-id={handlerId}
      className="flex items-center border-b border-border cursor-grab !text-grayText !py-2"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span className="flex-1 truncate">{item}</span>
      <FaTrash
        className="text-grayScale-500 cursor-pointer hover:opacity-90 ml-4"
        onClick={() => handleDelete(index)}
      />
    </ListItem>
  );
};

export default function ItemListInput({
  label,
  items,
  onChange,
}: ItemListInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddItem = () => {
    if (inputValue.trim() !== "") {
      onChange([...items, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange(updatedItems);
  };

  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const updated = [...items];
      const [removed] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, removed);
      onChange(updated);
    },
    [items, onChange]
  );

  const renderItem = useCallback(
    (item: string, index: number) => (
      <DraggableItem
        key={index}
        item={item}
        index={index}
        moveItem={moveItem}
        handleDelete={handleDeleteItem}
      />
    ),
    [moveItem]
  );

  return (
    <div className="flex flex-col gap-2">
      <FormLabel>{label}</FormLabel>

      <div className="flex items-center gap-2 mt-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Adicionar item"
          variant="outlined"
        />
        <Button size="sm" onClick={handleAddItem}>
          <FaPlus />
        </Button>
      </div>

      {items.length > 0 && (
        <List>{items.map((item, index) => renderItem(item, index))}</List>
      )}
    </div>
  );
}
