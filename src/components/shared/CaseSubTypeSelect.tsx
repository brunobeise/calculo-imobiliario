import React from "react";
import { Radio, RadioGroup, List, ListItem, ListItemDecorator } from "@mui/joy";
import { FaCalculator } from "react-icons/fa";
import { LuBox } from "react-icons/lu";

interface CaseSubTypeSelectProps {
  subType: string;
  onChange: (value: string) => void;
}

const CaseSubTypeSelect: React.FC<CaseSubTypeSelectProps> = ({
  subType,
  onChange,
}) => {
  return (
    <div className="flex justify-center mt-5">
      <RadioGroup
        aria-label="subType"
        sx={{ width: "600px" }}
        name="subType"
        onChange={(e) => onChange(e.target.value)}
        value={subType}
      >
        <List
          orientation="horizontal"
          className="!grid !grid-cols-2 md:!px-3 !max-w-[600px]"
          sx={{
            "--List-gap": "0.5rem",
            "--ListItem-paddingY": "1rem",
            "--ListItem-radius": "8px",
            "--ListItemDecorator-size": "32px",
          }}
        >
          {["Simplificado", "Avançado"].map((item, index) => (
            <ListItem
              className="!bg-white"
              variant="outlined"
              key={item}
              sx={{ boxShadow: "sm" }}
            >
              <ListItemDecorator>
                {[<LuBox />, <FaCalculator />][index]}
              </ListItemDecorator>
              <Radio
                overlay
                value={item}
                label={item}
                sx={{ flexGrow: 1, flexDirection: "row-reverse" }}
                slotProps={{
                  action: ({ checked }) => ({
                    sx: (theme) => ({
                      ...(checked && {
                        inset: -1,
                        border: "2px solid",
                        borderColor: theme.vars.palette.primary[500],
                      }),
                    }),
                  }),
                }}
              />
            </ListItem>
          ))}
        </List>
      </RadioGroup>
    </div>
  );
};

export default CaseSubTypeSelect;
