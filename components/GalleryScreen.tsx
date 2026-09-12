import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, monoFont, serifFont, serifFontItalic } from '../theme';
import { ROLL_SIZE } from '../theme';
import type { Roll } from '../lib/pellicule';

// La révélation reste toujours sombre — chambre noire, jamais le thème
// du téléphone (voir APP.md, "les deux moments où la lumière compte").
const theme = colors.dark;

type Props = {
  roll: Roll;
  onRevealNext: () => void;
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function GalleryScreen({ roll, onRevealNext }: Props) {
  const revealedCount = roll.revealedCount;
  const hasStarted = revealedCount > 0;
  const currentPhoto = hasStarted ? roll.photos[revealedCount - 1] : null;

  return (
    <Pressable style={[styles.container, { backgroundColor: theme.background }]} onPress={onRevealNext}>
      <View style={styles.topRow}>
        <Text style={styles.topLabel}>PELLICULE {String(roll.rollNumber).padStart(2, '0')}</Text>
        <Text style={styles.topLabel}>{revealedCount} / {ROLL_SIZE}</Text>
      </View>

      {currentPhoto ? (
        <Image source={{ uri: currentPhoto.uri }} style={styles.photo} resizeMode="cover" />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.placeholderText}>PRÊTE À RÉVÉLER</Text>
        </View>
      )}

      <View style={styles.captionBlock}>
        {currentPhoto ? (
          <>
            <Text style={[styles.caption, { fontFamily: serifFontItalic }]}>
              N° {String(revealedCount).padStart(2, '0')}
            </Text>
            <Text style={styles.captionTime}>{formatTime(currentPhoto.takenAt)}</Text>
          </>
        ) : (
          <Text style={[styles.caption, { fontFamily: serifFont }]}>36 photos vous attendent.</Text>
        )}
      </View>

      <Text style={styles.hint}>TOUCHEZ POUR {hasStarted ? 'LA SUIVANTE' : 'RÉVÉLER'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 58,
    paddingBottom: 46,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 22,
  },
  topLabel: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1.6,
    color: theme.inkSoft,
  },
  photo: {
    flex: 1,
    marginHorizontal: 24,
    borderRadius: 4,
    backgroundColor: theme.surfaceAlt,
  },
  photoPlaceholder: {
    flex: 1,
    marginHorizontal: 24,
    borderRadius: 4,
    backgroundColor: theme.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1.4,
    color: theme.inkSoft,
  },
  captionBlock: {
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 6,
  },
  caption: {
    fontSize: 23,
    color: theme.ink,
  },
  captionTime: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1,
    color: theme.inkSoft,
  },
  hint: {
    marginTop: 26,
    textAlign: 'center',
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1.8,
    color: theme.inkSoft,
  },
});
