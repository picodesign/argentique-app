// Écran Réglages (canevas Pellicule.dc.html, round 6A — "PROFIL · RÉGLAGES").
// Le canevas montre un nom d'utilisateur ("Marion") : ce projet n'a pas de
// compte, donc on affiche un titre générique et des stats réelles à la
// place, sans inventer d'identité.
import type { ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, useColorScheme, View } from 'react-native';
import { colors, monoFont, serifFont, type Theme } from '../theme';
import { FILMS } from '../lib/films';
import type { Roll } from '../lib/pellicule';

type Props = {
  archives: Roll[];
  currentRoll: Roll | null;
  purchasedFilmIds: string[];
  notifyOnRenewal: boolean;
  canLoadNewRoll: boolean;
  hoursUntilRenewal: number;
  debugTimeOffsetMs: number;
  onToggleNotify: (value: boolean) => void;
  onAdvanceTime: (ms: number) => void;
  onResetDebugTime: () => void;
  onFillRoll: () => void;
  onResetAll: () => void;
  onClose: () => void;
};

const HOUR = 60 * 60 * 1000;

function ravitaillementLabel(props: Pick<Props, 'currentRoll' | 'canLoadNewRoll' | 'hoursUntilRenewal'>) {
  if (props.currentRoll) return 'Pellicule en cours';
  if (props.canLoadNewRoll) return 'Le tiroir vous attend';
  return `Dans ${props.hoursUntilRenewal}h`;
}

export default function SettingsScreen({
  archives,
  currentRoll,
  purchasedFilmIds,
  notifyOnRenewal,
  canLoadNewRoll,
  hoursUntilRenewal,
  debugTimeOffsetMs,
  onToggleNotify,
  onAdvanceTime,
  onResetDebugTime,
  onFillRoll,
  onResetAll,
  onClose,
}: Props) {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const ownedPayantes = FILMS.filter((f) => !f.gratuite && purchasedFilmIds.includes(f.id));
  const offsetHours = Math.round(debugTimeOffsetMs / HOUR);

  const confirmReset = () => {
    Alert.alert(
      'Tout effacer ?',
      'Pellicule en cours, archives, achats et horloge de test seront remis à zéro — comme au tout premier lancement.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Effacer', style: 'destructive', onPress: onResetAll },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={onClose} hitSlop={12} style={styles.back}>
          <Text style={[styles.backChevron, { color: theme.ink }]}>‹</Text>
        </Pressable>

        <Text style={[styles.label, { color: theme.inkSoft }]}>RÉGLAGES</Text>
        <Text style={[styles.title, { color: theme.ink, fontFamily: serifFont }]}>Réglages</Text>
        <Text style={[styles.subtitle, { color: theme.inkFaint }]}>
          {archives.length} pellicule{archives.length > 1 ? 's' : ''} développée{archives.length > 1 ? 's' : ''}
        </Text>

        <Section title="RAVITAILLEMENT" theme={theme}>
          <Row theme={theme} label="Prochaine pellicule" value={ravitaillementLabel({ currentRoll, canLoadNewRoll, hoursUntilRenewal })} last={false} />
          <View style={[styles.rowBase, { paddingVertical: 15 }]}>
            <Text style={[styles.rowLabel, { color: theme.ink }]}>Me prévenir quand elle arrive</Text>
            <Switch
              value={notifyOnRenewal}
              onValueChange={onToggleNotify}
              trackColor={{ false: theme.hairline, true: theme.accent }}
              thumbColor={theme.surface}
            />
          </View>
        </Section>

        <Section title="PELLICULES CUSTOM" theme={theme}>
          <Row theme={theme} label="Emplacement libre" value="Bientôt" muted last={false} />
          <Row theme={theme} label="Emplacement libre" value="Bientôt" muted last={false} />
          <Row theme={theme} label="Emplacement libre" value="Bientôt" muted last />
        </Section>

        <Section title="SOUTIEN" theme={theme}>
          <Row
            theme={theme}
            label="Pellicules payantes possédées"
            value={ownedPayantes.length > 0 ? ownedPayantes.map((f) => f.nom).join(', ') : 'Aucune'}
            last
          />
        </Section>

        <Section title="OUTILS DE TEST · À RETIRER AVANT PUBLICATION" theme={theme} accent>
          <View style={[styles.rowBase, { paddingVertical: 15 }]}>
            <Text style={[styles.rowLabel, { color: theme.ink }]}>Horloge</Text>
            <Text style={[styles.rowValue, { color: theme.inkSoft }]}>
              {offsetHours === 0 ? 'temps réel' : `+${offsetHours}h`}
            </Text>
          </View>
          <View style={[styles.debugButtonRow, { borderTopColor: theme.hairline }]}>
            {[1, 8, 24, 48].map((h) => (
              <Pressable
                key={h}
                onPress={() => onAdvanceTime(h * HOUR)}
                style={({ pressed }) => [styles.debugButton, { borderColor: theme.hairline }, pressed && styles.pressed]}
              >
                <Text style={[styles.debugButtonText, { color: theme.ink }]}>+{h}h</Text>
              </Pressable>
            ))}
          </View>
          <DebugAction theme={theme} label="Remettre l'horloge à zéro" onPress={onResetDebugTime} />
          <DebugAction
            theme={theme}
            label="Remplir la pellicule en cours"
            disabled={!currentRoll}
            onPress={onFillRoll}
          />
          <DebugAction theme={theme} label="Tout effacer (premier lancement)" destructive onPress={confirmReset} last />
        </Section>

        <Text style={[styles.navHint, { color: theme.inkSoft }]}>‹ FERMER</Text>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  theme,
  accent,
  children,
}: {
  title: string;
  theme: Theme;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: accent ? theme.accent : theme.inkSoft }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: theme.surfaceAlt, borderColor: theme.hairline }]}>
        {children}
      </View>
    </View>
  );
}

function Row({
  theme,
  label,
  value,
  muted,
  last,
}: {
  theme: Theme;
  label: string;
  value: string;
  muted?: boolean;
  last: boolean;
}) {
  return (
    <View style={[styles.rowBase, !last && { borderBottomWidth: 1, borderBottomColor: theme.hairline }]}>
      <Text style={[styles.rowLabel, { color: muted ? theme.inkFaint : theme.ink }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: theme.inkSoft }]}>{value}</Text>
    </View>
  );
}

function DebugAction({
  theme,
  label,
  onPress,
  disabled,
  destructive,
  last,
}: {
  theme: Theme;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  destructive?: boolean;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.rowBase,
        !last && { borderTopWidth: 1, borderTopColor: theme.hairline },
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.rowLabel,
          { color: disabled ? theme.inkFaint : destructive ? theme.accent : theme.ink },
        ]}
      >
        {label}
      </Text>
      <Text style={[styles.rowValue, { color: theme.inkSoft }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  backChevron: {
    fontSize: 26,
    fontWeight: '300',
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
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 28,
  },
  section: {
    marginBottom: 26,
  },
  sectionLabel: {
    fontFamily: monoFont,
    fontSize: 10,
    letterSpacing: 1.6,
    marginBottom: 10,
  },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  rowBase: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '400',
    flexShrink: 1,
    paddingRight: 12,
  },
  rowValue: {
    fontFamily: monoFont,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  debugButtonRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  debugButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  debugButtonText: {
    fontFamily: monoFont,
    fontSize: 13,
  },
  pressed: {
    opacity: 0.6,
  },
  navHint: {
    marginTop: 8,
    alignSelf: 'center',
    fontFamily: monoFont,
    fontSize: 10,
    letterSpacing: 2,
  },
});
