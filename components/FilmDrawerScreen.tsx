// Le tiroir à pellicules — voir APP.md ("Prochaine étape : tiroir à
// pellicules") et le canevas de design (round 5B, écrans 06/07/08).
// Choix fait UNIQUEMENT avant le chargement, jamais après : une fois une
// pellicule chargée, on ne la change plus avant la fin des 36 vues.
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, monoFont, serifFont, type Theme } from '../theme';
import { FILMS, getFilm, isFilmOwned, type Film } from '../lib/films';

type Props = {
  purchasedFilmIds: string[];
  nextRollNumber: number;
  onLoadFilm: (filmId: string) => void;
  onPurchaseFilm: (filmId: string) => void;
};

type Screen = 'liste' | 'fiche' | 'chargement';

export default function FilmDrawerScreen({ purchasedFilmIds, nextRollNumber, onLoadFilm, onPurchaseFilm }: Props) {
  const [screen, setScreen] = useState<Screen>('liste');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openFiche = (filmId: string) => {
    setSelectedId(filmId);
    setScreen('fiche');
  };

  if (screen === 'fiche' && selectedId) {
    const film = getFilm(selectedId)!;
    const owned = isFilmOwned(film, purchasedFilmIds);
    return (
      <FilmFicheScreen
        film={film}
        owned={owned}
        onBack={() => setScreen('liste')}
        onAcquerir={() => onPurchaseFilm(film.id)}
        onCharger={() => setScreen('chargement')}
      />
    );
  }

  if (screen === 'chargement' && selectedId) {
    const film = getFilm(selectedId)!;
    return (
      <FilmChargementScreen
        film={film}
        onCharger={() => onLoadFilm(film.id)}
        onChoisirAutre={() => setScreen('liste')}
      />
    );
  }

  return (
    <FilmListeScreen
      purchasedFilmIds={purchasedFilmIds}
      nextRollNumber={nextRollNumber}
      onOpenFiche={openFiche}
    />
  );
}

function FilmListeScreen({
  purchasedFilmIds,
  nextRollNumber,
  onOpenFiche,
}: {
  purchasedFilmIds: string[];
  nextRollNumber: number;
  onOpenFiche: (filmId: string) => void;
}) {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const possedees = FILMS.filter((f) => isFilmOwned(f, purchasedFilmIds));
  const aAcquerir = FILMS.filter((f) => !isFilmOwned(f, purchasedFilmIds));

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.label, { color: theme.inkSoft }]}>TIROIR</Text>
      <Text style={[styles.title, { color: theme.ink, fontFamily: serifFont }]}>Pellicules</Text>
      <Text style={[styles.subtitle, { color: theme.inkFaint, fontFamily: serifFont }]}>
        Le choix se fait au chargement. Ensuite, 36 photos avec.
      </Text>

      <Text style={[styles.sectionLabel, { color: theme.inkSoft }]}>DANS VOTRE TIROIR</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        {possedees.map((film, i) => (
          <FilmRow
            key={film.id}
            film={film}
            theme={theme}
            trailing={film.gratuite ? 'GRATUITE' : 'POSSÉDÉE'}
            showDivider={i > 0}
            onPress={() => onOpenFiche(film.id)}
          />
        ))}
      </View>

      {aAcquerir.length > 0 && (
        <>
          <Text style={[styles.sectionLabel, { color: theme.inkSoft, marginTop: 28 }]}>
            À ACQUÉRIR · UNE FOIS, POUR TOUJOURS
          </Text>
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            {aAcquerir.map((film, i) => (
              <FilmRow
                key={film.id}
                film={film}
                theme={theme}
                trailing={film.prix}
                trailingIsPrice
                showDivider={i > 0}
                onPress={() => onOpenFiche(film.id)}
              />
            ))}
          </View>
        </>
      )}

      <Text style={[styles.footNote, { color: theme.inkSoft }]}>
        PELLICULE N°{nextRollNumber} · PROCHAIN CHARGEMENT
      </Text>
    </ScrollView>
  );
}

function FilmRow({
  film,
  theme,
  trailing,
  trailingIsPrice,
  showDivider,
  onPress,
}: {
  film: Film;
  theme: Theme;
  trailing?: string;
  trailingIsPrice?: boolean;
  showDivider: boolean;
  onPress: () => void;
}) {
  return (
    <>
      {showDivider && <View style={[styles.divider, { backgroundColor: theme.hairline }]} />}
      <Pressable onPress={onPress} style={styles.row}>
        <View style={styles.swatchStack}>
          {film.swatches.slice(0, 3).map((c, i) => (
            <View key={i} style={[styles.swatchStrip, { backgroundColor: c }]} />
          ))}
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowNom, { color: theme.ink, fontFamily: serifFont }]}>{film.nom}</Text>
          <Text style={[styles.rowTech, { color: theme.inkSoft }]}>{film.tech}</Text>
        </View>
        {trailing && (
          <Text
            style={
              trailingIsPrice
                ? [styles.priceBadge, { color: theme.ink, borderColor: theme.ink }]
                : [styles.etat, { color: theme.inkSoft }]
            }
          >
            {trailing}
          </Text>
        )}
      </Pressable>
    </>
  );
}

function FilmFicheScreen({
  film,
  owned,
  onBack,
  onAcquerir,
  onCharger,
}: {
  film: Film;
  owned: boolean;
  onBack: () => void;
  onAcquerir: () => void;
  onCharger: () => void;
}) {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
        <Text style={[styles.backChevron, { color: theme.ink }]}>‹</Text>
      </Pressable>

      <Text style={[styles.label, { color: theme.inkSoft, marginTop: 14 }]}>{film.tech}</Text>
      <Text style={[styles.title, { color: theme.ink, fontFamily: serifFont }]}>{film.nom}</Text>

      <View style={styles.swatchGrid}>
        {film.swatches.map((c, i) => (
          <View key={i} style={[styles.swatchTile, { backgroundColor: c }]} />
        ))}
      </View>

      <Text style={[styles.subtitle, { color: theme.inkFaint, fontFamily: serifFont, marginTop: 22 }]}>
        {film.texte}
      </Text>

      <View style={[styles.card, { backgroundColor: theme.surface, marginTop: 22 }]}>
        <SpecRow label="Sensibilité" value={film.iso} theme={theme} />
        <View style={[styles.divider, { backgroundColor: theme.hairline, marginLeft: 16 }]} />
        <SpecRow label="Rendu" value={film.rendu} theme={theme} />
        <View style={[styles.divider, { backgroundColor: theme.hairline, marginLeft: 16 }]} />
        <SpecRow label="Vues" value="36" theme={theme} />
      </View>

      <View style={styles.actionArea}>
        <Pressable
          onPress={owned ? onCharger : onAcquerir}
          style={[styles.actionButton, { backgroundColor: theme.ink }]}
        >
          <Text style={[styles.actionButtonText, { color: theme.background }]}>
            {owned ? 'CHARGER' : `ACQUÉRIR · ${film.prix}`}
          </Text>
        </Pressable>
        <Text style={[styles.actionHint, { color: theme.inkSoft }]}>
          Acquise une fois, disponible pour toujours.
        </Text>
      </View>
    </ScrollView>
  );
}

function SpecRow({ label, value, theme }: { label: string; value: string; theme: Theme }) {
  return (
    <View style={styles.specRow}>
      <Text style={[styles.specLabel, { color: theme.inkFaint }]}>{label}</Text>
      <Text style={[styles.specValue, { color: theme.ink }]}>{value}</Text>
    </View>
  );
}

function FilmChargementScreen({
  film,
  onCharger,
  onChoisirAutre,
}: {
  film: Film;
  onCharger: () => void;
  onChoisirAutre: () => void;
}) {
  const dark = colors.dark; // toujours sombre, comme l'écran développement (voir APP.md)

  return (
    <View style={[styles.container, { backgroundColor: dark.background, flex: 1 }]}>
      <StatusBar style="light" />
      <Text style={[styles.label, { color: dark.accent, marginTop: 14 }]}>CHARGEMENT</Text>
      <Text style={[styles.title, { color: dark.ink, fontFamily: serifFont }]}>
        {film.nom}{'\n'}dans l'appareil
      </Text>

      <View style={[styles.chargementCard, { borderColor: dark.hairline }]}>
        <View style={styles.chargementSwatchRow}>
          {film.swatches.map((c, i) => (
            <View key={i} style={[styles.chargementSwatch, { backgroundColor: c }]} />
          ))}
        </View>
        <Text style={[styles.chargementMeta, { color: dark.inkSoft }]}>36 VUES</Text>
      </View>

      <Text style={[styles.subtitle, { color: dark.inkFaint, fontFamily: serifFont, marginTop: 26 }]}>
        Une fois chargée, on ne change plus de pellicule avant la fin des 36 vues.
      </Text>

      <View style={styles.actionArea}>
        <Pressable onPress={onCharger} style={[styles.actionButton, { backgroundColor: dark.accent }]}>
          <Text style={[styles.actionButtonText, { color: '#FDF6EC' }]}>CHARGER ET COMMENCER</Text>
        </Pressable>
        <Pressable onPress={onChoisirAutre} style={styles.secondaryButton}>
          <Text style={[styles.secondaryButtonText, { color: dark.inkSoft }]}>CHOISIR UNE AUTRE</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 48,
    flexGrow: 1,
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
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 22,
  },
  sectionLabel: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  swatchStack: {
    width: 40,
    height: 40,
    borderRadius: 6,
    overflow: 'hidden',
  },
  swatchStrip: {
    flex: 1,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowNom: {
    fontSize: 17,
  },
  rowTech: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  etat: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  priceBadge: {
    fontFamily: monoFont,
    fontSize: 12,
    letterSpacing: 0.4,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  footNote: {
    fontFamily: monoFont,
    fontSize: 10,
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 32,
  },
  back: {
    alignSelf: 'flex-start',
  },
  backChevron: {
    fontSize: 26,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  swatchTile: {
    width: '48%',
    aspectRatio: 3 / 2,
    borderRadius: 4,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  specLabel: {
    fontSize: 15,
  },
  specValue: {
    fontSize: 15,
  },
  actionArea: {
    marginTop: 30,
    gap: 10,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: monoFont,
    fontSize: 13,
    letterSpacing: 1.2,
  },
  actionHint: {
    fontSize: 13,
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: monoFont,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  chargementCard: {
    marginTop: 26,
    padding: 18,
    borderWidth: 1,
    borderRadius: 12,
    gap: 12,
  },
  chargementSwatchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chargementSwatch: {
    flex: 1,
    height: 48,
    borderRadius: 3,
  },
  chargementMeta: {
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1,
  },
});
