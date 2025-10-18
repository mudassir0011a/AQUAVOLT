import React, { useState, useRef, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const getBotResponse = (userInput: string): string => {
  const lowerCaseInput = userInput.toLowerCase();

  if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi') || lowerCaseInput.includes('hey')) {
    return 'Hello there! How can I assist you with AquaVolt today? You can ask me about reporting issues, tracking complaints, or general questions.';
  }
  if (lowerCaseInput.includes('future') || lowerCaseInput.includes('plan') || lowerCaseInput.includes('roadmap') || lowerCaseInput.includes('next')) {
    return "That's a great question! We have exciting plans for AquaVolt's future, including: \n\n • **AI-Powered Analysis:** Using advanced AI to automatically categorize issue severity from user photos. \n • **Smart Technician Dispatch:** An automated system to assign the nearest, most qualified technician instantly. \n • **Community Issue Heatmap:** A live map showing real-time issue hotspots across Navi Mumbai. \n • **Expanded Services:** Integrating more civic services like road maintenance and waste management. \n\n Our goal is to make civic reporting even smarter and more efficient!";
  }
  if (lowerCaseInput.includes('track') || lowerCaseInput.includes('complaint') || lowerCaseInput.includes('status')) {
    return "To track an existing complaint, please use the 'Track Complaint' page. You'll need the tracking ID you received via SMS or email after submitting your report.";
  }
  if (lowerCaseInput.includes('report') || lowerCaseInput.includes('issue') || lowerCaseInput.includes('problem')) {
    return "You can report a new water or electricity issue by visiting the 'Report Issue' page from the main menu. It's a simple, step-by-step process!";
  }
  if (lowerCaseInput.includes('who manages') || lowerCaseInput.includes('cidco') || lowerCaseInput.includes('msedcl')) {
    return 'Water-related issues are managed by CIDCO, while electricity issues fall under MSEDCL. When you report an issue through AquaVolt, we ensure it is routed to the correct authority for you.';
  }
  if (lowerCaseInput.includes('how long') || lowerCaseInput.includes('time')) {
    return "Resolution time varies depending on the issue's complexity and severity. You can monitor the expected timeline and real-time progress on the 'Track Complaint' page using your tracking ID.";
  }
  if (lowerCaseInput.includes('photo') || lowerCaseInput.includes('upload')) {
    return 'Yes, you can upload a photo when you report an issue. This is optional but highly recommended as it helps the authorities understand the problem better and locate it more easily.';
  }
  if (lowerCaseInput.includes('faq') || lowerCaseInput.includes('question')) {
    return 'We have a comprehensive FAQ page that might have the answer you are looking for. What would you like to know?';
  }
  if (lowerCaseInput.includes('thanks') || lowerCaseInput.includes('thank you')) {
    return "You're very welcome! Let me know if there is anything else I can help with.";
  }
  if (lowerCaseInput.includes('bye') || lowerCaseInput.includes('goodbye')) {
    return 'Goodbye! Have a great day.';
  }

  return "I'm sorry, I'm just a demo assistant with limited knowledge. For more complex questions, please check our FAQ page or contact support directly through the official channels.";
};

const suggestedQuestions = [
  'How do I report an issue?',
  'Can I track my complaint?',
  'What are your future plans?',
];

// SVG Icons for better UI
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.528l-.259-1.035a3.375 3.375 0 00-2.456-2.456L13.15 16.5l1.035-.259a3.375 3.375 0 002.456-2.456l.259-1.035.259 1.035a3.375 3.375 0 002.456 2.456l1.035.259-1.035.259a3.375 3.375 0 00-2.456 2.456l-.259 1.035z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-45" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const BotAvatar = () => (
    <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.528l-.259-1.035a3.375 3.375 0 00-2.456-2.456L13.15 16.5l1.035-.259a3.375 3.375 0 002.456-2.456l.259-1.035.259 1.035a3.375 3.375 0 002.456 2.456l1.035.259-1.035.259a3.375 3.375 0 00-2.456 2.456l-.259 1.035z" /></svg>
    </div>
);


const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! I am the AquaVolt assistant. How can I help you today?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isLoading) return;
    
    setShowSuggestions(false);
    
    const userMessage: Message = { text: textToSend, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    if(!messageText) {
        setInputValue('');
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const botResponseText = getBotResponse(textToSend);
      const botMessage: Message = { 
        text: botResponseText, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1200);
  };
  
  const handleSuggestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-5 w-80 sm:w-96 h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col transform-origin-bottom-right transition-all duration-300 ease-in-out z-50 ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-teal-600 to-cyan-700 dark:from-teal-800 dark:to-cyan-900 text-white p-4 rounded-t-2xl flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.528l-.259-1.035a3.375 3.375 0 00-2.456-2.456L13.15 16.5l1.035-.259a3.375 3.375 0 002.456-2.456l.259-1.035.259 1.035a3.375 3.375 0 002.456 2.456l1.035.259-1.035.259a3.375 3.375 0 00-2.456 2.456l-.259 1.035z" /></svg>
                </div>
                <div>
                    <h3 className="font-bold text-lg">AquaVolt Assistant</h3>
                    <p className="text-xs text-cyan-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Online
                    </p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-cyan-200 hover:text-white transition-colors" aria-label="Close chat">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        {/* Messages */}
        <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-900">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 animate-fade-in-up ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
               {msg.sender === 'bot' && <BotAvatar />}
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-emerald-600 dark:bg-emerald-500 text-white rounded-br-none shadow-md' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start animate-fade-in-up">
               <BotAvatar />
              <div className="bg-white dark:bg-slate-700 text-slate-800 p-3 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          )}
          {showSuggestions && (
              <div className="pt-4 animate-fade-in-up">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-2">Or click on a suggestion:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                      {suggestedQuestions.map((q, i) => (
                          <button 
                              key={i} 
                              onClick={() => handleSuggestionClick(q)} 
                              className="px-3 py-1.5 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                          >
                              {q}
                          </button>
                      ))}
                  </div>
              </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-colors duration-300">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="flex-1 w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            disabled={isLoading}
          />
          <button 
            onClick={() => handleSendMessage()} 
            disabled={isLoading || !inputValue.trim()} 
            className="flex-shrink-0 bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-all disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 active:scale-95"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>

      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-emerald-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-all duration-300 ease-in-out hover:scale-110 active:scale-100 z-50"
        aria-label="Toggle chatbot"
      >
        <div className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 transform rotate-45 scale-75' : 'opacity-100 transform rotate-0 scale-100'}`}>
            <ChatIcon />
        </div>
        <div className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 transform rotate-0 scale-100' : 'opacity-0 transform -rotate-45 scale-75'}`}>
            <CloseIcon />
        </div>
      </button>
    </>
  );
};

export default Chatbot;