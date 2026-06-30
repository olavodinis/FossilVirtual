/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, HelpCircle, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";

interface PaleoBotProps {
  darkMode: boolean;
  textClass: (size: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl") => string;
}

export default function PaleoBot({ darkMode, textClass }: PaleoBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Olá, jovem paleontólogo! Eu sou o PaleoBot 🦕. Estou pronto para ajudar-te a desvendar os segredos do passado da Terra. Podes perguntar-me sobre fósseis, fossilização, eras geológicas ou extinções!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Package the chat history to pass to our server endpoint
      const payloadMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!response.ok) {
        throw new Error("Falha ao comunicar com o PaleoBot");
      }

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error calling PaleoBot API:", error);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: "Oops! Tive um pequeno precalço nas minhas escavações no servidor. Podias repetir a tua pergunta, por favor?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const quickQuestions = [
    "O que é um fóssil?",
    "Como se forma uma amonite fossilizada?",
    "Qual é a diferença entre fóssil corporal e icnofóssil?",
    "Em que era viveram os dinossauros?",
    "Porque é que os fósseis são importantes?",
  ];

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        id="paleobot-toggle-btn"
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-2xl transition-all cursor-pointer ${
          darkMode
            ? "bg-warm-accent border-warm-accent text-white hover:bg-warm-accent/85"
            : "bg-warm-accent border-warm-accent text-white hover:bg-warm-accent/85"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Abrir assistente educativo PaleoBot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <MessageSquare className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="paleobot-chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-24 right-6 z-50 flex h-[500px] w-[360px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border-2 shadow-2xl overflow-hidden ${
              darkMode
                ? "bg-dark-bg border-dark-border text-stone-100"
                : "bg-warm-bg/95 border-warm-border text-warm-text"
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between px-4 py-3 border-b ${
                darkMode
                  ? "bg-stone-950 border-dark-border"
                  : "bg-warm-accent text-white border-warm-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <h3 className={`font-bold font-serif ${textClass("base")}`}>PaleoBot 🦕</h3>
                  <p className={`text-[10px] opacity-80`}>Assistente de Geologia (7.º Ano)</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`rounded p-1 transition-colors ${
                  darkMode ? "hover:bg-stone-800 text-stone-400" : "hover:bg-white/10 text-white"
                }`}
                aria-label="Minimizar chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isBot = msg.role === "model";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${isBot ? "self-start mr-auto" : "self-end ml-auto items-end"}`}
                  >
                    <div
                      className={`rounded-2xl px-3 py-2 ${textClass("sm")} leading-relaxed shadow-sm ${
                        isBot
                          ? darkMode
                            ? "bg-stone-850 text-stone-100 border border-dark-border rounded-tl-none"
                            : "bg-white text-warm-text border border-warm-border/50 rounded-tl-none"
                          : darkMode
                          ? "bg-warm-accent text-white font-medium rounded-tr-none"
                          : "bg-warm-accent text-white rounded-tr-none"
                      }`}
                    >
                      {msg.text.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-1" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>
                    <span className="text-[9px] text-stone-500 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-stone-500 mr-auto max-w-[85%]">
                  <div className="flex space-x-1 items-center bg-stone-100 dark:bg-stone-800 px-3 py-2 rounded-2xl border dark:border-stone-700">
                    <span className="w-2 h-2 rounded-full bg-warm-accent animate-bounce delay-100"></span>
                    <span className="w-2 h-2 rounded-full bg-warm-accent animate-bounce delay-200"></span>
                    <span className="w-2 h-2 rounded-full bg-warm-accent animate-bounce delay-300"></span>
                  </div>
                  <span className="text-[10px]">PaleoBot está a escavar...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Block */}
            <div
              className={`px-3 py-2 border-t overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 ${
                darkMode ? "bg-stone-950/50 border-dark-border" : "bg-warm-bg/40 border-warm-border"
              }`}
            >
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  disabled={isLoading}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full border transition-all cursor-pointer whitespace-normal break-words max-w-[200px] text-left ${
                    darkMode
                      ? "bg-stone-800 hover:bg-stone-700 text-stone-300 border-dark-border hover:border-warm-accent"
                      : "bg-white hover:bg-warm-bg text-warm-text border-warm-border hover:border-warm-accent"
                  } disabled:opacity-50`}
                >
                  <HelpCircle className="h-3 w-3 text-warm-accent flex-shrink-0" />
                  <span>{q}</span>
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className={`p-3 border-t flex gap-2 items-center ${
                darkMode ? "bg-stone-950 border-dark-border" : "bg-white border-warm-border"
              }`}
            >
              <input
                id="paleobot-message-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Pergunta-me sobre fósseis..."
                disabled={isLoading}
                className={`flex-1 rounded-xl px-3 py-2 text-xs border outline-none transition-all ${
                  darkMode
                    ? "bg-stone-800 border-stone-700 text-white focus:border-warm-accent"
                    : "bg-warm-bg/45 border-warm-border text-warm-text focus:border-warm-accent focus:bg-white"
                } disabled:opacity-50`}
              />
              <button
                id="paleobot-send-btn"
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className={`rounded-xl p-2 cursor-pointer transition-all ${
                  darkMode
                    ? "bg-warm-accent hover:bg-warm-accent/85 text-white disabled:bg-stone-800 disabled:text-stone-600"
                    : "bg-warm-accent hover:bg-warm-accent/85 text-white disabled:bg-stone-100 disabled:text-stone-400"
                }`}
                aria-label="Enviar mensagem"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
