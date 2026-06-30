/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Compass,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText
} from "lucide-react";
import { Fossil } from "../types";

interface FossilDetailModalProps {
  fossil: Fossil;
  onClose: () => void;
  darkMode: boolean;
  textClass: (size: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl") => string;
}

type TabType = "info" | "curiosidades" | "glossario" | "quiz";

export default function FossilDetailModal({ fossil, onClose, darkMode, textClass }: FossilDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("info");
  
  // Glossary state
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string | null>(
    fossil.glossary.length > 0 ? fossil.glossary[0].term : null
  );

  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<{ questionId: string; selected: string; correct: boolean }[]>([]);

  const handleAnswerSelect = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;

    const currentQuestion = fossil.quiz[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selected: selectedAnswer,
        correct: isCorrect,
      },
    ]);

    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);

    if (currentQuestionIndex + 1 < fossil.quiz.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setIsQuizCompleted(false);
    setAnswersHistory([]);
  };

  const getQuizFeedbackMessage = () => {
    const total = fossil.quiz.length;
    const pct = quizScore / total;

    if (pct === 1) {
      return {
        title: "Excelente trabalho, jovem paleontólogo!",
        desc: "Demonstraste conhecimentos profundos e dignos de um cientista de topo! Continua com essa curiosidade incrível.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10 border-emerald-500/30",
        icon: <Award className="h-10 w-10 text-emerald-500" />
      };
    } else if (pct >= 0.5) {
      return {
        title: "Continua a explorar o passado da Terra!",
        desc: "Fizeste um excelente percurso na exposição. Falhaste apenas alguns detalhes, mas estás no caminho certo!",
        color: "text-amber-500",
        bg: "bg-amber-500/10 border-amber-500/30",
        icon: <Sparkles className="h-10 w-10 text-amber-500" />
      };
    } else {
      return {
        title: "Boa tentativa! Revê a exposição e tenta novamente.",
        desc: "Cada erro é uma oportunidade para aprender! Clica em reiniciar para rever a matéria e melhorar o teu resultado.",
        color: "text-rose-500",
        bg: "bg-rose-500/10 border-rose-500/30",
        icon: <AlertTriangle className="h-10 w-10 text-rose-500" />
      };
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md bg-stone-950/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`relative w-full max-w-5xl rounded-3xl border-2 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] ${
          darkMode
            ? "bg-dark-panel border-dark-border text-dark-text"
            : "bg-warm-paper border-warm-border text-warm-text"
        }`}
      >
        {/* Close Button absolute */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 rounded-full p-2 border transition-all hover:scale-105 cursor-pointer ${
            darkMode
              ? "bg-dark-bg/80 border-dark-border text-dark-text hover:text-white"
              : "bg-white/90 border-warm-border text-warm-text hover:text-warm-accent"
          }`}
          aria-label="Fechar exposição do fóssil"
        >
          <X className="h-5 w-5" />
        </button>

        {/* LEFT COLUMN: Hero visual & Scientific Plaque */}
        <div className="w-full md:w-5/12 p-6 flex flex-col border-b md:border-b-0 md:border-r border-warm-border/60 dark:border-dark-border overflow-y-auto">
          <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-md bg-stone-950">
            <img
              src={fossil.imageUrl}
              alt={`Exemplar fóssil de ${fossil.name}`}
              className="h-full w-full object-cover"
            />
            {fossil.isCustom && (
              <span className="absolute bottom-3 left-3 rounded-md bg-warm-accent px-3 py-1 text-xs font-bold text-white shadow">
                Estudo por: {fossil.groupName || "Alunos"}
              </span>
            )}
          </div>

          {/* Plaque Title */}
          <div className="mt-5 space-y-1">
            <span className={`text-[10px] font-bold tracking-widest uppercase text-warm-accent block`}>
              {fossil.era} • {fossil.period || "Idade Desconhecida"}
            </span>
            <h2 id="modal-title" className={`font-serif font-bold ${textClass("3xl")} text-warm-text dark:text-warm-accent`}>
              {fossil.name}
            </h2>
          </div>

          {/* Scientific Specification Sheet */}
          <div
            className={`mt-6 p-4 rounded-xl border-2 space-y-3.5 ${
              darkMode ? "bg-dark-bg/60 border-dark-border" : "bg-warm-bg/40 border-warm-border/50"
            }`}
          >
            <h3 className={`font-sans font-bold uppercase tracking-wider text-[11px] ${
              darkMode ? "text-dark-sage" : "text-warm-sage"
            }`}>
              Ficha Científica
            </h3>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <Layers className="h-4 w-4 text-warm-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-400 block text-[10px] uppercase">Organismo Representado</span>
                  <span className="dark:text-dark-text">{fossil.organism}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Compass className="h-4 w-4 text-warm-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-400 block text-[10px] uppercase">Tipo de Fossilização</span>
                  <span className="dark:text-dark-text">{fossil.type}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-warm-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-400 block text-[10px] uppercase">Idade Aproximada</span>
                  <span className="dark:text-dark-text">{fossil.age}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-warm-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-400 block text-[10px] uppercase">Ambiente Original (Fácies)</span>
                  <span className="dark:text-dark-text">{fossil.environment}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-warm-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-400 block text-[10px] uppercase">Onde Encontrar em Portugal</span>
                  <span className="dark:text-dark-text">{fossil.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Tabs */}
        <div className="flex-1 p-6 flex flex-col overflow-y-auto">
          {/* Navigation tabs styled like museum drawers */}
          <div className="flex border-b border-warm-border dark:border-dark-border gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "info", label: "Descrição", icon: <FileText className="h-3.5 w-3.5" /> },
              { id: "curiosidades", label: "Curiosidades", icon: <Sparkles className="h-3.5 w-3.5" /> },
              { id: "glossario", label: "Glossário", icon: <BookOpen className="h-3.5 w-3.5" /> },
              { id: "quiz", label: `Desafio (${fossil.quiz.length} Qs)`, icon: <Award className="h-3.5 w-3.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-t-xl font-bold text-xs uppercase cursor-pointer transition-all tracking-wider whitespace-nowrap border-t border-x -mb-1.5 ${
                  activeTab === tab.id
                    ? darkMode
                      ? "bg-dark-panel border-dark-border text-warm-accent font-extrabold"
                      : "bg-warm-paper border-warm-border text-warm-text font-extrabold"
                    : "bg-transparent border-transparent text-stone-500 hover:text-warm-accent"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB CONTENTS */}
          <div className="flex-1 mt-6">
            <AnimatePresence mode="wait">
              {activeTab === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className={`font-serif font-bold ${textClass("lg")} text-warm-accent`}>
                      Descrição Científica Simples
                    </h3>
                    <p className={`text-stone-600 dark:text-dark-text/80 leading-relaxed ${textClass("sm")}`}>
                      {fossil.description}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl border border-dashed ${
                      darkMode ? "bg-dark-bg/40 border-dark-border" : "bg-warm-bg/30 border-warm-border"
                    }`}
                  >
                    <h4 className={`font-bold ${textClass("sm")} text-warm-accent mb-2`}>
                      Importância para a Paleontologia
                    </h4>
                    <p className={`text-stone-600 dark:text-dark-text/75 leading-relaxed ${textClass("sm")}`}>
                      {fossil.importance}
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "curiosidades" && (
                <motion.div
                  key="curiosidades"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <h3 className={`font-serif font-bold ${textClass("lg")} text-warm-accent`}>
                    Sabias que...?
                  </h3>
                  <div className="space-y-3">
                    {fossil.curiosities.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex gap-3 p-3.5 rounded-xl border ${
                          darkMode
                            ? "bg-dark-bg/50 border-dark-border hover:bg-dark-bg"
                            : "bg-white border-warm-border/50 hover:bg-warm-header/10"
                        }`}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warm-accent/10 text-warm-accent shrink-0">
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                        <p className={`text-stone-600 dark:text-dark-text/80 ${textClass("sm")} leading-relaxed`}>
                          {item}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "glossario" && (
                <motion.div
                  key="glossario"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <h3 className={`font-serif font-bold ${textClass("lg")} text-warm-accent`}>
                    Conceitos de Ciências Naturais
                  </h3>

                  <div className="flex flex-col md:flex-row gap-4 h-full min-h-[220px]">
                    {/* Terms index */}
                    <div className="w-full md:w-5/12 space-y-2">
                      {fossil.glossary.map((item) => (
                        <button
                          key={item.term}
                          onClick={() => setSelectedGlossaryTerm(item.term)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                            selectedGlossaryTerm === item.term
                              ? "bg-warm-accent border-warm-accent text-white font-extrabold shadow"
                              : darkMode
                              ? "bg-dark-bg/60 border-dark-border text-dark-text hover:bg-dark-panel"
                              : "bg-white border-warm-border text-warm-text hover:bg-warm-header/25"
                          }`}
                        >
                          {item.term}
                        </button>
                      ))}
                    </div>

                    {/* Definition pane */}
                    <div
                      className={`flex-1 p-5 rounded-xl border-2 flex flex-col justify-center ${
                        darkMode ? "bg-dark-bg/60 border-dark-border" : "bg-white border-warm-border/60"
                      }`}
                    >
                      {selectedGlossaryTerm ? (
                        <div className="space-y-2 animate-fadeIn">
                          <span className="text-[10px] font-bold text-warm-accent uppercase tracking-widest">
                            Definição de 7.º ano
                          </span>
                          <h4 className={`font-serif font-bold ${textClass("base")} text-warm-text dark:text-dark-text`}>
                            {selectedGlossaryTerm}
                          </h4>
                          <p className={`text-stone-550 dark:text-dark-sage ${textClass("xs")} leading-relaxed`}>
                            {fossil.glossary.find((item) => item.term === selectedGlossaryTerm)?.definition}
                          </p>
                        </div>
                      ) : (
                        <p className="text-stone-400 dark:text-dark-sage text-xs italic text-center">
                          Clica num termo para veres a definição.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "quiz" && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  {isQuizCompleted ? (
                    /* Final Score screen */
                    <div className={`p-6 rounded-2xl border-2 text-center space-y-4 ${getQuizFeedbackMessage().bg}`}>
                      <div className="flex justify-center">{getQuizFeedbackMessage().icon}</div>
                      <h3 className={`font-serif font-bold ${textClass("xl")} ${getQuizFeedbackMessage().color}`}>
                        {getQuizFeedbackMessage().title}
                      </h3>
                      <p className={`text-stone-600 dark:text-stone-300 max-w-md mx-auto ${textClass("xs")}`}>
                        {getQuizFeedbackMessage().desc}
                      </p>

                      <div className="py-2">
                        <span className="block text-[11px] font-bold tracking-wider uppercase text-stone-400">
                          Pontuação Final
                        </span>
                        <span className={`font-serif font-extrabold text-4xl ${getQuizFeedbackMessage().color}`}>
                          {quizScore} / {fossil.quiz.length}
                        </span>
                      </div>

                      <button
                        onClick={handleRestartQuiz}
                        className="inline-flex items-center gap-2 bg-warm-accent hover:bg-warm-accent/80 text-white font-bold px-5 py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Refazer Questionário</span>
                      </button>
                    </div>
                  ) : (
                    /* Active Question Screen */
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-400">
                        <span>
                          Pergunta {currentQuestionIndex + 1} de {fossil.quiz.length}
                        </span>
                        <span>Pontuação: {quizScore}</span>
                      </div>
                      <div className="w-full h-1.5 bg-warm-header dark:bg-dark-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-warm-accent transition-all duration-300"
                          style={{ width: `${((currentQuestionIndex + 1) / fossil.quiz.length) * 100}%` }}
                        />
                      </div>

                      <div className="space-y-3 mt-3">
                        <p className={`font-serif font-bold leading-snug ${textClass("base")}`}>
                          {fossil.quiz[currentQuestionIndex].questionText}
                        </p>

                        {/* Answers Choices */}
                        <div className="space-y-2 mt-2">
                          {fossil.quiz[currentQuestionIndex].type === "boolean" ? (
                            /* True/False Buttons */
                            <div className="grid grid-cols-2 gap-3">
                              {["True", "False"].map((option) => {
                                const label = option === "True" ? "Verdadeiro" : "Falso";
                                const isSelected = selectedAnswer === option;
                                return (
                                  <button
                                    key={option}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={isAnswerSubmitted}
                                    className={`py-3 px-4 rounded-xl border text-sm font-bold text-center transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-warm-accent border-warm-accent text-white font-extrabold"
                                        : darkMode
                                        ? "bg-dark-bg/60 border-dark-border hover:bg-dark-panel text-dark-text"
                                        : "bg-white border-warm-border hover:bg-warm-header/20 text-warm-text"
                                    } disabled:opacity-85`}
                                  >
                                    {label}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            /* Multiple Choice Options */
                            fossil.quiz[currentQuestionIndex].options?.map((option, idx) => {
                              const isSelected = selectedAnswer === option;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleAnswerSelect(option)}
                                  disabled={isAnswerSubmitted}
                                  className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-medium transition-all flex items-start gap-3 cursor-pointer ${
                                    isSelected
                                      ? "bg-warm-accent border-warm-accent text-white font-bold"
                                      : darkMode
                                      ? "bg-dark-bg/60 border-dark-border hover:bg-dark-panel text-dark-text"
                                      : "bg-white border-warm-border hover:bg-warm-header/20 text-warm-text"
                                  } disabled:opacity-85`}
                                >
                                  <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold border shrink-0 ${
                                      isSelected
                                        ? "bg-dark-panel text-warm-accent border-dark-panel"
                                        : "bg-stone-100 dark:bg-dark-bg text-stone-500 border-stone-300 dark:border-dark-border"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                  <span>{option}</span>
                                </button>
                              );
                            })
                          )}
                        </div>

                        {/* Immediate Feedback Block */}
                        {isAnswerSubmitted && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border flex items-start gap-3 mt-4 ${
                              selectedAnswer === fossil.quiz[currentQuestionIndex].correctAnswer
                                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/10 border-rose-500/25 text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <h5 className="font-bold text-xs">
                                {selectedAnswer === fossil.quiz[currentQuestionIndex].correctAnswer
                                  ? "Resposta Correta! 🌟"
                                  : "Ups! Resposta Errada. 📚"}
                              </h5>
                              <p className={`text-[11px] text-stone-600 dark:text-dark-text/75 leading-relaxed`}>
                                {fossil.quiz[currentQuestionIndex].explanation}
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Next/Submit Button */}
                        <div className="flex justify-end mt-4">
                          {!isAnswerSubmitted ? (
                            <button
                              onClick={handleSubmitAnswer}
                              disabled={!selectedAnswer}
                              className="bg-warm-accent hover:bg-warm-accent/85 disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                            >
                              <span>Confirmar Resposta</span>
                            </button>
                          ) : (
                            <button
                              onClick={handleNextQuestion}
                              className="bg-warm-accent hover:bg-warm-accent/85 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                            >
                              <span>
                                {currentQuestionIndex + 1 === fossil.quiz.length ? "Ver Resultados" : "Próxima Pergunta"}
                              </span>
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
