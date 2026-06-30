/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Save, Plus, Trash2, HelpCircle, Layers, Sparkles, AlertCircle } from "lucide-react";
import { Fossil, EraGeologica, TipoFossil, QuizQuestion } from "../types";

interface AddFossilModalProps {
  onClose: () => void;
  onSave: (newFossil: Fossil) => void;
  darkMode: boolean;
  textClass: (size: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl") => string;
}

const PRESET_IMAGES = [
  { name: "Ossos de Dinossauro", url: "https://images.unsplash.com/photo-1525857597365-5f6dbff2e36e?w=600&auto=format&fit=crop&q=80" },
  { name: "Cebola/Planta Antiga", url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80" },
  { name: "Concha Escura", url: "https://images.unsplash.com/photo-1599809275671-b5941cbf7f54?w=600&auto=format&fit=crop&q=80" },
  { name: "Âmbar Claro", url: "https://images.unsplash.com/photo-1596495578065-6e0763fa1141?w=600&auto=format&fit=crop&q=80" },
];

export default function AddFossilModal({ onClose, onSave, darkMode, textClass }: AddFossilModalProps) {
  // Group and Fossil details
  const [groupName, setGroupName] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [era, setEra] = useState<EraGeologica>(EraGeologica.MESOZOICO);
  const [period, setPeriod] = useState("");
  const [type, setType] = useState<TipoFossil>(TipoFossil.CORPORAL);
  const [organism, setOrganism] = useState("");
  const [age, setAge] = useState("");
  const [environment, setEnvironment] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState("");
  const [curiosity1, setCuriosity1] = useState("");
  const [curiosity2, setCuriosity2] = useState("");

  // Quiz questions state (exactly 3 questions requested)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: "custom_q1",
      type: "multiple",
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    },
    {
      id: "custom_q2",
      type: "boolean",
      questionText: "",
      correctAnswer: "True",
      explanation: "",
    },
    {
      id: "custom_q3",
      type: "multiple",
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    },
  ]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdateQuizText = (index: number, field: keyof QuizQuestion, value: any) => {
    setQuizQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleUpdateQuizOption = (qIdx: number, optIdx: number, val: string) => {
    setQuizQuestions((prev) => {
      const copy = [...prev];
      const opts = [...(copy[qIdx].options || ["", "", "", ""])];
      opts[optIdx] = val;
      copy[qIdx] = { ...copy[qIdx], options: opts };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // General Validation
    if (!groupName.trim()) return setErrorMsg("Por favor, introduz o Nome do vosso Grupo de Alunos.");
    if (!name.trim()) return setErrorMsg("Por favor, introduz o Nome do Fóssil.");
    if (!organism.trim()) return setErrorMsg("Por favor, especifica o Organismo representado.");
    if (!age.trim()) return setErrorMsg("Por favor, introduz a Idade aproximada (ex: '150 M.a.').");
    if (!environment.trim()) return setErrorMsg("Por favor, descreve o Ambiente em que viveu.");
    if (!description.trim()) return setErrorMsg("Por favor, escreve uma Descrição simples de 7.º ano.");
    if (!importance.trim()) return setErrorMsg("Por favor, indica a Importância do fóssil para compreender a história da Terra.");
    if (!curiosity1.trim() || !curiosity2.trim()) return setErrorMsg("Por favor, preenche ambas as Curiosidades científicas.");

    // Quiz Validation
    for (let i = 0; i < quizQuestions.length; i++) {
      const q = quizQuestions[i];
      if (!q.questionText.trim()) {
        return setErrorMsg(`Por favor, preenche o enunciado da Pergunta ${i + 1} do questionário.`);
      }
      if (q.type === "multiple") {
        const emptyOpt = q.options?.some((opt) => !opt.trim());
        if (emptyOpt) {
          return setErrorMsg(`Por favor, preenche as 4 opções de resposta para a Pergunta ${i + 1}.`);
        }
        if (!q.correctAnswer.trim()) {
          return setErrorMsg(`Por favor, define qual é a resposta correta para a Pergunta ${i + 1}.`);
        }
        if (!q.options?.includes(q.correctAnswer)) {
          return setErrorMsg(`A resposta correta da Pergunta ${i + 1} tem de coincidir exatamente com uma das 4 opções.`);
        }
      }
      if (!q.explanation.trim()) {
        return setErrorMsg(`Por favor, preenche a explicação científica para a Pergunta ${i + 1}.`);
      }
    }

    // Assemble the complete Fossil record
    const finalImage = customImageUrl.trim() ? customImageUrl : imageUrl;
    const curiositiesList = [curiosity1.trim(), curiosity2.trim()];

    // Generate basic glossary terms for custom fossils automatically
    const defaultGlossary = [
      { term: "Fóssil", definition: "Resto ou vestígio de organismo que ficou preservado nas rochas." },
      { term: type, definition: `Processo de fossilização do tipo ${type.toLowerCase()}.` },
    ];

    const newFossil: Fossil = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      groupName: groupName.trim(),
      imageUrl: finalImage,
      era,
      period: period.trim() || undefined,
      type,
      organism: organism.trim(),
      age: age.trim(),
      environment: environment.trim(),
      location: location.trim() || "Local desconhecido",
      description: description.trim(),
      curiosities: curiositiesList,
      importance: importance.trim(),
      glossary: defaultGlossary,
      quiz: quizQuestions,
      isCustom: true,
    };

    onSave(newFossil);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md bg-stone-950/70">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`relative w-full max-w-4xl rounded-3xl border-2 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          darkMode
            ? "bg-dark-panel border-dark-border text-dark-text"
            : "bg-warm-paper border-warm-border text-warm-text"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            darkMode ? "bg-dark-bg border-dark-border" : "bg-warm-header text-warm-text border-warm-border"
          }`}
        >
          <div>
            <h3 className={`font-serif font-bold ${textClass("xl")}`}>Adicionar Nova Apresentação</h3>
            <p className="text-[11px] opacity-85">Criação colaborativa para os grupos de alunos do 7.º ano</p>
          </div>
          <button
            onClick={onClose}
            className={`rounded-full p-1.5 border hover:scale-105 cursor-pointer ${
              darkMode ? "bg-dark-bg border-dark-border text-stone-300" : "bg-white text-warm-text border-warm-border"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Identificação */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-warm-accent flex items-center gap-1.5 border-b border-warm-border dark:border-dark-border pb-1">
              <Layers className="h-4 w-4" />
              <span>1. Identificação Geral</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Nome do Vosso Grupo (Alunos)</label>
                <input
                  type="text"
                  placeholder="Ex: Grupo 3 - As Trilobites de Canelas"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Nome do Fóssil</label>
                <input
                  type="text"
                  placeholder="Ex: Dente de Carcharocles megalodon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Detalhes Científicos */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-warm-accent flex items-center gap-1.5 border-b border-warm-border dark:border-dark-border pb-1">
              <Layers className="h-4 w-4" />
              <span>2. Caracterização Científica</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Era Geológica</label>
                <select
                  value={era}
                  onChange={(e) => setEra(e.target.value as EraGeologica)}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                >
                  <option value={EraGeologica.PALEOZOICO}>{EraGeologica.PALEOZOICO}</option>
                  <option value={EraGeologica.MESOZOICO}>{EraGeologica.MESOZOICO}</option>
                  <option value={EraGeologica.CENOZOICO}>{EraGeologica.CENOZOICO}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Período Geológico</label>
                <input
                  type="text"
                  placeholder="Ex: Jurássico Superior"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Tipo de Fóssil</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TipoFossil)}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                >
                  <option value={TipoFossil.CORPORAL}>{TipoFossil.CORPORAL}</option>
                  <option value={TipoFossil.VESTIGIO}>{TipoFossil.VESTIGIO}</option>
                  <option value={TipoFossil.MOLDE}>{TipoFossil.MOLDE}</option>
                  <option value={TipoFossil.IMPRESSAO}>{TipoFossil.IMPRESSAO}</option>
                  <option value={TipoFossil.MINERALIZACAO}>{TipoFossil.MINERALIZACAO}</option>
                  <option value={TipoFossil.AMBAR}>{TipoFossil.AMBAR}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Organismo Representado</label>
                <input
                  type="text"
                  placeholder="Ex: Dinossauro Carnívoro"
                  value={organism}
                  onChange={(e) => setOrganism(e.target.value)}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Idade Aproximada</label>
                <input
                  type="text"
                  placeholder="Ex: Cerca de 150 M.a."
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Ambiente de Vida (Fácies)</label>
                <input
                  type="text"
                  placeholder="Ex: Marinho costeiro raso e tropical"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Local onde pode ser encontrado</label>
                <input
                  type="text"
                  placeholder="Ex: Cabo Mondego, Figueira da Foz"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Descrição Simples (para 7.º ano)</label>
                <textarea
                  placeholder="Explica de forma simples e científica como era este fóssil e as suas características principais..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Importância do Fóssil para a Ciência</label>
                <textarea
                  placeholder="De que forma este fóssil ajuda os geólogos a compreenderem a história da Terra (datação, clima antigo, etc.)?"
                  value={importance}
                  onChange={(e) => setImportance(e.target.value)}
                  rows={4}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Imagem & Curiosidades */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-warm-accent flex items-center gap-1.5 border-b border-warm-border dark:border-dark-border pb-1">
              <Sparkles className="h-4 w-4" />
              <span>3. Imagens e Curiosidades</span>
            </h4>

            {/* Curiosidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Curiosidade Científica 1</label>
                <input
                  type="text"
                  placeholder="Ex: Sabias que as trilobites podiam enrolar-se como bicho-da-conta?"
                  value={curiosity1}
                  onChange={(e) => setCuriosity1(e.target.value)}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Curiosidade Científica 2</label>
                <input
                  type="text"
                  placeholder="Ex: Este organismo podia mudar de pele para crescer..."
                  value={curiosity2}
                  onChange={(e) => setCuriosity2(e.target.value)}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Images selection presets */}
            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-2">Imagem Ilustrativa</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_IMAGES.map((img) => {
                  const isSelected = imageUrl === img.url && !customImageUrl;
                  return (
                    <button
                      key={img.name}
                      type="button"
                      onClick={() => {
                        setImageUrl(img.url);
                        setCustomImageUrl("");
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-video border-2 cursor-pointer transition-all ${
                        isSelected ? "border-warm-accent ring-2 ring-warm-accent/30" : "border-warm-border/50 dark:border-dark-border opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                      <span className="absolute bottom-1 left-1.5 text-[9px] bg-stone-900/85 text-white px-1.5 py-0.5 rounded font-bold">
                        {img.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Image input link */}
              <div className="mt-3">
                <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Ou introduz o link (URL) da tua imagem:</label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/fossil.jpg"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 border outline-none ${
                    darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Quiz final por grupo */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-warm-accent flex items-center gap-1.5 border-b border-warm-border dark:border-dark-border pb-1">
              <HelpCircle className="h-4 w-4" />
              <span>4. Construção do Questionário (3 Perguntas)</span>
            </h4>

            {quizQuestions.map((q, idx) => (
              <div
                key={q.id}
                className={`p-4 rounded-xl border-2 space-y-3.5 ${
                  darkMode ? "bg-dark-bg/40 border-dark-border" : "bg-white border-warm-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-warm-accent uppercase tracking-widest">
                    Pergunta {idx + 1} ({q.type === "multiple" ? "Escolha Múltipla" : "Verdadeiro / Falso"})
                  </span>
                  <select
                    value={q.type}
                    onChange={(e) => {
                      const typeVal = e.target.value as "multiple" | "boolean";
                      handleUpdateQuizText(idx, "type", typeVal);
                      handleUpdateQuizText(idx, "correctAnswer", typeVal === "boolean" ? "True" : "");
                    }}
                    className={`text-[10px] font-bold uppercase rounded-lg px-2 py-1 border ${
                      darkMode ? "bg-dark-bg border-dark-border text-white" : "bg-white border-warm-border text-warm-text"
                    }`}
                  >
                    <option value="multiple">Escolha Múltipla</option>
                    <option value="boolean">Verdadeiro / Falso</option>
                  </select>
                </div>

                {/* Enunciado */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Enunciado da Pergunta</label>
                  <input
                    type="text"
                    placeholder={`Ex: Qual o tipo de fossilização representado pelo fóssil da pergunta ${idx + 1}?`}
                    value={q.questionText}
                    onChange={(e) => handleUpdateQuizText(idx, "questionText", e.target.value)}
                    className={`w-full text-xs rounded-xl px-3 py-2 border outline-none ${
                      darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                    }`}
                    required
                  />
                </div>

                {q.type === "multiple" ? (
                  /* Multiple choices fields */
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-stone-400">Opções de Resposta</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[0, 1, 2, 3].map((optIdx) => (
                        <div key={optIdx} className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-warm-accent shrink-0">
                            {String.fromCharCode(65 + optIdx)}:
                          </span>
                          <input
                            type="text"
                            placeholder={`Opção ${String.fromCharCode(65 + optIdx)}`}
                            value={q.options?.[optIdx] || ""}
                            onChange={(e) => handleUpdateQuizOption(idx, optIdx, e.target.value)}
                            className={`w-full text-xs rounded-lg px-2.5 py-1.5 border outline-none ${
                              darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                            }`}
                            required={q.type === "multiple"}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Correct answer picker */}
                    <div className="pt-2">
                      <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Qual é a Opção Correta?</label>
                      <select
                        value={q.correctAnswer}
                        onChange={(e) => handleUpdateQuizText(idx, "correctAnswer", e.target.value)}
                        className={`text-xs rounded-lg px-3 py-1.5 border outline-none ${
                          darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                        }`}
                        required={q.type === "multiple"}
                      >
                        <option value="">-- Seleciona a opção correta --</option>
                        {q.options?.map((opt, oIdx) => (
                          <option key={oIdx} value={opt} disabled={!opt.trim()}>
                            {opt.trim() ? `${String.fromCharCode(65 + oIdx)}: ${opt}` : `Opção ${String.fromCharCode(65 + oIdx)} por preencher`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  /* Boolean picker */
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Qual é a Resposta Correta?</label>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) => handleUpdateQuizText(idx, "correctAnswer", e.target.value)}
                      className={`text-xs rounded-lg px-3 py-1.5 border outline-none ${
                        darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                      }`}
                    >
                      <option value="True">Verdadeiro</option>
                      <option value="False">Falso</option>
                    </select>
                  </div>
                )}

                {/* Explanation */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Explicação Científica (Feedback de correção)</label>
                  <input
                    type="text"
                    placeholder="Explica o porquê desta resposta correta de acordo com a matéria do 7.º ano..."
                    value={q.explanation}
                    onChange={(e) => handleUpdateQuizText(idx, "explanation", e.target.value)}
                    className={`w-full text-xs rounded-xl px-3 py-2 border outline-none ${
                      darkMode ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent" : "bg-white border-warm-border text-warm-text focus:border-warm-accent"
                    }`}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-warm-border dark:border-dark-border">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all border ${
                darkMode
                  ? "bg-transparent border-dark-border text-stone-400 hover:text-white"
                  : "bg-white border-warm-border text-stone-500 hover:text-warm-accent"
              }`}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-warm-accent hover:bg-warm-accent/85 text-white font-bold px-6 py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Apresentação</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
