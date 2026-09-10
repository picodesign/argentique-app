import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { colors, ROLL_SIZE, serifFont } from '../theme';
import type { Roll } from '../lib/roll';
import { remainingShots } from '../lib/roll';

type Props = {
  roll: Roll;
  onClose: () => void;
};

// Teintes discrètes pour représenter des clichés distincts sans les montrer —
// les photos ne sont jamais visibles avant développement.
const TONES = ['#C89A6A', '#A8785A', '#8E9A7C', '#B98C63', '#7C8B98', '#C4A67C', '#9C8468', '#B2795E'];

export default function RollScreen({ roll, onClose }: Props) {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const remaining = remainingShots(roll);
  const taken = roll.photos.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Pressable style={styles.back} onPress={onClose} hitSlop={10}>
        <Ionicons name="chevron-back" size={22} color={theme.ink} />
      </Pressable>

      <Text style={[styles.label, { color: theme.inkSoft }]}>Pellicule N°{roll.rollNumber}</Text>
      <Text style={[styles.title, { color: theme.ink, fontFamily: serifFont }]}>
        {remaining > 0 ? `${remaining} photo${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}` : 'Pellicule terminée'}
      </Text>

      <View style={styles.grid}>
        {Array.from({ length: ROLL_SIZE }).map((_, i) => {
          const filled = i < taken;
          return (
            <View
              key={i}
              style={[
                styles.cell,
                filled
                  ? { backgroundColor: TONES[i % TONES.length] }
                  : { borderColor: theme.hairline, borderWidth: 1.4, borderStyle: 'dashed' },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.footer}>
        <View style={[styles.footerDot, { backgroundColor: theme.accent }]} />
        <Text style={[styles.footerText, { color: theme.inkSoft, fontFamily: serifFont }]}>
          Les photos d'aujourd'hui seront visibles demain à 8h00.
        </Text>
      </View>
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
  back: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 6,
  },
  title: {
    fontWeight: '600',
    fontSize: 28,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  cell: {
    width: '13.6%',
    aspectRatio: 1,
    borderRadius: 4,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  footerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 6,
  },
  footerText: {
    flex: 1,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 20,
  },
});
