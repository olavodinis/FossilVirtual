/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Landmark, Compass, Calendar, ArrowRight } from "lucide-react";
import { Fossil, EraGeologica } from "../types";

interface FossilCardProps {
  key?: string;
  fossil: Fossil;
  onExplore: (fossil: Fossil) => void;
  darkMode: boolean;
  textClass: (size: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl") => string;
}

export default function FossilCard({ fossil, onExplore, darkMode, textClass }: FossilCardProps) {
  // Define era coloring
  const getEraBadgeStyles = (era: EraGeologica) => {
    switch (era) {
      case EraGeologica.PALEOZOICO:
        return darkMode
          ? "bg-[#1e3422] text-emerald-300 border-emerald-900/40"
          : "bg-emerald-100 text-emerald-850 border-emerald-200";
      case EraGeologica.MESOZOICO:
        return darkMode
          ? "bg-[#422e15] text-amber-300 border-[#9a6e3a]/40"
          : "bg-amber-100 text-amber-900 border-amber-200";
      case EraGeologica.CENOZOICO:
        return darkMode
          ? "bg-dark-bg text-dark-text border-dark-border"
          : "bg-warm-bg text-warm-text border-warm-border";
      default:
        return "bg-stone-100 text-stone-850 border-stone-200";
    }
  };

  return (
    <motion.div
      id={`fossil-card-${fossil.id}`}
      className={`group relative rounded-2xl border-2 overflow-hidden shadow-lg transition-all flex flex-col h-full ${
        darkMode
          ? "bg-dark-panel border-dark-border hover:border-warm-accent hover:shadow-warm-accent/15"
          : "bg-warm-paper border-warm-border hover:border-warm-accent hover:shadow-warm-accent/10"
      }`}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Fossil Image */}
      <div className="relative aspect-video overflow-hidden bg-stone-100 dark:bg-dark-bg">
        <img
          src={fossil.imageUrl}
          alt={`Fóssil de ${fossil.name} - ${fossil.type}`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />
        {/* Absolute Ribbon for custom submissions */}
        {fossil.isCustom && (
          <span className="absolute top-3 right-3 rounded-md bg-warm-accent px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow">
            Grupo: {fossil.groupName || "Alunos"}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getEraBadgeStyles(
                fossil.era
              )}`}
            >
              <Calendar className="h-3 w-3" />
              {fossil.era}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                darkMode
                  ? "bg-dark-bg text-warm-accent border-dark-border"
                  : "bg-warm-header text-warm-text border-warm-border"
              }`}
            >
              <Compass className="h-3 w-3" />
              {fossil.type}
            </span>
          </div>

          <div>
            <h3 className={`font-serif font-bold tracking-tight ${textClass("xl")} ${
              darkMode ? "text-warm-accent group-hover:text-amber-400" : "text-warm-text group-hover:text-warm-accent"
            }`}>
              {fossil.name}
            </h3>
            <p className={`text-stone-500 dark:text-dark-text/75 line-clamp-2 mt-1.5 ${textClass("xs")} leading-relaxed`}>
              {fossil.description}
            </p>
          </div>
        </div>

        {/* Info Grid (Age & Environment) */}
        <div className={`mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-[11px] ${
          darkMode ? "border-dark-border text-dark-sage" : "border-warm-border/60 text-warm-sage"
        }`}>
          <div>
            <span className={`block font-semibold uppercase tracking-wider text-[9px] ${darkMode ? "text-dark-text/50" : "text-warm-text/50"}`}>Idade</span>
            <span className={`truncate block font-semibold ${darkMode ? "text-dark-text/90" : "text-warm-text/90"}`}>{fossil.age}</span>
          </div>
          <div>
            <span className={`block font-semibold uppercase tracking-wider text-[9px] ${darkMode ? "text-dark-text/50" : "text-warm-text/50"}`}>Ambiente</span>
            <span className={`truncate block font-semibold ${darkMode ? "text-dark-text/90" : "text-warm-text/90"}`}>{fossil.environment}</span>
          </div>
        </div>

        {/* Plaque button */}
        <div className="mt-5">
          <button
            onClick={() => onExplore(fossil)}
            className={`w-full relative flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold tracking-wider uppercase text-[10px] cursor-pointer transition-all border-2 shadow-sm ${
              darkMode
                ? "bg-dark-panel border-dark-border text-dark-text hover:bg-warm-accent hover:border-warm-accent hover:text-white"
                : "bg-warm-bg border-warm-text text-warm-text hover:bg-warm-text hover:text-white"
            }`}
          >
            <span>Explorar Fóssil</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
