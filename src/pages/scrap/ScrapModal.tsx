import { useState } from "react";
import { Button, Input } from "@mui/joy";
import axios from "axios";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Divider from "@mui/joy/Divider";
import { Building } from "@/types/buildingTypes";

interface ScrapModalProps {
  open: boolean;
  onClose: () => void;
  onScrap: (data: Partial<Building>) => void;
}

export default function ScrapModal({
  open,
  onClose,
  onScrap,
}: ScrapModalProps) {
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScrap = async () => {
    setError("");
    setStatus("Verificando Serviço...");
    setLoading(true);

    try {
      await axios.get("https://parisotto-scrap.onrender.com");
    } catch {
      setError("Serviço indisponível");
      setStatus("");
      setLoading(false);
      return;
    }

    setStatus("Fazendo varredura no site... Isso pode levar alguns minutos...");

    try {
      const result = await axios.post(
        "https://parisotto-scrap.onrender.com/scrap",
        { url: link }
      );

      setStatus("");
      onScrap(result.data);
      onClose();
    } catch {
      setError("Não foi possível completar a varredura.");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="outlined">
        <DialogTitle>Cadastrar imóvel via link</DialogTitle>
        <Divider />
        <DialogContent className="w-[500px]">
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Coloque aqui o link do imóvel"
            className="w-full"
          />
          <div className={`mt-4 py-4 text-center ${error && "text-red-500"}`}>
            {error || status}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            loading={loading}
            variant="solid"
            color="primary"
            onClick={handleScrap}
          >
            Fazer Varredura
          </Button>
          <Button variant="plain" color="neutral" onClick={onClose}>
            Cancelar
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
