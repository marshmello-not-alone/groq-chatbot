import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";
import { ChatMessage, ChatRequestBody } from "../types/chatTypes";

let messages: ChatMessage[] = [
  { role: "system", content: "You are a helpful assistant." },
];

export async function chatRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/chat",
    async (
      request: FastifyRequest<{ Body: ChatRequestBody }>,
      reply: FastifyReply
    ) => {
      const { userInput } = request.body;

      messages.push({ role: "user", content: userInput });

      try {
        const groqResponse = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama3-8b-8192",
            messages: messages,
            stream: false, // <--- no streaming now
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const aiMessage =
          groqResponse.data.choices?.[0]?.message?.content ?? "";

        reply.send({ aiMessage });
      } catch (error: any) {
        console.error(error.response?.data || error.message);
        reply.status(500).send({ error: "AI request failed" });
      }
    }
  );
}
