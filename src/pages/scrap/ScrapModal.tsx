import { useState } from "react";
import { Button, Input } from "@mui/joy";
import axios from "axios";
import Dialog from "@/components/modals/Dialog";
import { Spinner } from "@/components/Loading";
import { Building } from "@/types/buildingTypes";

interface ScrapModalProps {
  open: boolean;
  onClose: () => void;
  onScrap: (data: Partial<Building>) => void;
}

const statusMessages = [
  "Capturando imagens do imóvel...",
  "Defininindo a imagem principal...",
  "Extraindo dados...",
  "Refinando descrição...",
  "Buscando as caracteristicas...",
  "Escapando do anti-robô...",
  "Organizando informações...",
];

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

    setStatus("Iniciando a varredura... Isso pode levar alguns minutos...");

    const shuffledMessages = [...statusMessages].sort(
      () => Math.random() - 0.5
    );
    let currentMessageIndex = 0;

    const updateStatus = () => {
      if (currentMessageIndex < shuffledMessages.length) {
        setStatus(shuffledMessages[currentMessageIndex]);
        currentMessageIndex++;

        const randomDelay = Math.random() * (7000 - 2000) + 2000;
        setTimeout(updateStatus, randomDelay);
      }
    };

    updateStatus();

    try {
      const result = await axios.post(
        "https://parisotto-scrap.onrender.com/scrap",
        { url: link }
      );

      setStatus("Finalizando...");
      setTimeout(() => {
        onClose();
      }, 2000);
      setTimeout(() => {
        setStatus("");
        onScrap(result.data);
      }, 3000);
    } catch {
      setError("Não foi possível completar a varredura.");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Cadastrar imóvel via link">
      <div className="h-[170px] w-[500px] flex flex-col justify-between py-2 relative">
        <Input
          disabled={loading}
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Coloque aqui o link do imóvel"
          className="w-full"
        />

        <div
          className={`absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] text-center ${
            error ? "text-red-500" : ""
          }`}
        >
          {error || status}
        </div>

        {loading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
        {!loading && status !== "Finalizando..." && (
          <div className="flex justify-center gap-2 mb-4">
            <Button className="w-[300px]" onClick={handleScrap}>
              Fazer Varredura
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
