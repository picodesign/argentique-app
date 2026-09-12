import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  useFonts as useNewsreaderFonts,
  Newsreader_300Light,
  Newsreader_300Light_Italic,
  Newsreader_400Regular,
} from '@expo-google-fonts/newsreader';
import {
  useFonts as useIbmPlexMonoFonts,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from '@expo-google-fonts/ibm-plex-mono';
import CameraScreen from './components/CameraScreen';
import RollAreaScreen from './components/RollAreaScreen';
import ArchivesScreen from './components/ArchivesScreen';
import SettingsScreen from './components/SettingsScreen';
import {
  addPhotoToRoll,
  advanceDebugTime,
  canStartNewRoll,
  fillRollForTesting,
  getRollStatus,
  loadPellicule,
  purchaseFilm,
  renewalRemainingMs,
  resetDebugTime,
  resetPellicule,
  revealNextPhoto,
  setNotifyOnRenewal,
  startNewRoll,
  type PelliculeState,
} from './lib/pellicule';
import { colors } from './theme';

// Ordre du pager vertical (voir APP.md) : pellicule au-dessus, appareil au
// centre (page de départ), archives en dessous.
const PAGE_ROLL = 0;
const PAGE_CAMERA = 1;

export default function App() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const { height } = useWindowDimensions();

  const [pellicule, setPellicule] = useState<PelliculeState | null>(null);
  const [page, setPage] = useState(PAGE_CAMERA);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const [newsreaderLoaded] = useNewsreaderFonts({
    Newsreader_300Light,
    Newsreader_300Light_Italic,
    Newsreader_400Regular,
  });
  const [ibmPlexMonoLoaded] = useIbmPlexMonoFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });
  const fontsLoaded = newsreaderLoaded && ibmPlexMonoLoaded;

  useEffect(() => {
    loadPellicule().then(setPellicule);
  }, []);

  if (!pellicule || !fontsLoaded) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.ink} />
      </View>
    );
  }

  const { current: roll, archives } = pellicule;

  const handleCapture = async (uri: string) => {
    const updated = await addPhotoToRoll(pellicule, uri);
    setPellicule(updated);
  };

  const handleRevealNext = async () => {
    const updated = await revealNextPhoto(pellicule);
    setPellicule(updated);
  };

  const handleLoadFilm = async (filmId: string) => {
    const updated = await startNewRoll(pellicule, filmId);
    setPellicule(updated);
  };

  const handlePurchaseFilm = async (filmId: string) => {
    const updated = await purchaseFilm(pellicule, filmId);
    setPellicule(updated);
  };

  const handleToggleNotify = async (value: boolean) => {
    const updated = await setNotifyOnRenewal(pellicule, value);
    setPellicule(updated);
  };

  const handleAdvanceTime = async (ms: number) => {
    const updated = await advanceDebugTime(pellicule, ms);
    setPellicule(updated);
  };

  const handleResetDebugTime = async () => {
    const updated = await resetDebugTime(pellicule);
    setPellicule(updated);
  };

  const handleFillRoll = async () => {
    const updated = await fillRollForTesting(pellicule);
    setPellicule(updated);
  };

  const handleResetAll = async () => {
    const fresh = await resetPellicule();
    setPellicule(fresh);
    setSettingsOpen(false);
    scrollToPage(PAGE_CAMERA);
  };

  const scrollToPage = (target: number) => {
    scrollRef.current?.scrollTo({ y: target * height, animated: true });
  };

  // Pendant la pause de renouvellement (48h après la dernière révélation),
  // `roll` est null ("à sec") — le pager reste actif, seul l'emplacement
  // "pellicule" change (voir RollAreaScreen), pour garder l'appareil et les
  // archives accessibles pendant la pause.
  const hoursUntilRenewal = Math.ceil(renewalRemainingMs(archives) / (60 * 60 * 1000));
  const nextRollNumber = roll
    ? roll.rollNumber
    : archives.length > 0
      ? archives[archives.length - 1].rollNumber + 1
      : 1;

  // Les écrans "chambre noire" (développement, révélation) imposent leur
  // propre statut de barre système, toujours clair sur fond sombre.
  const rollStatus = roll ? getRollStatus(roll) : null;
  const rollPageIsDark = rollStatus === 'pleine_en_attente' || rollStatus === 'prete' || rollStatus === 'en_revelation';
  const statusBarStyles: Array<'light' | 'dark'> = [
    rollPageIsDark || isDark ? 'light' : 'dark',
    'light',
    isDark ? 'light' : 'dark',
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        contentOffset={{ x: 0, y: PAGE_CAMERA * height }}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.y / height))}
        scrollEventThrottle={16}
      >
        <View style={{ height }}>
          <RollAreaScreen
            roll={roll}
            hoursUntilRenewal={hoursUntilRenewal}
            canLoadNewRoll={canStartNewRoll(archives)}
            purchasedFilmIds={pellicule.purchasedFilmIds}
            nextRollNumber={nextRollNumber}
            onRevealNext={handleRevealNext}
            onLoadFilm={handleLoadFilm}
            onPurchaseFilm={handlePurchaseFilm}
          />
        </View>
        <View style={{ height }}>
          <CameraScreen
            roll={roll}
            hoursUntilRenewal={hoursUntilRenewal}
            canLoadNewRoll={canStartNewRoll(archives)}
            onCapture={handleCapture}
            onOpenRoll={() => scrollToPage(PAGE_ROLL)}
          />
        </View>
        <View style={{ height }}>
          <ArchivesScreen archives={archives} onOpenSettings={() => setSettingsOpen(true)} />
        </View>
      </ScrollView>
      <StatusBar style={statusBarStyles[page]} />

      <Modal visible={settingsOpen} animationType="slide" onRequestClose={() => setSettingsOpen(false)}>
        <SettingsScreen
          archives={archives}
          currentRoll={roll}
          purchasedFilmIds={pellicule.purchasedFilmIds}
          notifyOnRenewal={pellicule.notifyOnRenewal}
          canLoadNewRoll={canStartNewRoll(archives)}
          hoursUntilRenewal={hoursUntilRenewal}
          debugTimeOffsetMs={pellicule.debugTimeOffsetMs}
          onToggleNotify={handleToggleNotify}
          onAdvanceTime={handleAdvanceTime}
          onResetDebugTime={handleResetDebugTime}
          onFillRoll={handleFillRoll}
          onResetAll={handleResetAll}
          onClose={() => setSettingsOpen(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
