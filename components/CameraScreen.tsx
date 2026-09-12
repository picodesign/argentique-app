// Viseur (canevas Pellicule.dc.html, round 6A — "VISEUR · FILM CHARGÉ" /
// "VISEUR À SEC"). Le compteur X/36 et le nom de la pellicule sont les seuls
// éléments persistants du chrome, jamais colorés — pas de badge de statut
// (le badge "● PRÊT" venait par erreur de la ronde 1A, abandonnée, voir
// APP.md). La navigation (tiroir tiré vers le haut, archives depuis la
// droite) proposée par 6A n'est pas encore implémentée — voir APP.md ; en
// attendant, ce viseur reste une page du pager vertical existant.
import * as Haptics from 'expo-haptics';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { colors, monoFont, serifFont, ROLL_SIZE } from '../theme';
import { getFilm } from '../lib/films';
import { remainingShots, type Roll } from '../lib/pellicule';

// Le viseur reste toujours sombre, quel que soit le thème du téléphone —
// comme l'app Appareil Photo native. Seul l'écran de permission (qui ne
// montre pas la caméra) suit le mode clair/sombre.
const overlay = colors.dark;

type Props = {
  roll: Roll | null;
  hoursUntilRenewal: number;
  canLoadNewRoll: boolean;
  onCapture: (uri: string) => void;
  onOpenRoll: () => void;
};

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

export default function CameraScreen({ roll, hoursUntilRenewal, canLoadNewRoll, onCapture, onOpenRoll }: Props) {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const remaining = roll ? remainingShots(roll) : 0;
  const taken = roll ? roll.photos.length : 0;
  const finished = !roll || remaining <= 0;
  const film = roll ? getFilm(roll.filmId) : undefined;

  if (!permission) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.ink} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background, paddingHorizontal: 40 }]}>
        <Text style={[styles.permissionTitle, { color: theme.ink, fontFamily: serifFont }]}>
          Accès à l'appareil photo
        </Text>
        <Text style={[styles.permissionBody, { color: theme.inkSoft }]}>
          Pellicule a besoin de l'appareil photo pour prendre tes photos. Rien n'est jamais
          importé depuis ta galerie.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.permissionButton, { backgroundColor: theme.ink }, pressed && styles.pressed]}
          onPress={requestPermission}
        >
          <Text style={[styles.permissionButtonText, { color: theme.surface, fontFamily: monoFont }]}>
            AUTORISER L'APPAREIL PHOTO
          </Text>
        </Pressable>
      </View>
    );
  }

  const takePhoto = async () => {
    if (isCapturing || finished || !cameraRef.current) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (photo?.uri) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onCapture(photo.uri);
      }
    } catch {
      // Un cliché raté ne doit pas bloquer l'appareil — on réessaiera au suivant.
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />

      {/* voile léger pour la lisibilité des contrôles */}
      <View pointerEvents="none" style={styles.topScrim} />
      <View pointerEvents="none" style={styles.bottomScrim} />

      <Pressable style={styles.topRow} onPress={onOpenRoll} hitSlop={10}>
        <Text style={styles.counter}>{taken}/{ROLL_SIZE}</Text>
        {roll && film ? (
          <View style={styles.filmInfo}>
            <Text style={styles.filmName}>{film.nom.toUpperCase()}</Text>
            <Text style={styles.filmDate}>chargée le {formatDate(roll.startedAt)}</Text>
          </View>
        ) : (
          <Text style={styles.filmName}>BOÎTIER VIDE</Text>
        )}
      </Pressable>

      {/* cadre de visée décoratif — ne capture aucun geste */}
      <View pointerEvents="none" style={styles.frame}>
        <View style={styles.frameBorder} />
        <View style={[styles.tick, styles.tickTop]} />
        <View style={[styles.tick, styles.tickBottom]} />
        <View style={[styles.tick, styles.tickLeft]} />
        <View style={[styles.tick, styles.tickRight]} />
        <View style={styles.centerMark} />
      </View>

      {!roll && (
        <Text style={styles.dryHint} pointerEvents="none">
          {canLoadNewRoll ? 'Le tiroir vous attend' : `Prochaine pellicule dans ${hoursUntilRenewal}h`}
        </Text>
      )}

      <View style={styles.bottomBar}>
        <Pressable
          disabled={finished || isCapturing}
          onPress={takePhoto}
          style={({ pressed }) => [
            styles.shutter,
            (finished || isCapturing) && styles.shutterDisabled,
            pressed && !finished && styles.pressed,
          ]}
        >
          {finished ? <View style={styles.shutterCross} /> : <View style={styles.shutterInner} />}
        </Pressable>

        <Text style={styles.navHint}>↑ PELLICULE&nbsp;&nbsp;&nbsp;↓ ARCHIVES</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTitle: {
    fontWeight: '400',
    fontSize: 26,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionBody: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
  },
  permissionButtonText: {
    fontSize: 12,
    letterSpacing: 1.2,
  },
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
  topRow: {
    position: 'absolute',
    top: 58,
    left: 22,
    right: 22,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  counter: {
    fontFamily: monoFont,
    fontSize: 12,
    letterSpacing: 1.4,
    color: overlay.ink,
  },
  filmInfo: {
    alignItems: 'flex-end',
    gap: 2,
  },
  filmName: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1.6,
    color: overlay.inkSoft,
    textAlign: 'right',
  },
  filmDate: {
    fontFamily: monoFont,
    fontSize: 10,
    letterSpacing: 1,
    color: 'rgba(232,224,208,0.4)',
    textAlign: 'right',
  },
  frame: {
    position: 'absolute',
    top: 110,
    left: 26,
    right: 26,
    bottom: 200,
  },
  frameBorder: {
    position: 'absolute',
    inset: 0,
    borderWidth: 1,
    borderColor: 'rgba(233,227,214,0.16)',
  },
  tick: {
    position: 'absolute',
    backgroundColor: 'rgba(233,227,214,0.45)',
  },
  tickTop: { top: 0, left: '50%', width: 1, height: 30, marginLeft: -0.5 },
  tickBottom: { bottom: 0, left: '50%', width: 1, height: 30, marginLeft: -0.5 },
  tickLeft: { top: '50%', left: 0, width: 30, height: 1, marginTop: -0.5 },
  tickRight: { top: '50%', right: 0, width: 30, height: 1, marginTop: -0.5 },
  centerMark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 92,
    height: 92,
    marginTop: -46,
    marginLeft: -46,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(233,227,214,0.2)',
  },
  dryHint: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 250,
    textAlign: 'center',
    fontFamily: monoFont,
    fontSize: 13,
    letterSpacing: 0.6,
    color: overlay.inkSoft,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 44,
    alignItems: 'center',
    gap: 18,
  },
  shutter: {
    width: 78,
    height: 78,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(233,227,214,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: overlay.ink,
  },
  shutterCross: {
    width: 88,
    height: 1,
    backgroundColor: 'rgba(233,227,214,0.3)',
    transform: [{ rotate: '-45deg' }],
  },
  shutterDisabled: {
    opacity: 0.35,
  },
  navHint: {
    fontFamily: monoFont,
    fontSize: 10,
    letterSpacing: 2,
    color: overlay.inkSoft,
  },
  pressed: {
    opacity: 0.75,
  },
});
