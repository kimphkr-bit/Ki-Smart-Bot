import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex w-full mb-6 ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isModel ? 'flex-row' : 'flex-row-reverse'} gap-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isModel ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          {isModel ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isModel ? 'items-start' : 'items-end'}`}>
          <div
            className={`px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm whitespace-pre-wrap ${
              isModel
                ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                : 'bg-indigo-600 text-white rounded-tr-none'
            }`}
          >
            {isModel ? (
              <div className="markdown-content">
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => <a {...props} className="text-indigo-600 underline hover:text-indigo-800" target="_blank" rel="noopener noreferrer" />,
                    ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside my-2 space-y-1" />,
                    ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside my-2 space-y-1" />,
                    p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                    strong: ({ node, ...props }) => <strong {...props} className="font-bold" />,
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            ) : (
              message.text
            )}
          </div>
          <span className="text-xs text-gray-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
