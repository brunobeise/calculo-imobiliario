/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import * as cheerio from "cheerio";

// Função principal para fazer o scraping
async function scrapeWebsite(url: string): Promise<void> {
  try {
    // Fazendo a requisição HTTP para obter o conteúdo da página
    const { data } = await axios.get(url);

    // Carregando o HTML no Cheerio
    const $ = cheerio.load(data);

    // Selecionando e extraindo o texto dos elementos desejados
    $("p").each((index, element) => {
      const text = $(element).text();
      console.log(`Paragraph ${index + 1}: ${text}`);
    });
  } catch (error : any) {
    console.error(`Erro ao fazer scraping do site: ${error.message}`);
  }
}

// URL do site a ser scrapped
const websiteUrl =
  "https://www.parisottoimoveis.com/imovel/casa-3-quartos-joao-alves-santa-cruz-do-sul-2-vagas-143,38m2-code-717";

// Iniciando o scraping
scrapeWebsite(websiteUrl);
