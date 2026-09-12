import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { colors, monoFont, serifFont } from '../theme';
import type { Roll } from '../lib/pellicule';

type Props = {
  archives: Roll[];
  onOpenSettings: () => void;
};

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function ArchivesScreen({ archives, onOpenSettings }: Props) {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const totalPhotos = archives.reduce((sum, roll) => sum + roll.photos.length, 0);
  const ordered = [...archives].reverse();
  const [openRoll, setOpenRoll] = useState<Roll | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: theme.inkSoft }]}>ARCHIVES</Text>
        <Pressable onPress={onOpenSettings} hitSlop={10}>
          <Text style={[styles.label, { color: theme.inkSoft }]}>RÉGLAGES ›</Text>
        </Pressable>
      </View>
      <Text style={[styles.title, { color: theme.ink, fontFamily: serifFont }]}>
        {archives.length} pellicule{archives.length > 1 ? 's' : ''}{'\n'}développée{archives.length > 1 ? 's' : ''}
      </Text>

      {archives.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.inkFaint, fontFamily: serifFont }]}>
          Votre première pellicule développée apparaîtra ici.
        </Text>
      ) : (
        <ScrollView style={[styles.listCard, { backgroundColor: theme.surface }]} showsVerticalScrollIndicator={false}>
          {ordered.map((roll, i) => (
            <Pressable
              key={roll.rollNumber}
              onPress={() => setOpenRoll(roll)}
              style={({ pressed }) => [
                styles.rollBlock,
                i > 0 && { borderTopWidth: 1, borderTopColor: theme.hairline },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.rollHeader}>
                <Text style={[styles.rollTitle, { color: theme.ink, fontFamily: serifFont }]}>
                  Pellicule {roll.rollNumber}
                </Text>
                <Text style={[styles.rollDates, { color: theme.inkSoft }]}>
                  {formatDate(roll.startedAt)} — {formatDate(roll.lastRevealedAt ?? roll.startedAt)} ›
                </Text>
              </View>
              <View style={styles.grid}>
                {roll.photos.map((photo) => (
                  <Image key={photo.id} source={{ uri: photo.uri }} style={styles.thumb} />
                ))}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <Text style={[styles.summary, { color: theme.inkSoft }]}>
        {totalPhotos} PHOTO{totalPhotos > 1 ? 'S' : ''} · AUCUNE SUPPRIMÉE
      </Text>

      <Text style={[styles.navHint, { color: theme.inkSoft }]}>↑ APPAREIL</Text>

      <Modal visible={openRoll !== null} animationType="slide" onRequestClose={() => setOpenRoll(null)}>
        {openRoll && (
          <View style={[styles.detailContainer, { backgroundColor: theme.background }]}>
            <Pressable onPress={() => setOpenRoll(null)} hitSlop={12} style={styles.detailBack}>
              <Text style={[styles.detailBackChevron, { color: theme.ink }]}>‹</Text>
            </Pressable>
            <Text style={[styles.label, { color: theme.inkSoft }]}>PELLICULE {openRoll.rollNumber}</Text>
            <Text style={[styles.title, { color: theme.ink, fontFamily: serifFont }]}>
              {formatDate(openRoll.startedAt)} — {formatDate(openRoll.lastRevealedAt ?? openRoll.startedAt)}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.detailGrid}>
                {openRoll.photos.map((photo) => (
                  <Image key={photo.id} source={{ uri: photo.uri }} style={styles.detailThumb} />
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1.8,
  },
  title: {
    fontWeight: '400',
    fontSize: 34,
    lineHeight: 40,
    marginBottom: 22,
    letterSpacing: -0.4,
  },
  emptyText: {
    fontSize: 17,
    lineHeight: 25,
  },
  listCard: {
    borderRadius: 12,
    flex: 1,
  },
  rollBlock: {
    padding: 16,
    gap: 12,
  },
  rollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  rollTitle: {
    fontSize: 22,
    fontWeight: '400',
  },
  rollDates: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  thumb: {
    width: '15.3%',
    aspectRatio: 3 / 2,
    borderRadius: 2,
  },
  summary: {
    marginTop: 20,
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1,
  },
  navHint: {
    marginTop: 'auto',
    alignSelf: 'center',
    fontFamily: monoFont,
    fontSize: 10,
    letterSpacing: 2,
  },
  pressed: {
    opacity: 0.6,
  },
  detailContainer: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  detailBack: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  detailBackChevron: {
    fontSize: 26,
    fontWeight: '300',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingBottom: 20,
  },
  detailThumb: {
    width: '31.5%',
    aspectRatio: 3 / 2,
    borderRadius: 3,
  },
});
