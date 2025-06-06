import { FormControl, FormLabel, Select, Option } from "@mui/joy";
import { Control, Controller, FieldError } from "react-hook-form";

export const categories = [
  { value: "HOUSE", label: "Casa" },
  { value: "APARTMENT", label: "Apartamento" },
  { value: "TOWNHOUSE", label: "Sobrado" },
  { value: "COMMERCIAL", label: "Comercial" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "LAND", label: "Terreno" },
  { value: "MIXED_USE", label: "Uso Misto" },
  { value: "WAREHOUSE", label: "Armazém" },
  { value: "RETAIL", label: "Varejo" },
  { value: "HOTEL", label: "Hotel" },
  { value: "OFFICE", label: "Escritório" },
  { value: "SEMI_DETACHED", label: "Geminado" },
  { value: "LOFT", label: "Loft" },
  { value: "KITNET", label: "Kitnet" },
  { value: "STUDIO", label: "Studio" },
  { value: "STORE", label: "Loja" },
  { value: "COMMERCIAL_ROOM", label: "Sala Comercial" },
];

interface BuildingCategorySelectProps {
  control?: Control;
  name?: string;
  error?: FieldError;
  onChange?: (value: string) => void;
  value?: string;
}
export const BuildingCategorySelect = ({
  control,
  name,
  error,
  onChange,
  value,
}: BuildingCategorySelectProps) => {
  return control && name ? (
    <FormControl error={!!error}>
      <div>
        <FormLabel>Categoria do Imóvel</FormLabel>
        <Controller
          name={name}
          control={control}
          rules={{ required: "A categoria é obrigatória." }}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Selecione uma categoria"
              onChange={(_e, value) => {
                field.onChange(value);
                onChange && onChange(value);
              }}
              value={field.value || ""}
            >
              {categories.map((category) => (
                <Option key={category.value} value={category.value}>
                  {category.label}
                </Option>
              ))}
            </Select>
          )}
        />
        {error && <p className="text-error text-sm">{error.message}</p>}
      </div>
    </FormControl>
  ) : (
    <Select
      placeholder="Selecione uma categoria"
      className="!min-w-[200px]"
      onChange={(_, value: string) => {
        onChange(value);
      }}
      value={value}
    >
      {categories.map((category) => (
        <Option key={category.value} value={category.value}>
          {category.label}
        </Option>
      ))}
    </Select>
  );
};
