// pages/product/@id/+Head.js

import { Proposal } from "@/types/proposalTypes";
import { useData } from "vike-react/useData"; // or vike-{vue,solid}

export function Head() {
  const proposalData = useData<Proposal>();

  const title = proposalData.propertyName
    ? `Proposta para ${proposalData.propertyName}`
    : `Planejamento Financeiro - ${proposalData.user.fullName}`;

  const image =
    proposalData.mainPhoto ||
    proposalData.user.photo ||
    "https://example.com/default-image.jpg";

  const description = proposalData.subtitle
    ? proposalData.subtitle
    : `Confira o planejamento financeiro personalizado de ${proposalData.user.fullName}, com detalhes completos sobre a proposta.`;

  const url = `https://app.imobdeal.com.br/proposta/${proposalData.id}`;
  const author = proposalData.user.fullName;

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

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />

      {/* Meta tags de compartilhamento para o WhatsApp */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Links para as redes sociais do usuário */}
      <link rel="author" href={proposalData.user.linkedin} />
      <link rel="canonical" href={url} />

      <link
        rel="preload"
        as="image"
        href={proposalData.mainPhoto}
        type="image/webp"
      />
    </>
  );
}
