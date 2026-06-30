/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum EraGeologica {
  PALEOZOICO = "Paleozoico",
  MESOZOICO = "Mesozoico",
  CENOZOICO = "Cenozoico",
}

export enum TipoFossil {
  CORPORAL = "Fóssil Corporal",
  VESTIGIO = "Icnofóssil (Vestígio)",
  MOLDE = "Molde",
  IMPRESSAO = "Impressão",
  MINERALIZACAO = "Mineralização",
  AMBAR = "Âmbar",
}

export interface QuizQuestion {
  id: string;
  type: "multiple" | "boolean"; // escolha múltipla ou verdadeiro/falso
  questionText: string;
  options?: string[]; // apenas para escolha múltipla
  correctAnswer: string; // "True"/"False" para boolean ou a string exata para múltipla
  explanation: string;
}

export interface Fossil {
  id: string;
  name: string;
  groupName?: string; // Nome do grupo de alunos que adicionou
  imageUrl: string;
  era: EraGeologica;
  period?: string; // Período geológico específico (e.g. Jurássico, Câmbrico)
  type: TipoFossil;
  organism: string; // Organismo representado
  age: string; // Idade aproximada (e.g., "150 M.a.")
  environment: string; // Ambiente (marinho profundo, lacustre, floresta húmida)
  location: string; // Locais onde pode ser encontrado
  description: string; // Descrição científica para 7º ano
  curiosities: string[]; // Curiosidades científicas
  importance: string; // Importância para a história da Terra
  glossary: { term: string; definition: string }[]; // Glossário
  quiz: QuizQuestion[];
  isCustom?: boolean; // Se foi adicionado pelos alunos
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: string;
}
