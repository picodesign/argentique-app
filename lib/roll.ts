// Gestion de la pellicule en cours : stockage des photos + compteur.
//
// Important : les photos ne passent JAMAIS par la pellicule photo du
// système (pas de MediaLibrary). Elles vivent uniquement dans le
// dossier de documents de l'app, invisibles ailleurs — cohérent avec
// le concept de "développement différé" du brief.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import { ROLL_SIZE } from '../theme';

const STORAGE_KEY = 'pellicule/current-roll';

export type Photo = {
  id: string;
  uri: string;
  takenAt: number;
};

export type Roll = {
  rollNumber: number;
  startedAt: number;
  photos: Photo[];
};

function rollDirectory(rollNumber: number) {
  return new Directory(Paths.document, 'rolls', `roll-${rollNumber}`);
}

export async function loadRoll(): Promise<Roll> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw) {
    return JSON.parse(raw) as Roll;
  }
  const fresh: Roll = { rollNumber: 1, startedAt: Date.now(), photos: [] };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

async function saveRoll(roll: Roll) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(roll));
}

// Copie la photo prise (dans le cache temporaire de la caméra) vers le
// stockage permanent de l'app, puis met à jour et persiste la pellicule.
export async function addPhotoToRoll(roll: Roll, temporaryUri: string): Promise<Roll> {
  const dir = rollDirectory(roll.rollNumber);
  dir.create({ intermediates: true, idempotent: true });

  const id = `${Date.now()}`;
  const source = new File(temporaryUri);
  const destination = new File(dir, `${id}.jpg`);
  source.copy(destination);

  const photo: Photo = { id, uri: destination.uri, takenAt: Date.now() };
  const updated: Roll = { ...roll, photos: [...roll.photos, photo] };
  await saveRoll(updated);
  return updated;
}

export function remainingShots(roll: Roll): number {
  return Math.max(0, ROLL_SIZE - roll.photos.length);
}
