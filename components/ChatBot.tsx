import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Send, AudioWaveform, Mic, RotateCcw, ChevronDown, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { GenerateContentResponse } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { sendMessageStream } from '../services/geminiService';
import { ShiftVoiceClient } from '../services/liveService';
import { ChatMessage, ViewType } from '../types';
import BrandLogo from './BrandLogo';

interface ChatBotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  showTrigger?: boolean;
  currentView?: ViewType;
  onNavigate?: (view: ViewType) => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'model',
  text: '¡Hola! Soy Shifty, tu asistente de marca. Preguntame sobre colores, uso de logo o filosofía de la marca.'
};

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, setIsOpen, showTrigger = true, currentView, onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const voiceClientRef = useRef<ShiftVoiceClient | null>(null);
  const dragControls = useDragControls();

  // Handle deep linking navigation
  const handleDeepLink = (href: string) => {
    if (href.startsWith('shift://') && onNavigate) {
      const view = href.replace('shift://', '') as ViewType;
      onNavigate(view);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    } else {
      window.open(href, '_blank');
    }
  };

  // Start a new chat session
  const startNewChat = () => {
    setMessages([{
      ...INITIAL_MESSAGE,
      id: `welcome-${Date.now()}`,
      text: '¡Nuevo chat iniciado! ¿En qué te puedo ayudar con la marca Shift?'
    }]);
    setInput('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isVoiceMode) scrollToBottom();
  }, [messages, isOpen, isVoiceMode]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Clean up voice session on close
  useEffect(() => {
    if (!isOpen && isVoiceMode) {
      toggleVoiceMode();
    }
  }, [isOpen]);

  const toggleVoiceMode = async () => {
    if (isVoiceMode) {
      // Turn off
      voiceClientRef.current?.disconnect();
      voiceClientRef.current = null;
      setIsVoiceMode(false);
      setIsSpeaking(false);
    } else {
      // Turn on
      setIsVoiceMode(true);
      voiceClientRef.current = new ShiftVoiceClient();
      await voiceClientRef.current.connect(
        (speaking) => setIsSpeaking(speaking), // Speaking state callback
        () => { // Disconnect callback
          setIsVoiceMode(false);
          setIsSpeaking(false);
          voiceClientRef.current = null;
        }
      );
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseStream = await sendMessageStream(userMsg.text);

      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        isStreaming: true
      }]);

      let fullText = '';

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        const newText = c.text || '';
        fullText += newText;

        setMessages(prev => prev.map(msg =>
          msg.id === botMsgId
            ? { ...msg, text: fullText }
            : msg
        ));
      }

      setMessages(prev => prev.map(msg =>
        msg.id === botMsgId
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Tengo problemas conectando con el campo de resonancia. Por favor verificá tu API key o intentá más tarde."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Liquid Glass Trigger Button */}
      <AnimatePresence>
        {showTrigger && !isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-6 right-6 z-50 lg:hidden"
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              className="group flex items-center justify-center p-3 h-12 rounded-full backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(255,0,255,0.2)] bg-gradient-to-br from-[#FF00FF]/30 to-[#FF00FF]/10 hover:bg-[#FF00FF]/20 hover:border-[#FF00FF]/50 hover:shadow-[0_8px_32px_rgba(255,0,255,0.4)] transition-all duration-300 overflow-hidden"
              whileHover="hover"
              initial="initial"
            >
              <motion.div
                className="relative z-10"
                variants={{
                  initial: { rotate: 0 },
                  hover: { rotate: 15, scale: 1.1 }
                }}
              >
                <BrandLogo variant="white" showText={false} scale={1} />
              </motion.div>

              <motion.span
                variants={{
                  initial: { width: 0, opacity: 0, paddingLeft: 0 },
                  hover: { width: "auto", opacity: 1, paddingLeft: 12 }
                }}
                className="font-medium text-white whitespace-nowrap overflow-hidden drop-shadow-sm"
              >
                Asistente Shifty
              </motion.span>

              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window - Fullscreen on mobile, modal on desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: "100%" }}
            animate={{
              opacity: 1,
              y: 0,
              background: isVoiceMode
                ? "linear-gradient(135deg, #00235E 0%, #1534dc 50%, #FF00FF 100%)"
                : "rgba(0, 16, 48, 0.85)"
            }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 md:inset-auto md:top-20 md:right-6 md:bottom-auto md:left-auto z-50 md:w-[400px] md:h-[650px] md:max-h-[80vh] flex flex-col overflow-hidden md:rounded-[2.5rem] md:border md:border-white/30 backdrop-blur-3xl md:shadow-[0_0_50px_-10px_rgba(255,0,255,0.4)] transition-colors duration-700"
          >
            {/* Decorative internal glows for liquid effect - Hidden in Voice Mode for clean gradient */}
            {!isVoiceMode && (
              <>
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-secondary/30 rounded-full blur-[80px] pointer-events-none opacity-60" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/30 rounded-full blur-[80px] pointer-events-none opacity-60" />
              </>
            )}

            {/* Header - Safe area aware on mobile */}
            <div className="relative z-10 p-4 pt-safe md:p-5 flex items-center justify-between text-white shrink-0 border-b border-white/10">
              {/* Mobile Close Handle */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/30 md:hidden" />

              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <motion.div
                  className="drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]"
                  whileTap={{ scale: 0.9 }}
                >
                  <BrandLogo variant="white" showText={false} scale={1} />
                </motion.div>
                <div>
                  <h3 className="font-bold text-base tracking-wide text-white drop-shadow-md">Shifty</h3>
                  <div className="flex items-center gap-1.5">
                    {isVoiceMode && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                    <p className="text-[11px] text-white/70 font-medium uppercase tracking-wider">
                      {isVoiceMode ? 'Live Resonance' : 'Asistente de Marca'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-2 md:mt-0">
                {/* New Chat Button */}
                <motion.button
                  onClick={startNewChat}
                  whileTap={{ scale: 0.9, rotate: -180 }}
                  className="p-2.5 hover:bg-white/10 rounded-full transition-colors group"
                  title="Nuevo Chat"
                >
                  <RotateCcw size={18} className="text-white/70 group-hover:text-white transition-colors" />
                </motion.button>

                {/* Voice Toggle Button */}
                <motion.button
                  onClick={toggleVoiceMode}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2.5 rounded-full transition-all duration-300 ${isVoiceMode
                    ? 'bg-white text-secondary hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                    }`}
                  title={isVoiceMode ? "Salir de Modo Voz" : "Activar Modo Voz"}
                >
                  {isVoiceMode ? <AudioWaveform size={18} className="animate-pulse" /> : <Mic size={18} />}
                </motion.button>

                <div className="w-px h-5 bg-white/20 mx-1" />

                {/* Close - Shows chevron on mobile, X on desktop */}
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 hover:bg-white/10 rounded-full transition-colors group"
                >
                  <ChevronDown size={20} className="text-white/70 group-hover:text-white md:hidden" />
                  <X size={20} className="text-white/70 group-hover:text-white hidden md:block" />
                </motion.button>
              </div>
            </div>

            {/* Main Content Area */}
            {isVoiceMode ? (
              // --- VOICE MODE UI ---
              <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-white p-8 text-center">

                {/* Visualizer Orb */}
                <div className="relative w-40 h-40 mb-12 flex items-center justify-center">
                  {/* Core */}
                  <motion.div
                    animate={{
                      scale: isSpeaking ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.6)] z-20 flex items-center justify-center"
                  >
                    <BrandLogo variant="color" showText={false} className="scale-125 opacity-80" scale={1} />
                  </motion.div>

                  {/* Ripples */}
                  <motion.div
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 border-2 border-white/30 rounded-full z-10"
                  />
                  <motion.div
                    animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 border border-white/20 rounded-full z-10"
                  />
                  {isSpeaking && (
                    <motion.div
                      animate={{ scale: [1.2, 3], opacity: [0.6, 0] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 bg-secondary/20 rounded-full z-0 blur-md"
                    />
                  )}
                </div>

                <h4 className="text-2xl font-bold mb-2 tracking-tight">Escuchando...</h4>
                <p className="text-white/60 text-sm max-w-[200px]">
                  Hablame naturalmente. Estoy conectado al sistema de marca.
                </p>

                <div className="mt-12 flex gap-4">
                  <button
                    onClick={toggleVoiceMode}
                    className="px-6 py-2 rounded-full border border-white/30 text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // --- TEXT MODE UI ---
              <>
                <div className="relative z-10 flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'model' && (
                        <div className="shrink-0 mb-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                          <BrandLogo variant="white" showText={false} className="opacity-90" scale={1} />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-md shadow-sm border ${msg.role === 'user'
                          ? 'bg-gradient-to-br from-secondary to-[#D900D9] text-white border-white/20 rounded-br-none shadow-[0_4px_15px_rgba(255,0,255,0.3)]'
                          : 'bg-white/10 text-white/90 border-white/10 rounded-bl-none shadow-[0_4px_15px_rgba(0,0,0,0.1)]'
                          }`}
                      >
                        {msg.role === 'model' ? (
                          <div className="markdown prose prose-sm max-w-none dark:prose-invert prose-p:text-white/90 prose-headings:text-white prose-strong:text-white prose-code:text-white/90">
                            <ReactMarkdown
                              components={{
                                a: ({ node, href, children, ...props }) => {
                                  const isInternal = href?.startsWith('shift://');

                                  if (isInternal) {
                                    return (
                                      <button
                                        onClick={() => href && handleDeepLink(href)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 my-1 rounded-full bg-secondary/80 hover:bg-secondary text-white font-bold text-xs transition-colors shadow-sm cursor-pointer border border-white/20 select-none group/btn"
                                      >
                                        <Sparkles size={10} className="text-white/80" />
                                        {children}
                                        <ArrowRight size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                      </button>
                                    );
                                  }

                                  return (
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-secondary font-bold hover:underline inline-flex items-center gap-0.5"
                                      {...props}
                                    >
                                      {children}
                                      <ExternalLink size={10} />
                                    </a>
                                  );
                                }
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start items-end gap-3">
                      <div className="shrink-0 mb-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                        <BrandLogo variant="white" showText={false} className="opacity-90" scale={1} />
                      </div>
                      <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl rounded-bl-none border border-white/10 flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="relative z-10 p-5 pt-2 shrink-0">
                  <div className="flex items-center gap-2 bg-black/20 backdrop-blur-xl rounded-full p-1.5 pr-2 border border-white/10 focus-within:border-white/30 focus-within:bg-black/30 transition-all shadow-inner">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Preguntá sobre las guías de marca..."
                      className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-white placeholder:text-white/40"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="p-2.5 bg-secondary text-white rounded-full hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,0,255,0.4)]"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-[10px] text-white/30 font-medium tracking-widest uppercase">Shifty AI</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;