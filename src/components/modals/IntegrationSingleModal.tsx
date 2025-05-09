/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Dialog from "./Dialog";
import { Input, Button, Typography } from "@mui/joy";
import { integrationService } from "@/service/integrationService";
import { Spinner } from "../Loading";
import { Building } from "@/types/buildingTypes";

interface IntegrationSingleImportModalProps {
  open: boolean;
  onClose: () => void;
  setBuilding: (building: Building) => void;
}

export default function IntegrationSingleImportModal({
  open,
  onClose,
  setBuilding,
}: IntegrationSingleImportModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleImport = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setFeedback(null);

    try {
      const result = await integrationService.importSingleProperty(code);
      setFeedback({
        type: "success",
        message: "Imóvel importado com sucesso!",
      });
      setTimeout(() => {
        setBuilding(result);
        onClose();
      }, 500);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Código inválido ou imóvel não encontrado.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Importar imóvel por código"
      width={450}
    >
      <div className="p-4 flex flex-col gap-4 w-[400px] min-h-[200px] justify-center">
        <Input
          error={feedback?.type === "error"}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Digite o código do imóvel"
          size="md"
        />

        {feedback && (
          <Typography
            level="body-sm"
            color={feedback.type === "error" ? "danger" : "success"}
          >
            {feedback.message}
          </Typography>
        )}

        <Button
          onClick={handleImport}
          disabled={loading}
          color="primary"
          variant="solid"
        >
          {loading ? <Spinner /> : "Importar"}
        </Button>
      </div>
    </Dialog>
  );
}
