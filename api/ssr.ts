// import { renderPage } from "vike";
// import { VercelRequest, VercelResponse } from "@vercel/node";

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   const pageContext = await renderPage({ urlOriginal: req.url!  });

//   if (pageContext.httpResponse) {
//     const { body, statusCode, headers } = pageContext.httpResponse;
//     headers.forEach(([name, value]) => res.setHeader(name, value));
//     res.statusCode = statusCode;
//     res.end(body);
//   } else {
//     res.statusCode = 404;
//     res.end("Page not found");
//   }
// }
