import { useState } from "react";
import { Button, Input } from "@mui/joy";
import axios from "axios";

interface Property {
  propertyName: string;
  propertyType: string;
  city: string;
  neighbourhood: string;
  description: string;
  landArea: number;
  builtArea: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpaces: number;
  livingRooms: number;
  amenities: string[];
  value: number;
  photos: string[];
}

export default function Scrap() {
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);

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
    setStatus("Fazendo varredura no site... Isso pode levar até 30 segundos");

    try {
      const result = await axios.post(
        "https://parisotto-scrap.onrender.com/scrap",
        { url: link }
      );
      setProperty(result.data);
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
      <h2 className="text-center mb-5 text-2xl font-bold">Scrapper Imobiliário</h2>
      <div className="flex justify-center">
        {" "}
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
      {property && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">{property.propertyName}</h2>
          <p>
            <strong>Tipo:</strong> {property.propertyType}
          </p>
          <p>
            <strong>Cidade:</strong> {property.city}
          </p>
          <p>
            <strong>Bairro:</strong> {property.neighbourhood}
          </p>
          <p>
            <strong>Descrição:</strong> {property.description}
          </p>
          <p>
            <strong>Área do Terreno:</strong> {property.landArea} m²
          </p>
          <p>
            <strong>Área Construída:</strong> {property.builtArea} m²
          </p>
          <p>
            <strong>Dormitórios:</strong> {property.bedrooms}
          </p>
          <p>
            <strong>Suítes:</strong> {property.suites}
          </p>
          <p>
            <strong>Banheiros:</strong> {property.bathrooms}
          </p>
          <p>
            <strong>Vagas de Estacionamento:</strong> {property.parkingSpaces}
          </p>
          <p>
            <strong>Salas:</strong> {property.livingRooms}
          </p>
          <p>
            <strong>Comodidades:</strong> {property.amenities.join(", ")}
          </p>
          <p>
            <strong>Valor:</strong> R${property.value.toLocaleString()}
          </p>
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Fotos:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
