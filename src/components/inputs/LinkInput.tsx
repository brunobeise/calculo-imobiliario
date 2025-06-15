import React, { ChangeEvent, useState, useCallback, useEffect } from "react";
import { FormControl, FormLabel, Input } from "@mui/joy";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import { api } from "@/service/api";
import { SpinnerCircular } from "../Loading";
import debounce from "lodash.debounce";
import InfoTooltip from "../ui/InfoTooltip";

interface LinkInputProps {
  label: string;
  type: "case" | "portfolio";
  resourceId?: string;
  error?: string;
  startDecorator?: React.ReactNode;
  handleError: (error: boolean) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export default function LinkInput({
  label,
  type,
  resourceId,
  error,
  startDecorator,
  onChange,
  value,
  handleError,
  ...other
}: LinkInputProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [status, setStatus] = useState<
    "idle" | "loading" | "available" | "unavailable"
  >("idle");
  const [errorMessage, setError] = useState("");

  const checkLink = async (val: string) => {
    if (!val) {
      setStatus("idle");
      return;
    }

    try {
      const response = await api.post("/check-link-availability", {
        link: val,
        type,
        id: resourceId,
      });
      setStatus(response.data.available ? "available" : "unavailable");
    } catch (err) {
      setStatus("unavailable");
      setError(err.response?.data?.error || "Erro ao verificar link");
    }
  };

  useEffect(() => {
    if (status === "unavailable") {
      handleError(true);
    } else {
      handleError(false);
    }
  }, [handleError, status]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheckLink = useCallback(
    debounce((val: string) => {
      checkLink(val);
    }, 500),

    [resourceId, type]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setInputValue(val);
    setStatus("loading");
    debouncedCheckLink(val);
    if (onChange) onChange(event);
  };

  const renderEndDecorator = () => {
    if (status === "loading") return <SpinnerCircular size={15} />;
    if (status === "available") return <FaCheckCircle className="text-green" />;
    if (status === "unavailable") return <FaTimesCircle className="text-red" />;
    return null;
  };

  const renderAlert = () => {
    // if (status === "loading") return null;
    if (status === "available" && !error)
      return (
        <div className="flex items-center gap-2 bg-[#baf6cf] text-green rounded-md p-3 text-sm w-[220px]">
          <FaCheckCircle className="flex-shrink-0 me-2 text-lg" />
          <span>Link disponível!</span>
        </div>
      );
    if (status === "unavailable" || error)
      return (
        <div className="flex items-center gap-2 bg-[#fecbcb] text-red rounded-md p-3 text-sm">
          <FaTimesCircle className="flex-shrink-0 me-2 text-lg" />
          <span>{errorMessage}</span>
        </div>
      );
    if (!value)
      return (
        <div className="flex items-center gap-2 bg-[#dae9fc] text-[#577ec7] rounded-md p-3 text-sm w-[420px]">
          <FaInfoCircle className="flex-shrink-0 me-2 text-lg" />
          <span>
            O link deve ter entre 3 e 15 caracteres, sem caracteres especiais,
            apenas letras, números e hífen.
          </span>
        </div>
      );
  };

  return (
    <div className="grid grid-cols-2 gap-4 items-end col-span-2 h-[64px]">
      <FormControl
        error={!!error || status == "unavailable"}
        className="flex-1"
      >
        <FormLabel>
          {label}
          <InfoTooltip text="Você pode personalizar o link do seu portfólio. Se não tiver um link configurado, será usado uma sequência aleatória de números e letras." />
        </FormLabel>
        <Input
          {...other}
          value={inputValue}
          onChange={handleChange}
          placeholder="link-personalizado"
          startDecorator={startDecorator}
          endDecorator={renderEndDecorator()}
          autoComplete="off"
        />
      </FormControl>
      <div>{renderAlert()}</div>
    </div>
  );
}
