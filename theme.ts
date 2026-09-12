// Design tokens — direction "carnet le jour, chambre noire la nuit" (voir APP.md)
// Valeurs alignées sur le canevas de design (Pellicule.dc.html, rounds 4A/5A/5B/6A).
export const ROLL_SIZE = 36;

export const colors = {
  light: {
    background: '#E8E4DA',
    surface: '#F3F0E8',
    surfaceAlt: '#EFEBE2',
    ink: '#2B2620',
    inkSoft: '#8A7F6F',
    inkFaint: '#6D6459',
    hairline: '#D5CDBD',
    accent: '#C9563C',
  },
  dark: {
    background: '#131110',
    surface: '#1C1A18',
    surfaceAlt: '#191715',
    ink: '#EFE9DC',
    inkSoft: '#8D8579',
    inkFaint: '#C4BCAE',
    hairline: 'rgba(233,227,214,0.15)',
    accent: '#C9563C',
  },
} as const;

export type Theme = {
  readonly background: string;
  readonly surface: string;
  readonly surfaceAlt: string;
  readonly ink: string;
  readonly inkSoft: string;
  readonly inkFaint: string;
  readonly hairline: string;
  readonly accent: string;
};

// Serif éditoriale pour les titres ("carnet"), monospace pour tout indicateur
// technique (compteurs, dates, labels d'écran) — chargées via expo-font,
// voir App.tsx (useFonts). Tant que les polices ne sont pas prêtes, on
// retombe sur la serif système pour éviter un écran vide.
export const serifFont = 'Newsreader_300Light';
export const serifFontItalic = 'Newsreader_300Light_Italic';
export const monoFont = 'IBMPlexMono_400Regular';
export const monoFontMedium = 'IBMPlexMono_500Medium';
export const systemSerifFallback = 'Georgia';
