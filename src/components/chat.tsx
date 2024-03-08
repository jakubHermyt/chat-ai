"use client";

import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import useChat from "@/hooks/useChatResponse";
import { marked } from "marked";

interface Message {
  text: string;
  isUser: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [globalLoading, setGlobalLoading] = useState(false);
  const { sendMessage } = useChat();

  useEffect(() => {
    // Initial message
    setMessages([{ text: "How can I help you?", isUser: false }]);
  }, []);

  const handleSend = async () => {
    if (inputText.trim() !== "") {
      setGlobalLoading(true);
      setMessages([...messages, { text: inputText, isUser: true }]);
      setInputText("");

      const response = await sendMessage(inputText);
      const computeMessage: string[] = [];
      for await (const chunk of response) {
        computeMessage.push(chunk);
      }
      setMessages((prev) => [
        ...prev,
        { text: computeMessage.join(""), isUser: false },
      ]);
      setGlobalLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-y-auto bg-gray-100 px-4 py-8 dark:bg-gray-800">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mx-auto mb-4 max-w-md rounded-lg p-4 ${
              message.isUser
                ? "self-end bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            } overflow-scroll`}
            dangerouslySetInnerHTML={{ __html: marked(message.text) }}
          />
        ))}
        {globalLoading && (
          <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        )}
      </div>
      <div className="p-4">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="..."
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={globalLoading || inputText.trim() === ""}
          className={`mt-2 w-full rounded-md bg-blue-500 px-4 py-2 text-white focus:outline-none ${
            globalLoading
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-blue-600 focus:bg-blue-600"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
