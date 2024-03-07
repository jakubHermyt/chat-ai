'use client'

import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import useChat from "@/hooks/useChatResponse";

interface Message {
    text: string;
    isUser: boolean;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [globalLoading, setGlobalLoading] = useState(false)
    const {sendMessage} = useChat()

    useEffect(() => {
        // Initial message
        setMessages([{ text: 'How can I help you?', isUser: false }]);
    }, []);

    const handleSend = async () => {
        if (inputText.trim() !== '') {
            setGlobalLoading(true)
            setMessages([...messages, { text: inputText, isUser: true }]);
            setInputText('');

            const response = await sendMessage(inputText);
            const computeMessage: string[] = []
            for await (const chunk of response) {
                computeMessage.push(chunk)
            }
            setMessages(prev => [...prev, {text: computeMessage.join(""), isUser: false}])
            setGlobalLoading(false)
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800 px-4 py-8">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 p-4 rounded-lg max-w-md mx-auto ${
                            message.isUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    >
                        {message.text}
                    </div>
                ))}
                {globalLoading && (
                    <div className="flex justify-center items-center text-gray-500 dark:text-gray-400">
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
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-700"
                />
                <button
                    onClick={handleSend}
                    disabled={globalLoading || inputText.trim() === ''}
                    className={`mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none ${
                        globalLoading
                            ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 focus:bg-blue-600'
                    }`}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
