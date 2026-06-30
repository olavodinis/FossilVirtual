/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Moon,
  Type,
  PlusCircle,
  Search,
  BookOpen,
  Filter,
  Compass,
  FileText,
  User,
  Heart,
  Landmark
} from "lucide-react";
import { Fossil, EraGeologica } from "./types";
import { initialFossils } from "./data/initialFossils";
import FossilCard from "./components/FossilCard";
import FossilDetailModal from "./components/FossilDetailModal";
import AddFossilModal from "./components/AddFossilModal";
import PaleoBot from "./components/PaleoBot";

export default function App() {
  // Theme state (default dark for paleontological deep atmosphere, toggleable)
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // Font size scale state (1 = normal, 2 = large, 3 = extra large)
  const [fontSizeStep, setFontSizeStep] = useState<number>(1);

  // Fossils state (defaults + custom ones from localStorage)
  const [fossils, setFossils] = useState<Fossil[]>([]);
  const [filterEra, setFilterEra] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals active states
  const [selectedFossil, setSelectedFossil] = useState<Fossil | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Load fossils on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("virtual_museum_fossils");
      if (stored) {
        const customFossils = JSON.parse(stored);
        setFossils([...initialFossils, ...customFossils]);
      } else {
        setFossils(initialFossils);
      }
    } catch (e) {
      console.error("Erro a ler localStorage:", e);
      setFossils(initialFossils);
    }
  }, []);

  // Save new custom fossil
  const handleSaveCustomFossil = (newFossil: Fossil) => {
    try {
      const stored = localStorage.getItem("virtual_museum_fossils");
      let customList: Fossil[] = [];
      if (stored) {
        customList = JSON.parse(stored);
      }
      customList.push(newFossil);
      localStorage.setItem("virtual_museum_fossils", JSON.stringify(customList));

      // Append to local state
      setFossils((prev) => [...prev, newFossil]);
      setIsAddModalOpen(false);

      // Scroll to newly added card
      setTimeout(() => {
        const elem = document.getElementById(`fossil-card-${newFossil.id}`);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200);
    } catch (e) {
      console.error("Erro a gravar novo fóssil:", e);
    }
  };

  // Delete/Clear custom fossils if requested (bonus utility for easy resets)
  const handleResetCatalog = () => {
    if (window.confirm("Tem a certeza que deseja repor o catálogo e remover todas as apresentações criadas pelos alunos?")) {
      localStorage.removeItem("virtual_museum_fossils");
      setFossils(initialFossils);
    }
  };

  // Dynamic Font Size Class Generator
  const textClass = (size: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl") => {
    const scales: Record<string, string[]> = {
      xs: ["text-xs", "text-sm", "text-base"],
      sm: ["text-sm", "text-base", "text-lg"],
      base: ["text-base", "text-lg", "text-xl"],
      lg: ["text-lg", "text-xl", "text-2xl"],
      xl: ["text-xl", "text-2xl", "text-3xl"],
      "2xl": ["text-2xl", "text-3xl", "text-4xl"],
      "3xl": ["text-3xl", "text-4xl", "text-5xl"],
      "4xl": ["text-4xl", "text-5xl", "text-6xl"],
    };

    const steps = scales[size];
    if (!steps) return "text-base";
    return steps[fontSizeStep - 1] || steps[0];
  };

  // Filter and search
  const filteredFossils = fossils.filter((f) => {
    const matchesEra = filterEra === "todos" || f.era === filterEra;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      f.name.toLowerCase().includes(searchLower) ||
      f.organism.toLowerCase().includes(searchLower) ||
      f.type.toLowerCase().includes(searchLower) ||
      (f.groupName && f.groupName.toLowerCase().includes(searchLower));
    return matchesEra && matchesSearch;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans flex flex-col ${
        darkMode
          ? "bg-dark-bg text-dark-text selection:bg-warm-accent selection:text-dark-bg"
          : "bg-warm-bg text-warm-text selection:bg-warm-accent selection:text-warm-text"
      }`}
    >
      {/* Subtle warm environmental gradient banner */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-b from-warm-accent/5 to-transparent pointer-events-none" />

      {/* ACCESSIBILITY & UTILITIES HEADER BAR */}
      <nav
        id="top-navbar"
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
          darkMode ? "bg-dark-panel/90 border-dark-border" : "bg-warm-header/90 border-warm-border"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warm-accent text-white font-bold shadow-md">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <span className={`font-serif font-extrabold tracking-tight ${textClass("base")} text-warm-accent`}>
                FóssilVirtual
              </span>
              <span className={`hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest ml-2 ${
                darkMode ? "text-dark-sage" : "text-warm-sage"
              }`}>
                Ciências Naturais • 7.º Ano
              </span>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="flex items-center gap-2">
            {/* Font size controller */}
            <button
              onClick={() => setFontSizeStep((prev) => (prev % 3) + 1)}
              className={`rounded-xl p-2.5 border transition-all cursor-pointer flex items-center gap-1.5 ${
                darkMode
                  ? "bg-dark-panel border-dark-border text-dark-text hover:text-white"
                  : "bg-white border-warm-border text-warm-text hover:bg-warm-header/40"
              }`}
              title="Mudar tamanho de letra"
              aria-label="Alternar tamanho da fonte"
            >
              <Type className="h-4 w-4" />
              <span className="text-[10px] font-bold">
                {fontSizeStep === 1 ? "A" : fontSizeStep === 2 ? "A+" : "A++"}
              </span>
            </button>

            {/* Dark/Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-xl p-2.5 border transition-all cursor-pointer ${
                darkMode
                  ? "bg-dark-panel border-dark-border text-warm-accent hover:text-amber-400"
                  : "bg-white border-warm-border text-warm-text hover:bg-warm-header/40"
              }`}
              title={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
              aria-label="Alternar tema de cores"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Add fossil trigger button (high emphasis) */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-warm-accent hover:bg-warm-accent/80 text-white font-extrabold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO INTRODUCTION SECTION */}
      <header className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-warm-accent bg-warm-accent/5 border-warm-accent/20">
            <Compass className="h-3 w-3" />
            <span>Exposição interativa colaborativa</span>
          </div>
          <h1 className={`font-serif font-extrabold tracking-tight leading-none ${textClass("4xl")} ${
            darkMode ? "text-dark-text" : "text-warm-text"
          }`}>
            Museu Virtual de Fósseis
          </h1>
          <p className={`font-serif font-medium italic ${textClass("lg")} ${
            darkMode ? "text-dark-sage" : "text-warm-sage"
          }`}>
            “Uma viagem interativa pela história da vida na Terra”
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`max-w-2xl mx-auto p-5 rounded-2xl border-2 leading-relaxed text-center ${
            darkMode ? "bg-dark-panel/60 border-dark-border text-dark-text" : "bg-white border-warm-border/50 text-warm-text"
          } ${textClass("sm")}`}
        >
          Este museu virtual foi desenhado para os alunos do <strong>7.º ano</strong> na disciplina de
          {" "}<strong>Ciências Naturais</strong>. Cada grupo de alunos pode explorar os exemplares paleontológicos
          e adicionar as suas próprias apresentações digitais e questionários sobre fósseis.
          Estuda as eras geológicas, joga os mini-quizzes e esclarece as tuas dúvidas com o nosso assistente digital <strong>PaleoBot</strong>!
        </motion.div>
      </header>

      {/* CONTROLS, SEARCH, AND FILTERS PANEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div
          className={`p-4 rounded-2xl border-2 flex flex-col md:flex-row gap-4 items-center justify-between ${
            darkMode ? "bg-dark-panel/50 border-dark-border" : "bg-white border-warm-border/50"
          }`}
        >
          {/* Era filter switches */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className={`text-[10px] font-bold uppercase tracking-widest mr-2 flex items-center gap-1 ${
              darkMode ? "text-dark-sage" : "text-warm-sage"
            }`}>
              <Filter className="h-3 w-3" />
              <span>Filtrar Era:</span>
            </span>

            {[
              { id: "todos", label: "Ver Todos" },
              { id: EraGeologica.PALEOZOICO, label: "Paleozoico" },
              { id: EraGeologica.MESOZOICO, label: "Mesozoico" },
              { id: EraGeologica.CENOZOICO, label: "Cenozoico" },
            ].map((eraTab) => (
              <button
                key={eraTab.id}
                onClick={() => setFilterEra(eraTab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterEra === eraTab.id
                    ? "bg-warm-accent text-white font-extrabold shadow"
                    : darkMode
                    ? "bg-dark-bg/45 border border-dark-border text-dark-text hover:bg-dark-panel"
                    : "bg-warm-bg border border-warm-border text-warm-text hover:bg-warm-header/40"
                }`}
              >
                {eraTab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
            <input
              id="fossil-search-bar"
              type="text"
              placeholder="Pesquisar fóssil ou grupo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs rounded-xl pl-9 pr-4 py-2.5 border outline-none transition-all ${
                darkMode
                  ? "bg-dark-bg border-dark-border text-white focus:border-warm-accent"
                  : "bg-warm-bg/50 border-warm-border text-warm-text focus:border-warm-accent focus:bg-white"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-stone-500 hover:text-warm-accent text-xs font-bold"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* EXHIBITIONS GALLERY GRID */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatePresence mode="popLayout">
          {filteredFossils.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredFossils.map((fossil) => (
                <FossilCard
                  key={fossil.id}
                  fossil={fossil}
                  onExplore={setSelectedFossil}
                  darkMode={darkMode}
                  textClass={textClass}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-20 rounded-2xl border border-dashed ${
                darkMode ? "border-stone-800 bg-stone-900/10 text-stone-400" : "border-amber-200 bg-amber-50/5 text-stone-500"
              }`}
            >
              <Compass className="h-10 w-10 mx-auto text-amber-500 opacity-60 animate-pulse mb-3" />
              <h4 className="font-bold text-sm">Nenhum fóssil encontrado</h4>
              <p className="text-xs mt-1 max-w-xs mx-auto">
                Tenta pesquisar por outro nome ou escolhe uma era geológica diferente nos filtros acima.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Local database debug helper (only shows if we have custom entries) */}
        {fossils.some((f) => f.isCustom) && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleResetCatalog}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                darkMode
                  ? "bg-transparent border-dark-border text-dark-sage hover:text-rose-400 hover:border-rose-950"
                  : "bg-transparent border-warm-border text-warm-sage hover:text-rose-600 hover:border-rose-200"
              }`}
            >
              <span>Repor Catálogo de Fósseis</span>
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer
        className={`border-t py-8 text-center text-xs transition-colors ${
          darkMode 
            ? "bg-dark-panel border-dark-border text-dark-sage" 
            : "bg-warm-header border-warm-border text-warm-sage"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-bold">Museu Virtual de Fósseis</span>
            <span>•</span>
            <span>Disciplina de Ciências Naturais (7.º Ano)</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Desenvolvido para aprendizagem ativa e literacia científica</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
        </div>
      </footer>

      {/* MODAL: Fossil Presentation Details */}
      <AnimatePresence>
        {selectedFossil && (
          <FossilDetailModal
            fossil={selectedFossil}
            onClose={() => setSelectedFossil(null)}
            darkMode={darkMode}
            textClass={textClass}
          />
        )}
      </AnimatePresence>

      {/* MODAL: Add Custom Student Fossil */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddFossilModal
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleSaveCustomFossil}
            darkMode={darkMode}
            textClass={textClass}
          />
        )}
      </AnimatePresence>

      {/* FLOATING BOT: PaleoBot Guide */}
      <PaleoBot darkMode={darkMode} textClass={textClass} />
    </div>
  );
}
