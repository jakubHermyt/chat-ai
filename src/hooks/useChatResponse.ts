import { useState } from "react";
import { Ollama } from "@langchain/community/llms/ollama";

const ollamaClient = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "mistral",
});

const useChat = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (message: string): Promise<any> => {
    setLoading(true);
    try {
      return await ollamaClient.stream(message);
    } catch (error) {
      console.error("Error on send data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useChat;
