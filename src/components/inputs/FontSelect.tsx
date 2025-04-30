import { IconButton, Menu, MenuItem, FormHelperText } from "@mui/joy";
import { Control, Controller, FieldError } from "react-hook-form";
import { FaFont } from "react-icons/fa";
import { useState } from "react";

const fontOptions = [
  "Poppins",
  "Roboto",
  "Montserrat",
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Raleway",
  "Libre Baskerville",
  "Bebas Neue",
  "Great Vibes",
  "DM Serif Display",
  "Cinzel",
  "Cormorant Garamond",
  "Abril Fatface",
  "Bodoni Moda",
  "Oswald",
  "Dancing Script",
  "Allura",
  "Pacifico",
  "Satisfy",
  "Parisienne",
  "Yeseva One",
  "Alex Brush",
  "Italianno",
  "Courgette",
];

export function FontSelect({
  control,
  name,
  error,
  onChange,
}: {
  control?: Control;
  name?: string;
  error?: FieldError;
  onChange?: (v: string) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (onSelect: (font: string) => void) => (
    <Menu
      className="max-h-[300px] overflow-y-auto"
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleClose}
    >
      {fontOptions.map((fontName) => (
        <MenuItem
          key={fontName}
          onClick={() => {
            onSelect(fontName);
            handleClose();
          }}
        >
          <span style={{ fontFamily: fontName }}>{fontName}</span>
        </MenuItem>
      ))}
    </Menu>
  );

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <IconButton onClick={handleClick}>
              <FaFont />
            </IconButton>
            {renderMenu((font) => {
              field.onChange(font);
              onChange?.(font);
            })}
            {error && (
              <FormHelperText sx={{ color: "red", mt: 1 }}>
                {error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    );
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <FaFont />
      </IconButton>
      {renderMenu((font) => {
        onChange?.(font);
      })}
    </>
  );
}
