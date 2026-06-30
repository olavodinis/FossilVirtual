/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily to prevent crash if key is missing
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY" && API_KEY.trim() !== "") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini AI client successfully initialized server-side.");
  } catch (error) {
    console.error("Error initializing Gemini API:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. PaleoBot will operate in high-fidelity educational offline fallback mode.");
}

// System Instruction for PaleoBot targeting 7th grade Natural Sciences in Portugal
const PALEO_BOT_SYSTEM_INSTRUCTION = `
Tu és o PaleoBot, um assistente virtual e guia educativo especializado em paleontologia para alunos do 7.º ano de escolaridade da disciplina de Ciências Naturais, em Portugal.
O teu objetivo é esclarecer dúvidas dos alunos e visitantes do Museu Virtual de Fósseis com rigor científico mas linguagem simples, motivadora, clara e acessível (alunos de 12-13 anos).

Instruções fundamentais:
1. Responde SEMPRE em Português de Portugal (pt-PT). Usa termos adequados ao currículo (e.g., "M.a." para milhões de anos, "fóssil de idade", "fóssil de fácies", "icnofóssil", "mineralização", "moldagem", "conservação", "estrato", "sedimentação").
2. Evita respostas longas. Mantém as explicações curtas, diretas e divididas em pequenos parágrafos ou tópicos simples de ler.
3. Sempre que possível, dá exemplos práticos em Portugal (e.g., trilobites gigantes de Arouca/Canelas, pegadas de dinossauro da Serra de Aire ou Cabo Espichel, amonites de Peniche, jazidas da Lourinhã).
4. Sê encorajador, usa expressões simpáticas como "Excelente pergunta, jovem paleontólogo!", "Boa viagem ao passado!" ou "Fascinante, não achas?".
5. Assuntos autorizados: fósseis, fossilização (moldagem, mineralização, impressões, conservação total em âmbar ou gelo), eras geológicas (Paleozoico, Mesozoico, Cenozoico), paleoflora, extinções em massa, rochas sedimentares e geologia básica.
6. Se te perguntarem algo fora deste tema de geologia e fósseis, redireciona o aluno com gentileza, relembrando que és um robô paleontólogo.
`;

// API endpoint for chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "O formato do corpo do pedido deve incluir um array 'messages'." });
    }

    const latestMessageObj = messages[messages.length - 1];
    const userPrompt = latestMessageObj?.text || "";

    // If Gemini is initialized, make the API call
    if (ai) {
      try {
        // Map conversation history to Gemini format (role: user/model)
        const chatHistory = messages.map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: chatHistory,
          config: {
            systemInstruction: PALEO_BOT_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const replyText = response.text || "Desculpa, não consegui processar a tua resposta. Podes tentar de novo?";
        return res.json({ text: replyText });
      } catch (geminiError: any) {
        console.error("Gemini API call failed, using high-fidelity fallback:", geminiError);
        // Fall through to offline fallback if API fails
      }
    }

    // High-Fidelity Portuguese Offline Fallback Mode
    const textLower = userPrompt.toLowerCase();
    let fallbackReply = "";

    if (textLower.includes("o que é um fóssil") || textLower.includes("o que é fóssil") || textLower.includes("defina fóssil")) {
      fallbackReply = "Um **fóssil** é qualquer resto (como dentes, conchas ou ossos) ou vestígio (como pegadas, ovos ou fezes) de um ser vivo do passado que ficou preservado nas rochas sedimentares ao longo de milhares ou milhões de anos! 🦕 São verdadeiras janelas para o passado do nosso planeta.";
    } else if (textLower.includes("amonite") || textLower.includes("amonete")) {
      fallbackReply = "As **amonites** eram moluscos marinhos de concha espiralada que viveram na Era Mesozoica! Elas dominavam os mares enquanto os dinossauros governavam a terra. São excelentes fósseis de idade. Em Portugal, podes encontrar muitos exemplares bonitos nas falésias de Peniche ou da Figueira da Foz! 🐚";
    } else if (textLower.includes("trilobite") || textLower.includes("trilobites")) {
      fallbackReply = "As **trilobites** foram artrópodes marinhos fantásticos com uma carapaça dura dividida em três partes (lobos). Viveram apenas na Era Paleozoica. Sabias que em **Arouca (Canelas)** temos os maiores fósseis de trilobites gigantes do mundo? Elas rastejavam no fundo de mares pouco profundos de Portugal há 450 milhões de anos! 🪳";
    } else if (textLower.includes("icnofóssil") || textLower.includes("vestígio") || textLower.includes("pegada")) {
      fallbackReply = "Excelente conceito do 7.º ano! Um **icnofóssil** é um fóssil de atividade ou vestígio. Não é o corpo do animal em si, mas sim o seu registo: como pegadas de dinossauro (por exemplo, na Serra de Aire ou Cabo Espichel), marcas de dentes, túneis escavados ou até fezes fossilizadas (coprólitos)! Revelam muito sobre o comportamento do animal. 🐾";
    } else if (textLower.includes("corporal") || textLower.includes("fósseis corporais")) {
      fallbackReply = "Os **fósseis corporais** são restos de partes físicas do corpo do próprio ser vivo que resistiram à decomposição. Exemplos: ossos de dinossauro da Lourinhã, dentes gigantes de tubarão Megalodonte ou conchas de amonites! 🦴";
    } else if (textLower.includes("dino") || textLower.includes("dinossauro") || textLower.includes("dinossáurio")) {
      fallbackReply = "Os **dinossauros** foram os grandes répteis que dominaram a Terra durante a Era Mesozoica! Em Portugal, a região da Lourinhã é mundialmente famosa pela riqueza de ossos e ovos de dinossauros, e a Serra de Aire é conhecida pelas maiores pistas de pegadas de saurópodes (pescoço longo) do mundo! 🦖";
    } else if (textLower.includes("era") || textLower.includes("eras") || textLower.includes("paleozoico") || textLower.includes("mesozoico") || textLower.includes("cenozoico")) {
      fallbackReply = "A escala do tempo geológico divide-se em grandes Eras:\n\n1️⃣ **Paleozoico**: A era dominada pelas trilobites e pelos primeiros peixes e florestas antigas.\n2️⃣ **Mesozoico**: A era dos dinossauros na terra e das amonites no mar.\n3️⃣ **Cenozoico**: A era que vai até hoje, dominada por mamíferos, aves, plantas com flor e, claro, o aparecimento do Homem! 🌍";
    } else if (textLower.includes("importante") || textLower.includes("importância") || textLower.includes("para que serve")) {
      fallbackReply = "Os fósseis são super importantes por três grandes razões:\n\n1️⃣ **Raciocínio Evolutivo**: Permitem compreender a evolução e o aparecimento/extinção de espécies.\n2️⃣ **Fósseis de Idade**: Ajudam a datar as rochas sedimentares.\n3️⃣ **Fósseis de Fácies**: Ajudam a reconstituir o ambiente (paleoambiente) e o clima (paleoclima) do passado, como se fossemos detetives do tempo! 🔬";
    } else if (textLower.includes("fossilização") || textLower.includes("como se forma") || textLower.includes("processo")) {
      fallbackReply = "A fossilização é um processo extremamente raro! Geralmente envolve:\n\n1️⃣ Morte do organismo.\n2️⃣ Deposição rápida sob sedimentos finos (como argila ou areia), isolando-o do oxigénio para evitar a decomposição total.\n3️⃣ Transformações químicas ao longo de milhões de anos! Os principais processos são a **moldagem** (marca do organismo), a **mineralização** (substituição por minerais) e a **conservação** (como no âmbar ou gelo). 🏺";
    } else if (textLower.includes("âmbar") || textLower.includes("ambar") || textLower.includes("inseto")) {
      fallbackReply = "O **âmbar** é resina gotejada de pinheiros antigos que endureceu ao longo de milhões de anos. Se um pequeno inseto lá ficasse preso, o âmbar preservava-o perfeitamente em 3D, com pele, pernas e asas intactas! É uma conservação total e espetacular. 💎";
    } else {
      fallbackReply = "Olá, jovem paleontólogo! Sou o **PaleoBot** 🦕. Estou aqui para ajudar-te na disciplina de Ciências Naturais do 7.º ano!\n\nPodes perguntar-me sobre:\n- *O que é um fóssil?*\n- *Como funciona a fossilização?*\n- *Qual a diferença entre fóssil corporal e icnofóssil?*\n- *O que são amonites ou trilobites?*\n- *Em que eras geológicas viveram os dinossauros?*\n- *Porque é que os fósseis são importantes?*\n\nComo posso ajudar-te hoje?";
    }

    // Add a polite offline disclaimer at the end if the key isn't provided (as a subtle, helpful info)
    if (!ai) {
      fallbackReply += "\n\n*(Nota: PaleoBot ativo em modo offline educativo)*";
    }

    return res.json({ text: fallbackReply });
  } catch (error) {
    console.error("General error in /api/chat route:", error);
    res.status(500).json({ error: "Erro interno no servidor ao processar a pergunta." });
  }
});

// Configure Vite or Static Assets serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving compiled static assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Museu Virtual de Fósseis server successfully listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
