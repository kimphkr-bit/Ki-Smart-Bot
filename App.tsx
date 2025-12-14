import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, X, Sparkles, AlertCircle } from 'lucide-react';
import { Message } from './types';
import { INITIAL_GREETING } from './constants';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import ServiceSidebar from './components/ServiceSidebar';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Chat
    initializeChat();

    // Set Initial Greeting
    setMessages([
      {
        id: 'init-1',
        role: 'model',
        text: INITIAL_GREETING,
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setIsLoading(true);

    // Add User Message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Get AI Response
    try {
      const responseText = await sendMessageToGemini(userText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Service Info) */}
      <aside 
        className={`fixed lg:static top-0 right-0 z-50 h-full w-80 lg:w-96 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        } shadow-2xl lg:shadow-none`}
      >
         <div className="h-full relative">
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full lg:hidden"
            >
              <X size={24} />
            </button>
            <ServiceSidebar />
         </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full w-full max-w-5xl mx-auto lg:mr-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ki's Smart Bot Pro</h1>
              <p className="text-xs text-gray-500">AI 마케팅 컨설턴트</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 scrollbar-hide">
          <div className="max-w-3xl mx-auto space-y-2">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start mb-6 w-full">
                <div className="flex max-w-[75%] flex-row gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Sparkles size={16} className="animate-pulse" />
                  </div>
                  <div className="px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
             {/* Hint for users */}
            {messages.length < 3 && (
               <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button onClick={() => setInput("구글 광고 대행 견적이 궁금해요")} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-indigo-100 transition-colors">
                    구글 광고 대행 견적
                  </button>
                  <button onClick={() => setInput("AI 이미지 제작 가격 알려주세요")} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-indigo-100 transition-colors">
                    AI 이미지 제작
                  </button>
                   <button onClick={() => setInput("마케팅 1달 대행은 얼마인가요?")} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-indigo-100 transition-colors">
                    1달 대행 비용
                  </button>
               </div>
            )}

            <form onSubmit={handleSendMessage} className="relative flex items-center shadow-lg rounded-2xl bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-all border border-transparent focus-within:bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="문의사항을 입력해주세요..."
                className="w-full bg-transparent border-none px-4 py-4 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none rounded-2xl"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`absolute right-2 p-2 rounded-xl transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={20} />
              </button>
            </form>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              키마케팅 AI는 실수가 있을 수 있습니다. 정확한 내용은 크몽 메시지를 통해 확인해주세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;