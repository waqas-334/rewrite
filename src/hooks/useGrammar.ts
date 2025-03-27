import { useStore } from "@/store/useStore";
import axios from "axios";

const useGrammar = () => {
  const apiKey = useStore((state) => state.apiKey);

  const openAI = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const checkGrammar = async (text: string) => {
    try {
      const response = await openAI.post("/chat/completions", {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a grammar checker. Correct any grammatical errors in the text provided and return only the corrected text. If the text is already correct, then make it better.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.3,
      });

      const correctedText = response?.data?.choices[0]?.message?.content;

      if (!correctedText) {
        return "Error: Something Happened";
      }

      return correctedText;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", {
          status: error.response?.status,
          message: error.response?.data?.error?.message || error.message,
        });
      } else {
        console.error("Error:", error);
      }
      return null;
    }
  };

  return { checkGrammar };
};

export default useGrammar;
