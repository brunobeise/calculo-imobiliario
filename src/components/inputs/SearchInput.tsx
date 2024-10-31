import { FormLabel, Input, InputProps } from "@mui/joy";
import { ChangeEvent, useRef } from "react";
import { FaSearch } from "react-icons/fa";

type DebounceProps = {
  handleDebounce: (value: string) => void;
  debounceTimeout: number;
  label?: string;
};

export default function SearchInput(props: InputProps & DebounceProps) {
  const { handleDebounce, debounceTimeout, ...other } = props;

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleDebounce(event.target.value);
    }, debounceTimeout);
  };

  return (
    <div className="flex flex-col gap-2">
      {props.label && (
        <FormLabel htmlFor={props.label} className="mr-2">
          {props.label}
        </FormLabel>
      )}
      <Input
        id={props.label}
        endDecorator={<FaSearch className="text-gray" />}
        {...other}
        onChange={handleChange}
      />
    </div>
  );
}
