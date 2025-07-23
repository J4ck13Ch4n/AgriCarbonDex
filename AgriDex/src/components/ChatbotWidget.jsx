
// src/components/ChatbotWidget.jsx
import React, { useState } from 'react';
import { MessageSquare, X, ChevronDown } from 'lucide-react';
import ChatbotComponent from './ChatbotComponent';

// MÀU SẮC TỪ TRANG WEB AGRICARBONDEX
const ACCENT_GREEN = '#16F89D';
const DARK_BG = '#212429';
const CARD_BG = '#2D3137';
const HOVER_GREEN = '#13de8b'; // Màu xanh lá đậm hơn một chút khi hover

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Nút bật/tắt chatbot chính - Đã đổi màu */}
      <button
        onClick={toggleChatbot}
        style={{ backgroundColor: ACCENT_GREEN }}
        className="fixed bottom-5 right-5 z-50 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-black hover:opacity-90 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
        title={isOpen ? "Đóng Chatbot" : "Mở Chatbot"}
      >
        {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
      </button>

      {/* Popup Chatbot - Đã đổi màu nền và các thành phần */}
      {isOpen && (
        <div 
          style={{ backgroundColor: CARD_BG }}
          className="fixed bottom-24 right-5 z-40 w-96 h-[70vh] max-h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
        >
          
          {/* Chatbot Header - Đã đổi màu */}
          <div 
            style={{ backgroundColor: CARD_BG, borderColor: '#4B5563' }}
            className="flex items-center justify-between p-4 border-b flex-shrink-0"
          >
            <div className="flex items-center gap-3">
              <div 
                style={{ backgroundColor: ACCENT_GREEN }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
              >
                <MessageSquare size={22} className="text-black" />
              </div>
              <h2 className="text-lg font-semibold text-white">Chatbot</h2>
            </div>
            <button
              onClick={toggleChatbot}
              className="text-gray-400 hover:text-white"
              title="Thu nhỏ Chatbot"
            >
              <ChevronDown size={24} />
            </button>
          </div>

          {/* Component nội dung chat được nhúng vào đây */}
          <div className="flex-grow overflow-hidden">
             <ChatbotComponent />
          </div>

        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
