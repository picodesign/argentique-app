import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { colors, serifFont } from '../theme';

// Le viseur reste toujours sombre, quel que soit le thème du téléphone —
// comme l'app Appareil Photo native. Seul l'écran de permission (qui ne
// montre pas la caméra) suit le mode clair/sombre.
const overlay = colors.dark;

type Props = {
  remaining: number;
  rollNumber: number;
  onCapture: (uri: string) => void;
  onOpenRoll: () => void;
};

export default function CameraScreen({ remaining, rollNumber, onCapture, onOpenRoll }: Props) {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');
  const [facing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const finished = remaining <= 0;

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
        <Ionicons name="camera-outline" size={40} color={theme.ink} style={{ marginBottom: 20 }} />
        <Text style={[styles.permissionTitle, { color: theme.ink }]}>Accès à l'appareil photo</Text>
        <Text style={[styles.permissionBody, { color: theme.inkSoft }]}>
          Pellicule a besoin de l'appareil photo pour prendre tes photos. Rien n'est jamais
          importé depuis ta galerie.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.permissionButton, { backgroundColor: theme.ink }, pressed && styles.pressed]}
          onPress={requestPermission}
        >
          <Text style={[styles.permissionButtonText, { color: theme.surface }]}>Autoriser l'appareil photo</Text>
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
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} flash={flash} />

      {/* voile léger pour la lisibilité des contrôles */}
      <View pointerEvents="none" style={styles.topScrim} />
      <View pointerEvents="none" style={styles.bottomScrim} />

      <Pressable style={styles.rollTag} onPress={onOpenRoll}>
        <View style={styles.rollTagDot} />
        <Text style={styles.rollTagText}>Pellicule N°{rollNumber}</Text>
      </Pressable>

      <View style={styles.bottomBar}>
        <Text style={[styles.counter, finished && styles.counterFinished]}>
          {finished ? 'Pellicule terminée' : `${remaining} photo${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}`}
        </Text>

        <View style={styles.controlsRow}>
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            onPress={onOpenRoll}
          >
            <Ionicons name="grid-outline" size={20} color={overlay.surface} />
          </Pressable>

          <Pressable
            disabled={finished || isCapturing}
            onPress={takePhoto}
            style={({ pressed }) => [
              styles.shutter,
              (finished || isCapturing) && styles.shutterDisabled,
              pressed && !finished && styles.pressed,
            ]}
          >
            <View style={styles.shutterInner} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            onPress={() => setFlash((f) => (f === 'off' ? 'on' : 'off'))}
          >
            <Ionicons name={flash === 'off' ? 'flash-off-outline' : 'flash-outline'} size={20} color={overlay.surface} />
          </Pressable>
        </View>
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
    fontFamily: serifFont,
    fontWeight: '600',
    fontSize: 22,
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
    fontSize: 15,
    fontWeight: '600',
  },
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  bottomScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  rollTag: {
    position: 'absolute',
    top: 58,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(20,17,13,0.5)',
  },
  rollTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: overlay.accent,
  },
  rollTagText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: overlay.surface,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 44,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 22,
  },
  counter: {
    fontFamily: serifFont,
    fontStyle: 'italic',
    fontSize: 20,
    color: overlay.surface,
  },
  counterFinished: {
    color: overlay.accent,
  },
  controlsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(20,17,13,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 78,
    height: 78,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 62,
    height: 62,
    borderRadius: 999,
    backgroundColor: overlay.surface,
  },
  shutterDisabled: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.75,
  },
});
