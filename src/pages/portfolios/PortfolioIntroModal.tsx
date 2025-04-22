// components/PortfolioIntroModal.tsx

import { useEffect, useState } from "react";
import Dialog from "@/components/modals/Dialog";
import { Button } from "@mui/joy";
import { FaCheckCircle } from "react-icons/fa";
import image from "@/assets/portfolioIntro1.jpg";

export default function PortfolioIntroModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("hasSeenPortfolioIntro");
    if (!hasSeenIntro) {
      setOpen(true);
      localStorage.setItem("hasSeenPortfolioIntro", "true");
    }
  }, []);

  return (
    <Dialog
      title="Apresente melhor. Conquiste mais."
      open={open}
      onClose={() => setOpen(false)}
      actions={
        <div className="flex justify-end w-full mt-4">
          <Button onClick={() => setOpen(false)} color="primary">
            Começar agora
          </Button>
        </div>
      }
    >
      <div className="w-[750px] h-[500px] p-4 space-y-6 text-gray-800 relative text-primary">
        {/* Bloco 1: Visão geral */}
        <div className="space-y-2">
          <p className="text-md">
            O <strong>Portfólio</strong> é uma forma moderna, visual e
            estratégica de apresentar imóveis e propostas para seus clientes.
            Agora você pode juntar varias propostas e ou imóveis{" "}
            <strong>em um único link.</strong>
          </p>
          <p className="text-md">
            Use como <strong>curadoria de imóveis</strong>,{" "}
            <strong>relatório de visitação</strong>,
            <strong> comparação de condições de pagamento</strong> ou explore
            com sua criatividade. O Portfólio se adapta à sua estratégia.
          </p>
        </div>

        <div className="ms-[250px] z-[10]">
          <h3 className="text-md font-bold mb-4">
            O que você pode fazer com um Portfólio:
          </h3>
          <ul className="list-none space-y-2">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 mt-1" />
              Selecionar imóveis ou propostas ideais para o cliente
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 mt-1" />
              Comparar diferentes condições de pagamento lado a lado
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 mt-1" />
              Acompanhar o que o cliente viu e por quanto tempo
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 mt-1" />
              Receber uma notificação assim que o cliente acessar
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 mt-1" />
              Saber qual imóvel o cliente tem mais interesse
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 mt-1" />
             Remova, ordene e adicione itens rapidamente
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-600 mt-1" />
              Manter todo o atendimento em único link
            </li>
          </ul>
        </div>

        <img
          src={image}
          alt="Exemplo de portfólio"
          className="absolute w-[220px] top-[130px] z-2"
        />

        {/* Bloco 5: Encerramento */}
        <p className="text-sm text-gray-600 text-center mt-2 ms-[280px]">
          Crie uma jornada personalizada para o cliente e transforme cada link
          em uma oportunidade de venda.
        </p>
      </div>
    </Dialog>
  );
}
