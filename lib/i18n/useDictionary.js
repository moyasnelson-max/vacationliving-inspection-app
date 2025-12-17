"use client";
import { createContext, useContext } from "react";

export const DictionaryContext = createContext(null);

export function useDictionary() {
  return useContext(DictionaryContext);
}
