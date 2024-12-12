import Constants from "expo-constants";
import axios from "axios";

const API_KEY = Constants.expoConfig?.extra?.openaiApiKey;

const openAI = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

const useGrammar = () => {
  const checkGrammar = async (text: string) => {
    try {
      const response = await openAI.post("/chat/completions", {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a grammar checker. Correct any grammatical errors in the text provided and return only the corrected text.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.3,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching grammar suggestions:", error);
      return null;
    }
  };

  return { checkGrammar };
};

export default useGrammar;
