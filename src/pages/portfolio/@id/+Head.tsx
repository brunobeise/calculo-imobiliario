// pages/portfolio/@id/+Head.tsx

import { Portfolio } from "@/types/portfolioTypes";
import { useData } from "vike-react/useData";

export function Head() {
  function stripHtmlSSR(html: string): string {
    return html
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  }
  const portfolioData = useData<Portfolio>();

  const item = portfolioData.items.length === 1 ? portfolioData.items[0] : null;

  const isSingleCase = item?.case;
  const isSingleBuilding = item?.building;

  const title = portfolioData.clientName
    ? `Portfólio para ${portfolioData.clientName}`
    : `Portfólio personalizado - ${portfolioData.user.fullName}`;

  const description = item
    ? isSingleCase
      ? item.case.description ||
        `Veja todos os detalhes da proposta "${item.case.name}" preparada por ${portfolioData.user.fullName}.`
      : isSingleBuilding
      ? stripHtmlSSR(item.building.description ?? "") ||
        `Confira as informações completas do imóvel "${
          item.building.propertyName || "sem nome"
        }", selecionado por ${portfolioData.user.fullName}.`
      : portfolioData.description
    : portfolioData.description ||
      `Confira o portfólio completo preparado por ${portfolioData.user.fullName}, com imóveis e propostas personalizadas.`;

  const image =
    item?.case?.mainPhoto ||
    item?.building?.mainPhoto ||
    portfolioData.user.photo;

  const url = `https://app.imobdeal.com.br/portfolio/${portfolioData.id}`;
  const author = portfolioData.user.fullName;

  return (
    <>
      {/* Título da página */}
      <title>{title}</title>

      {/* Meta tags para SEO */}
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph (Facebook, WhatsApp, etc.) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />

      {/* Links para redes sociais ou autor */}
      <link rel="author" href={portfolioData.user.linkedin} />
      <link rel="canonical" href={url} />

      {/* Preload da imagem principal */}
      {image && (
        <link rel="preload" as="image" href={image} type="image/webp" />
      )}
    </>
  );
}
