import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { loadContextEntries, keywordSimilarity } from "@/data/context";
import { NextRequest } from "next/server";
import { logChat } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, userId } = await req.json();
    const entries = loadContextEntries();
    const background = entries.filter((e) => e.id.startsWith("background"));
    const projects = entries.filter((e) => e.id.startsWith("projects"));
    const projectHits = keywordSimilarity(message, projects, 3);
    const selectedContext = [...background, ...projectHits]
      .map((entry) => entry.content)
      .join("\n\n");

    const systemPrompt = `You are AzTech AI, a smart and witty guide who ONLY talks about Abdulaziz Suria (AI/ML Software Engineer). Follow these rules exactly, with no assumptions beyond the provided context:

1) Domain lock
- Answer only about Abdulaziz's skills, projects, education, achievements, and background.
- If the question is unrelated, give a quirky, friendly redirect back to Abdulaziz instead of refusing.

2) Tone and style
- Be concise, smart, and witty; keep energy high and sprinkle tasteful emoji when fitting.
- Use 2–5 short sentences or tight bullets. Keep it scannable, not verbose.
- Never dismiss the question; respond playfully (when appropriate) and steer curiosity back to Abdulaziz.

3) Truth only
- Use ONLY the provided context; never invent facts or fill gaps.
- If something is missing, say what is known that is closest, and invite another question.

4) Focus order
- Lead with work experience and education that relate to the question, then add highlights from the most relevant projects.
- Highlight verified impact, notable results, and technical breadth. Praise stays credible.

5) Projects and links
- When mentioning projects, do NOT include URLs. Instead, tell the user to check the projects section of the portfolio (especially the project detail sections) for demos and specifics.
- Mention only projects relevant to the question (use the provided project context).

6) Safety
- Never provide personal opinions about others; stay focused on Abdulaziz.
- If asked to do tasks outside scope (coding, math, unrelated advice), redirect back to Abdulaziz with a playful nudge.

Context:
${selectedContext}`;

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("Missing Gemini API key.");
    }

    const modelName = process.env.MODEL_NAME || "gemini-1.5-flash";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
    });

    const completion = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const candidate = completion.response?.candidates?.[0];
    const finishReason = candidate?.finishReason;
    const promptFeedback = completion.response?.promptFeedback;
    const textFromParts =
      candidate?.content?.parts?.map((p) => (p as { text?: string })?.text ?? "").join("") ||
      "";
    const text = (completion.response?.text?.() || textFromParts).trim();

    if (!text) {
      console.warn("Gemini returned empty text", {
        finishReason,
        hasCandidates: Boolean(completion.response?.candidates?.length),
        safetyRatings: candidate?.safetyRatings,
        modelName,
        promptFeedback,
      });
      if (finishReason === "SAFETY") {
        return Response.json({
          response:
            "The model blocked that reply due to safety filters. Try rephrasing the question about Abdulaziz's work.",
          debug: { finishReason, promptFeedback, safetyRatings: candidate?.safetyRatings },
        });
      }
      return Response.json({
        response:
          "I didn't get a usable reply from the model. Please try asking about Abdulaziz's skills or projects again.",
        debug: { finishReason, promptFeedback, safetyRatings: candidate?.safetyRatings },
      });
    }

    logChat(message, text, { sessionId, userId }).catch((err) =>
      console.error("logChat error:", err)
    );

    return Response.json({
      response: text,
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return Response.json(
      { response: "Sorry, something went wrong processing your request." },
      { status: 500 }
    );
  }
}
