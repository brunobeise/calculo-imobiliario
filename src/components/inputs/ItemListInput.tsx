import { useState } from "react";
import {
  Button,
  List,
  ListItem,
  FormLabel,
  Input,
} from "@mui/joy";
import { ListItemText } from "@mui/material";
import { FaPlus, FaTrash } from "react-icons/fa";

interface ItemListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}

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

  return (
    <div className="p-3 rounded ms-4">
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center mt-2 gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Adicionar item"
          variant="outlined"
        />
        <Button size="sm" onClick={handleAddItem} className="ms-2">
          <FaPlus/>
        </Button>
      </div>
      <List>
        {items.map((item, index) => (
          <ListItem key={index} className="flex items-center">
            <ListItemText primary={item} />
            <FaTrash className="cursor-pointer" onClick={() => handleDeleteItem(index)}></FaTrash>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
