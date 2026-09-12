// Catalogue des pellicules — recettes statiques (voir APP.md "Notes du
// design", canevas Pellicule.dc.html round 5B). Les couleurs sont des
// aplats de rendu (placeholder), à remplacer plus tard par de vraies
// photos une fois le rendu par recette (Skia) implémenté.
export type Film = {
  id: string;
  nom: string;
  tech: string; // ex. "400 ISO · couleur"
  iso: string;
  rendu: string;
  texte: string;
  swatches: [string, string, string, string];
  gratuite: boolean;
  prix?: string; // uniquement pour les payantes
};

export const FILMS: Film[] = [
  {
    id: 'neutre-400',
    nom: 'Neutre 400',
    tech: '400 ISO · couleur',
    iso: '400',
    rendu: 'Équilibré, grain fin',
    texte: 'La pellicule par défaut. Des couleurs justes, un grain discret — pour ne pas avoir à choisir avant de comprendre ce que vous cherchez.',
    swatches: ['#C9A876', '#8B6F47', '#4A3B2C', '#B98C63'],
    gratuite: true,
  },
  {
    id: 'contraste-100',
    nom: 'Contraste 100',
    tech: '100 ISO · couleur',
    iso: '100',
    rendu: 'Punchy, ombres profondes',
    texte: 'Plus lente, plus dense. Les couleurs se resserrent, les ombres se creusent — pour les journées de plein soleil.',
    swatches: ['#2B4C6F', '#C9563C', '#1A1410', '#7A8B94'],
    gratuite: true,
  },
  {
    id: 'argent-nb',
    nom: 'Argent N&B',
    tech: '400 ISO · noir & blanc',
    iso: '400',
    rendu: 'Contraste classique',
    texte: 'Sans couleur, pour ne garder que la forme et la lumière. La plus ancienne des trois, la plus sobre.',
    swatches: ['#3A3A3A', '#8A8A8A', '#D8D8D8', '#5C5C5C'],
    gratuite: true,
  },
  {
    id: 'nuit-3200',
    nom: 'Nuit 3200',
    tech: '3200 ISO · couleur',
    iso: '3200',
    rendu: 'Grain marqué, dominante chaude',
    texte: 'Poussée pour la lumière basse. Le grain devient visible, les jaunes et les oranges débordent — faite pour les intérieurs et les soirs.',
    swatches: ['#1B2340', '#C9563C', '#F2C879', '#3A2E1A'],
    gratuite: false,
    prix: '1,99 €',
  },
  {
    id: 'ambre',
    nom: 'Ambre',
    tech: '200 ISO · couleur',
    iso: '200',
    rendu: 'Chaude, teinte ancienne',
    texte: 'Une dominante chaude et un léger voile, comme des photos qui auraient déjà un peu vieilli en sortant du bain.',
    swatches: ['#D9A548', '#B5651D', '#5C3A21', '#E8C888'],
    gratuite: false,
    prix: '1,49 €',
  },
  {
    id: 'polaire',
    nom: 'Polaire',
    tech: '400 ISO · couleur',
    iso: '400',
    rendu: 'Froide, désaturée',
    texte: 'Les couleurs se retirent, tout devient un peu plus gris et un peu plus bleu. Pour les jours où la lumière est déjà froide.',
    swatches: ['#7FA8B8', '#B8C9C4', '#3D4F52', '#9FB6BA'],
    gratuite: false,
    prix: '1,49 €',
  },
];

export function getFilm(id: string): Film | undefined {
  return FILMS.find((f) => f.id === id);
}

export function isFilmOwned(film: Film, purchasedFilmIds: string[]): boolean {
  return film.gratuite || purchasedFilmIds.includes(film.id);
}
