import { useState, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button, List, ListItem, FormLabel, Input } from "@mui/joy";
import { ListItemText } from "@mui/material";
import { FaPlus, FaTrash } from "react-icons/fa";

interface ItemListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}

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
  const [, ref] = useDrag({
    type: "ITEM",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "ITEM",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <ListItem
      ref={(node) => ref(drop(node))}
      className="flex items-center border-b border-border cursor-grab"
    >
      <ListItemText primary={item} />
      <FaTrash
        className="cursor-pointer hover:opacity-90 ml-auto"
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
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const updatedItems = [...items];
      const [removed] = updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, removed);
      onChange(updatedItems);
    },
    [items, onChange]
  );

  return (
    <div className="rounded">
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center mt-2 gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Adicionar item"
          variant="outlined"
        />
        <Button size="sm" onClick={handleAddItem} className="ms-2">
          <FaPlus />
        </Button>
      </div>
      <List>
        {items.map((item, index) => (
          <DraggableItem
            key={index}
            item={item}
            index={index}
            moveItem={moveItem}
            handleDelete={handleDeleteItem}
          />
        ))}
      </List>
    </div>
  );
}
