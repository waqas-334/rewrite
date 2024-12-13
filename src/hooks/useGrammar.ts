import axios from "axios";

const useGrammar = () => {
  const checkGrammar = async (text: string) => {
    try {
      const response = await axios.post(
        "https://clownfish-app-9b259.ondigitalocean.app/api/corrector/correct",
        { text }
      );

      return response.data.correctedText;
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
