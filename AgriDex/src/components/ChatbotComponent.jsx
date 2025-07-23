// src/components/ChatbotComponent.jsx
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Sparkles, ChevronDown, ChevronUp, Bot, ArrowUp, Paperclip, Mic, Smile } from 'lucide-react';

// MÀU SẮC TỪ TRANG WEB AGRICARBONDEX
const ACCENT_GREEN = '#16F89D';
const DARK_BG = '#212429';
const CARD_BG = '#2D3137';
const INPUT_BG = '#3a4049';

function ChatbotComponent() {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hey there 👋<br /> How can I help you today?', isHtml: true }
    ]);
    const [thinkingProcess, setThinkingProcess] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showThinkingProcess, setShowThinkingProcess] = useState(false);

    useEffect(() => {
        const chatBody = document.getElementById('chat-messages-container');
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }, [messages, thinkingProcess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;
        setLoading(true);
        setError('');
        const userMessage = { type: 'user', text: question };
        setMessages(prev => [...prev, userMessage]);
        setQuestion('');

        try {
            const response = await fetch('http://localhost:3000/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });
            const data = await response.json();
            const botMessage = { type: 'bot', text: marked.parse(data.answer || ''), isHtml: true };
            setMessages(prev => [...prev, botMessage]);
            setThinkingProcess(data.thinking_steps || '');
        } catch (err) {
            setError("Không thể kết nối đến máy chủ chatbot.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: CARD_BG }} className="flex flex-col h-full text-gray-200 font-sans">
            
            {/* Khu vực điều khiển Thoughts */}
            <div style={{ borderColor: '#4B5563' }} className="flex items-center justify-between p-3 border-b flex-shrink-0">
                <button
                    onClick={() => setShowThinkingProcess(!showThinkingProcess)}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded-full focus:outline-none"
                >
                    <Sparkles size={16} style={{ color: ACCENT_GREEN }} />
                    Thoughts <span className="text-xs text-gray-400">(experimental)</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-300">
                    Auto <ChevronDown size={16} />
                </button>
            </div>

            {/* Khu vực hiển thị luồng suy nghĩ */}
            {showThinkingProcess && (
                <div style={{ borderColor: '#4B5563' }} className="p-3 text-sm bg-gray-900 text-gray-300 overflow-y-auto max-h-40 border-b relative flex-shrink-0">
                    <div id="thinking-log" className="prose prose-sm max-w-none prose-invert" dangerouslySetInnerHTML={{ __html: thinkingProcess }}></div>
                    <button onClick={() => setShowThinkingProcess(false)} className="absolute top-1 right-1 text-gray-400 hover:text-white">
                        <ChevronUp size={20} />
                    </button>
                </div>
            )}

            {/* Chatbot Body */}
            <div id="chat-messages-container" className="flex-grow overflow-y-auto p-4 space-y-5">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2.5 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.type === 'bot' && (
                            <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-700 flex items-center justify-center">
                                <Bot size={20} style={{ color: ACCENT_GREEN }} />
                            </div>
                        )}
                        <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                            msg.type === 'bot' 
                                ? 'bg-gray-700 text-gray-100 rounded-bl-none shadow-sm' 
                                : 'text-black rounded-br-none shadow-sm'
                        }`}
                        style={msg.type === 'user' ? { backgroundColor: ACCENT_GREEN } : {}}
                        >
                            <div className="prose prose-sm prose-p:my-1 prose-ul:my-1 prose-ol:my-1 text-inherit prose-invert" dangerouslySetInnerHTML={{ __html: msg.text }} />
                        </div>
                    </div>
                ))}
                {loading && <div className="text-center text-gray-400 text-sm">Đang suy nghĩ...</div>}
                {error && <div className="text-center text-red-400 text-sm">{error}</div>}
            </div>

            {/* Chatbot Footer */}
            <div style={{ backgroundColor: DARK_BG, borderColor: '#4B5563' }} className="p-3 border-t flex-shrink-0">
                <form onSubmit={handleSubmit} style={{ backgroundColor: INPUT_BG, borderColor: '#4B5563' }} className="flex items-center gap-2 rounded-xl p-1 border focus-within:ring-2 focus-within:ring-green-400">
                    <button type="button" className="p-2 text-gray-400 hover:text-green-400"><Smile size={20} /></button>
                    <button type="button" className="p-2 text-gray-400 hover:text-green-400"><Paperclip size={20} /></button>
                    <textarea
                        placeholder="Message..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e); }}
                        className="flex-grow resize-none bg-transparent focus:outline-none text-sm p-1 max-h-24 text-gray-100 placeholder-gray-400"
                        rows="1"
                    />
                    <button type="button" className="p-2 text-gray-400 hover:text-green-400"><Mic size={20} /></button>
                    <button type="submit" style={{ backgroundColor: ACCENT_GREEN }} className="p-2 rounded-lg text-black hover:opacity-90 disabled:bg-gray-500 disabled:opacity-50" disabled={loading || !question.trim()}>
                        <ArrowUp size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatbotComponent;