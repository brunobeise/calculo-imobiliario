export { Page };

import { usePageContext } from "vike-react/usePageContext";
import logo from "@/assets/imobDeal.png";

function Page() {
  const pageContext = usePageContext();

  const errorMessages = {
    404: "A página que você está procurando não foi encontrada.",
    500: "Ocorreu um erro interno no servidor.",
    403: "Você não tem permissão para acessar esta página.",
    410: "Essa proposta não está mais disponível :(",
    default: "Ocorreu um erro inesperado.",
  };

  let errorCode = 500;

  if (pageContext.urlPathname.includes("proposta")) {
    errorCode = 410;
  } else {
    errorCode = 404;
  }

  const errorMessage =
    errorMessages[errorCode as keyof typeof errorMessages] ||
    errorMessages.default;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <img src={logo} alt="Logo da ImobDeal" className="w-32 h-32 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Erro {errorCode}</h1>
      <p className="text-lg text-center mb-6 font-bold">{errorMessage}</p>
      {errorCode !== 410 && (
        <a href="/" className="text-blue-500 hover:underline text-center">
          Voltar para a página inicial
        </a>
      )}
    </div>
  );
}
