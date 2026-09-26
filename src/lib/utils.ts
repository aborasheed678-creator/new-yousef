import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getEntityIdentity } from "./dynamicIdentity";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function applyChaletTheme(chaletName: string) {
  // In a real app, you might have a map of chalet names to theme configurations.
  // For now, we'll apply a default luxury chalet theme.
  const identity = getEntityIdentity('chalets');
  if (!identity) return;

  const root = document.documentElement;

  // Set CSS variables
  root.style.setProperty('--dynamic-primary', identity.colors.primary);
  root.style.setProperty('--dynamic-secondary', identity.colors.secondary);
  root.style.setProperty('--dynamic-background', identity.colors.background);
  
  // Apply additional specific styling if needed
  root.setAttribute('data-chalet-name', chaletName);
}
