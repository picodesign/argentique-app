// Machine à états de la pellicule : prise de vue, développement différé,
// révélation dans l'ordre, puis pause de renouvellement avant la suivante.
// Voir APP.md ("Règle de renouvellement") pour la décision produit.
//
// Important : les photos ne passent JAMAIS par la pellicule photo du
// système (pas de MediaLibrary). Elles vivent uniquement dans le dossier
// de documents de l'app, invisibles ailleurs, cohérent avec le concept de
// "développement différé" du brief.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import { ROLL_SIZE } from '../theme';

const STORAGE_KEY = 'pellicule/state';
const DEVELOPMENT_HOUR = 8; // développement à 8h00 le lendemain du remplissage
const RENEWAL_PAUSE_MS = 48 * 60 * 60 * 1000; // pause fixe après la dernière révélation

export type Photo = {
  id: string;
  uri: string;
  takenAt: number;
};

export type Roll = {
  rollNumber: number;
  filmId: string;
  startedAt: number;
  photos: Photo[];
  filledAt: number | null; // horodatage de la 36e photo
  revealedCount: number; // photos révélées jusqu'ici, dans l'ordre
  lastRevealedAt: number | null; // horodatage de la dernière révélation
};

export type RollStatus =
  | 'en_cours' // en train d'être remplie
  | 'pleine_en_attente' // pleine, développement pas encore prêt
  | 'prete' // développée, révélation pas commencée
  | 'en_revelation' // révélation en cours (pas encore terminée)
  | 'terminee'; // toutes les photos révélées

export type PelliculeState = {
  current: Roll | null; // null pendant la pause de renouvellement ("à sec") ou avant le premier choix
  archives: Roll[];
  purchasedFilmIds: string[]; // pellicules payantes acquises, à vie (voir lib/films.ts)
  notifyOnRenewal: boolean; // préférence "me prévenir quand la pellicule arrive" (Réglages)
  debugTimeOffsetMs: number; // décalage d'horloge pour les outils de test (Réglages), 0 en usage normal
};

// Horloge de l'app : Date.now() décalé par les outils de test des Réglages.
// Un module-level cache (plutôt que de lire l'état à chaque appel) car
// getRollStatus/canStartNewRoll/renewalRemainingMs sont des fonctions pures
// synchrones appelées avec `now = getNow()` en valeur par défaut.
let debugOffsetMs = 0;
export function getNow(): number {
  return Date.now() + debugOffsetMs;
}

function freshRoll(rollNumber: number, filmId: string): Roll {
  return {
    rollNumber,
    filmId,
    startedAt: getNow(),
    photos: [],
    filledAt: null,
    revealedCount: 0,
    lastRevealedAt: null,
  };
}

function rollDirectory(rollNumber: number) {
  return new Directory(Paths.document, 'rolls', `roll-${rollNumber}`);
}

async function saveState(state: PelliculeState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// 8h00 le lendemain du jour où la pellicule est devenue pleine (pas l'heure
// de chargement).
function developmentTime(filledAt: number): number {
  const d = new Date(filledAt);
  d.setDate(d.getDate() + 1);
  d.setHours(DEVELOPMENT_HOUR, 0, 0, 0);
  return d.getTime();
}

// Le moment à partir duquel une nouvelle pellicule peut être chargée : 48h
// fixes après la révélation de la toute dernière photo de la précédente —
// jamais depuis le chargement, jamais depuis le remplissage.
function renewalAvailableAt(archives: Roll[]): number | null {
  const last = archives[archives.length - 1];
  if (!last?.lastRevealedAt) return null;
  return last.lastRevealedAt + RENEWAL_PAUSE_MS;
}

export function canStartNewRoll(archives: Roll[], now = getNow()): boolean {
  const availableAt = renewalAvailableAt(archives);
  return availableAt === null || now >= availableAt;
}

export function renewalRemainingMs(archives: Roll[], now = getNow()): number {
  const availableAt = renewalAvailableAt(archives);
  return availableAt === null ? 0 : Math.max(0, availableAt - now);
}

export function getRollStatus(roll: Roll, now = getNow()): RollStatus {
  if (roll.revealedCount >= ROLL_SIZE) return 'terminee';
  if (roll.revealedCount > 0) return 'en_revelation';
  if (roll.filledAt === null) return 'en_cours';
  return now >= developmentTime(roll.filledAt) ? 'prete' : 'pleine_en_attente';
}

export function remainingShots(roll: Roll): number {
  return Math.max(0, ROLL_SIZE - roll.photos.length);
}

export function remainingToReveal(roll: Roll): number {
  return Math.max(0, roll.photos.length - roll.revealedCount);
}

// Une pellicule totalement révélée part aux archives. La pellicule
// suivante ne démarre jamais automatiquement : une fois la pause de 48h
// passée (ou au premier lancement), c'est le tiroir qui propose le choix
// (voir startNewRoll) — jamais de pellicule imposée.
async function archiveIfDone(state: PelliculeState): Promise<PelliculeState> {
  let { current, archives } = state;
  if (current && current.revealedCount >= ROLL_SIZE) {
    archives = [...archives, current];
    current = null;
  }
  const next: PelliculeState = { ...state, current, archives };
  await saveState(next);
  return next;
}

export async function loadPellicule(): Promise<PelliculeState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const parsed = raw ? JSON.parse(raw) : null;
  const state: PelliculeState = {
    current: null,
    archives: [],
    purchasedFilmIds: [],
    notifyOnRenewal: true,
    debugTimeOffsetMs: 0,
    ...parsed,
  };
  debugOffsetMs = state.debugTimeOffsetMs;
  return archiveIfDone(state);
}

// Préférence "me prévenir quand la pellicule arrive" (Réglages ·
// Ravitaillement). Purement déclarative pour l'instant — le déclenchement
// réel passera par expo-notifications (voir APP.md, pas encore ajouté).
export async function setNotifyOnRenewal(state: PelliculeState, value: boolean): Promise<PelliculeState> {
  const next: PelliculeState = { ...state, notifyOnRenewal: value };
  await saveState(next);
  return next;
}

// --- Outils de test (Réglages · section debug) -----------------------
// Permettent de vérifier tous les états de l'app (attente développement,
// révélation, pause de renouvellement, premier lancement) sans attendre
// des heures ou prendre 36 vraies photos. À retirer avant toute
// publication — voir APP.md.

export async function advanceDebugTime(state: PelliculeState, ms: number): Promise<PelliculeState> {
  debugOffsetMs += ms;
  const next = await archiveIfDone({ ...state, debugTimeOffsetMs: debugOffsetMs });
  return next;
}

export async function resetDebugTime(state: PelliculeState): Promise<PelliculeState> {
  debugOffsetMs = 0;
  const next: PelliculeState = { ...state, debugTimeOffsetMs: 0 };
  await saveState(next);
  return next;
}

// Remplit la pellicule en cours avec des photos factices (URI vide,
// n'affichent rien) pour atteindre l'état "pleine" sans déclencher 36 fois.
export async function fillRollForTesting(state: PelliculeState): Promise<PelliculeState> {
  const roll = state.current;
  if (!roll || remainingShots(roll) <= 0) return state;
  const now = getNow();
  const filler: Photo[] = Array.from({ length: remainingShots(roll) }, (_, i) => ({
    id: `debug-${now}-${i}`,
    uri: '',
    takenAt: now,
  }));
  const updatedRoll: Roll = { ...roll, photos: [...roll.photos, ...filler], filledAt: now };
  const next: PelliculeState = { ...state, current: updatedRoll };
  await saveState(next);
  return next;
}

// Efface tout (pellicule en cours, archives, achats, décalage d'horloge) —
// pour retester le tout premier lancement de l'app.
export async function resetPellicule(): Promise<PelliculeState> {
  debugOffsetMs = 0;
  const fresh: PelliculeState = {
    current: null,
    archives: [],
    purchasedFilmIds: [],
    notifyOnRenewal: true,
    debugTimeOffsetMs: 0,
  };
  await saveState(fresh);
  return fresh;
}

// Choix fait dans le tiroir : charge une pellicule précise dans l'appareil.
// N'a d'effet que si aucune pellicule n'est en cours et que la pause de
// renouvellement est passée (ou qu'il n'y en a pas eu, premier lancement).
export async function startNewRoll(state: PelliculeState, filmId: string): Promise<PelliculeState> {
  if (state.current || !canStartNewRoll(state.archives)) return state;
  const nextNumber = state.archives.length > 0 ? state.archives[state.archives.length - 1].rollNumber + 1 : 1;
  const next: PelliculeState = { ...state, current: freshRoll(nextNumber, filmId) };
  await saveState(next);
  return next;
}

// Achat unique d'une pellicule payante — pas de vrai paiement pour
// l'instant (voir APP.md), juste la persistance de la possession à vie.
export async function purchaseFilm(state: PelliculeState, filmId: string): Promise<PelliculeState> {
  if (state.purchasedFilmIds.includes(filmId)) return state;
  const next: PelliculeState = { ...state, purchasedFilmIds: [...state.purchasedFilmIds, filmId] };
  await saveState(next);
  return next;
}

// Copie la photo prise (dans le cache temporaire de la caméra) vers le
// stockage permanent de l'app, puis met à jour et persiste l'état.
export async function addPhotoToRoll(state: PelliculeState, temporaryUri: string): Promise<PelliculeState> {
  const roll = state.current;
  if (!roll || remainingShots(roll) <= 0) return state;

  const dir = rollDirectory(roll.rollNumber);
  dir.create({ intermediates: true, idempotent: true });

  const id = `${getNow()}`;
  const source = new File(temporaryUri);
  const destination = new File(dir, `${id}.jpg`);
  source.copy(destination);

  const photo: Photo = { id, uri: destination.uri, takenAt: getNow() };
  const photos = [...roll.photos, photo];
  const filledAt = photos.length >= ROLL_SIZE ? getNow() : roll.filledAt;
  const updatedRoll: Roll = { ...roll, photos, filledAt };
  const next: PelliculeState = { ...state, current: updatedRoll };
  await saveState(next);
  return next;
}

// Révèle la photo suivante, dans l'ordre — jamais de vue anticipée avant la
// fin des 36, jamais deux à la fois.
export async function revealNextPhoto(state: PelliculeState): Promise<PelliculeState> {
  const roll = state.current;
  if (!roll) return state;
  const status = getRollStatus(roll);
  if (status !== 'prete' && status !== 'en_revelation') return state;
  if (roll.revealedCount >= roll.photos.length) return state;

  const updatedRoll: Roll = {
    ...roll,
    revealedCount: roll.revealedCount + 1,
    lastRevealedAt: getNow(),
  };
  return archiveIfDone({ ...state, current: updatedRoll });
}
