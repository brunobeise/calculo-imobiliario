import { useState } from "react";
import { Button, Input } from "@mui/joy";
import axios from "axios";

export default function Scrap() {
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScrap = async () => {
    setError("");
    setStatus("");
    setLoading(true);
    setStatus("Verificando Serviço...");

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
      console.log(result);

      setStatus("");
    } catch {
      setError("Não foi possível completar a varredura.");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center mb-5 text-2xl font-bold">
        Scrapper Imobiliário
      </h2>
      <div className="flex justify-center">
        <Input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="coloque aqui o link do imóvel"
          className="w-full max-w-[800px] mb-4"
        />
      </div>

      <div className="flex justify-center">
        <Button className="w-32" loading={loading} onClick={handleScrap}>
          Scrap
        </Button>
      </div>
      <div className={`${error && "text-red-500"} flex mt-4 justify-center`}>
        {error ? error : status}
      </div>
    </div>
  );
}
