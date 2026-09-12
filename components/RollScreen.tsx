import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { colors, monoFont, ROLL_SIZE, serifFont } from '../theme';
import type { Roll } from '../lib/pellicule';
import { remainingShots } from '../lib/pellicule';

type Props = {
  roll: Roll;
};

// Teintes discrètes pour représenter des clichés distincts sans les montrer —
// les photos ne sont jamais visibles avant développement.
const TONES = ['#C89A6A', '#A8785A', '#8E9A7C', '#B98C63', '#7C8B98', '#C4A67C', '#9C8468', '#B2795E'];

export default function RollScreen({ roll }: Props) {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const remaining = remainingShots(roll);
  const taken = roll.photos.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.inkSoft }]}>EN COURS</Text>
      <Text style={[styles.title, { color: theme.ink, fontFamily: serifFont }]}>
        Pellicule N°{roll.rollNumber}
      </Text>

      <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoKey, { color: theme.inkSoft }]}>RESTANTES</Text>
          <Text style={[styles.infoValue, { color: theme.ink }]}>{remaining} / {ROLL_SIZE}</Text>
        </View>
      </View>

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

      <Text style={[styles.footerText, { color: theme.inkFaint, fontFamily: serifFont }]}>
        {remaining > 0
          ? 'Vous ne verrez rien avant demain matin. C’est la seule chose que la pellicule vous demande.'
          : 'Pellicule pleine. Le développement commence — rendez-vous demain matin.'}
      </Text>

      <Text style={[styles.navHint, { color: theme.inkSoft }]}>↓ APPAREIL</Text>
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
    marginBottom: 22,
    letterSpacing: -0.4,
  },
  infoCard: {
    borderRadius: 12,
    marginBottom: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoKey: {
    fontFamily: monoFont,
    fontSize: 13,
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  cell: {
    width: '13.6%',
    aspectRatio: 1,
    borderRadius: 3,
  },
  footerText: {
    marginTop: 26,
    fontSize: 17,
    lineHeight: 25,
  },
  navHint: {
    marginTop: 'auto',
    alignSelf: 'center',
    fontFamily: monoFont,
    fontSize: 10,
    letterSpacing: 2,
  },
});
