import { useEffect, useRef } from 'react';
import { Animated, Easing, FlatList, StyleSheet, Text, View } from 'react-native';
import { colors, monoFont, serifFont } from '../theme';
import type { Photo, Roll } from '../lib/pellicule';

// Le développement reste toujours sombre, comme le viseur — c'est le
// deuxième des deux seuls moments où la lumière compte (voir APP.md).
const theme = colors.dark;

type Props = {
  roll: Roll;
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function DevelopmentScreen({ roll }: Props) {
  const grain = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(grain, { toValue: 1, duration: 4500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(grain, { toValue: 0, duration: 4500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [grain]);

  const opacity = grain.interpolate({ inputRange: [0, 1], outputRange: [0.14, 0.5] });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.accent }]}>DÉVELOPPEMENT</Text>
      <Text style={[styles.title, { color: theme.ink, fontFamily: serifFont }]}>
        {roll.photos.length} photo{roll.photos.length > 1 ? 's' : ''}{'\n'}au bain
      </Text>

      <View style={[styles.listCard, { backgroundColor: theme.surface }]}>
        <FlatList<Photo>
          data={roll.photos}
          keyExtractor={(p) => p.id}
          renderItem={({ item, index }) => (
            <View style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: theme.hairline }]}>
              <Text style={[styles.rowTime, { color: theme.inkFaint }]}>{formatTime(item.takenAt)}</Text>
              <Text style={[styles.rowNumber, { color: theme.inkSoft }]}>
                N° {String(index + 1).padStart(2, '0')}
              </Text>
            </View>
          )}
          style={styles.list}
        />
      </View>

      <View style={styles.bath}>
        <Animated.View style={[styles.grain, { opacity }]} />
      </View>

      <Text style={[styles.footerText, { color: theme.inkFaint, fontFamily: serifFont }]}>
        Le grain se densifie jusqu'à l'aube. Aucune action possible d'ici là.
      </Text>
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
  label: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  title: {
    fontWeight: '400',
    fontSize: 34,
    lineHeight: 40,
    marginBottom: 22,
    letterSpacing: -0.4,
  },
  listCard: {
    borderRadius: 12,
    maxHeight: 170,
    overflow: 'hidden',
  },
  list: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowTime: {
    fontSize: 16,
  },
  rowNumber: {
    fontFamily: monoFont,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  bath: {
    marginTop: 22,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#191715',
  },
  grain: {
    flex: 1,
    backgroundColor: '#c9563c',
    opacity: 0.14,
  },
  footerText: {
    marginTop: 26,
    fontSize: 17,
    lineHeight: 25,
  },
});
