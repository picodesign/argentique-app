import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import RollScreen from './RollScreen';
import DevelopmentScreen from './DevelopmentScreen';
import GalleryScreen from './GalleryScreen';
import FilmDrawerScreen from './FilmDrawerScreen';
import { colors, monoFont, serifFont } from '../theme';
import { getRollStatus, type Roll } from '../lib/pellicule';

type Props = {
  roll: Roll | null;
  hoursUntilRenewal: number;
  canLoadNewRoll: boolean;
  purchasedFilmIds: string[];
  nextRollNumber: number;
  onRevealNext: () => void;
  onLoadFilm: (filmId: string) => void;
  onPurchaseFilm: (filmId: string) => void;
};

// Choisit le bon écran pour la position "au-dessus de l'appareil" du pager
// selon l'état de la pellicule — voir lib/pellicule.ts (RollStatus).
// roll === null : soit la pause de renouvellement n'est pas terminée ("à
// sec", DryScreen), soit elle l'est (ou c'est le premier lancement) et
// c'est le tiroir qui propose le choix — jamais de pellicule imposée. Le
// pager reste actif dans tous les cas pour que l'appareil et les archives
// restent accessibles.
export default function RollAreaScreen({
  roll,
  hoursUntilRenewal,
  canLoadNewRoll,
  purchasedFilmIds,
  nextRollNumber,
  onRevealNext,
  onLoadFilm,
  onPurchaseFilm,
}: Props) {
  if (!roll) {
    if (!canLoadNewRoll) {
      return <DryScreen hoursLeft={hoursUntilRenewal} />;
    }
    return (
      <FilmDrawerScreen
        purchasedFilmIds={purchasedFilmIds}
        nextRollNumber={nextRollNumber}
        onLoadFilm={onLoadFilm}
        onPurchaseFilm={onPurchaseFilm}
      />
    );
  }

  const status = getRollStatus(roll);

  if (status === 'pleine_en_attente') {
    return <DevelopmentScreen roll={roll} />;
  }
  if (status === 'prete' || status === 'en_revelation') {
    return <GalleryScreen roll={roll} onRevealNext={onRevealNext} />;
  }
  return <RollScreen roll={roll} />;
}

function DryScreen({ hoursLeft }: { hoursLeft: number }) {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.inkSoft }]}>À SEC</Text>
      <Text style={[styles.title, { color: theme.ink, fontFamily: serifFont }]}>
        Prochaine pellicule dans {hoursLeft}h
      </Text>
      <Text style={[styles.body, { color: theme.inkFaint, fontFamily: serifFont }]}>
        La pause fait partie du rythme. Les archives vous attendent en dessous.
      </Text>
      <Text style={[styles.navHint, { color: theme.inkSoft }]}>↓ ARCHIVES</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  navHint: {
    position: 'absolute',
    bottom: 40,
    fontFamily: monoFont,
    fontSize: 10,
    letterSpacing: 2,
  },
});
