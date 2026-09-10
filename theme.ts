// Design tokens — direction "papier & encre" (voir APP.md)
import { Platform } from 'react-native';

export const ROLL_SIZE = 36;

export const colors = {
  light: {
    background: '#F6F2E9',
    surface: '#FFFDF8',
    ink: '#1B1A17',
    inkSoft: '#6E6A60',
    hairline: '#DED8CA',
    accent: '#B4472F',
  },
  dark: {
    background: '#131210',
    surface: '#1D1B18',
    ink: '#EFEADF',
    inkSoft: '#9A948A',
    hairline: '#302C26',
    accent: '#D2694F',
  },
} as const;

export type Theme = typeof colors.light;

// Pas de police custom chargée pour l'instant : on reste sur les polices
// système (natif) pour l'interface, et sur la serif système pour les titres,
// dans l'esprit "carnet" sans ajouter de dépendance de police.
export const serifFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });
