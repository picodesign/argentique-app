# APP.md — Pellicule

Document de référence du projet. Mis à jour à chaque décision importante.
Le brief complet est dans `Brief_Produit_V1.md`.

---

## En une phrase

Un appareil photo limité à 36 photos par pellicule, dont les photos ne se
révèlent que le lendemain matin. On ne vend pas une esthétique vintage,
on vend une façon plus lente de photographier.

## Pour qui

Des gens qui photographient leur quotidien, qui en ont assez d'avoir 10 000
photos jamais revues, et qui aiment les objets et les rythmes analogiques.

## Ce que l'app ne fait pas

- Pas d'import depuis la galerie du téléphone
- Pas de suppression d'une photo après la prise
- Pas de rafale
- Pas de retouche
- Aucun filtre imposé par défaut

---

## Règles du jeu (décidées le 11/09/2026)

| Règle | Décision |
|---|---|
| Taille d'une pellicule | 36 photos |
| Renouvellement | Toutes les 2 semaines (14 jours) |
| Développement | Les photos se révèlent le lendemain matin |
| Photos finies avant la fin du cycle | On attend la prochaine pellicule. Frustration volontaire. |
| Suppression | Jamais |
| Import galerie | Interdit |
| Notification | Une seule, à 5 photos restantes. Ton calme. |
| Modèle économique | Gratuit intégralement. Pellicules spéciales en achat unique (1-2 €), possédées à vie. |
| Catalogue au lancement | 3 pellicules payantes maximum |

**Point à surveiller au test** : quelqu'un qui utilise ses 36 photos en 3 jours
reste bloqué 11 jours. C'est voulu, mais c'est le principal risque d'abandon.

---

## Personnalité de la marque

Calme, sobre, un peu artisanale. L'app parle peu et ne relance jamais.
Elle ressemble davantage à un carnet qu'à une application photo.
Aucun compteur de likes, aucune pression sociale.

## Direction visuelle — « papier & encre »

Fonds crème, texte encre noire, une seule couleur d'accent utilisée avec
parcimonie (compteur, statut de développement). Beaucoup de blanc.
Typographie simple et lisible. Pas de dégradés, pas d'ombres marquées.

### Couleurs

Mode clair
- Fond : `#F6F2E9` (papier crème)
- Surface : `#FFFDF8`
- Texte principal : `#1B1A17` (encre)
- Texte secondaire : `#6E6A60`
- Trait / séparateur : `#DED8CA`
- Accent : `#B4472F` (rouge brique, très peu utilisé)

Mode sombre
- Fond : `#131210`
- Surface : `#1D1B18`
- Texte principal : `#EFEADF`
- Texte secondaire : `#9A948A`
- Trait / séparateur : `#302C26`
- Accent : `#D2694F`

---

## Écrans prévus

1. **Appareil photo** — l'écran d'accueil. Viseur plein écran, compteur de
   photos restantes, un seul bouton de déclenchement.
2. **Pellicule en cours** — 36 emplacements, remplis ou vides. On voit la
   pellicule se remplir sans voir les photos.
3. **Développement** — l'écran d'attente. Quand les photos seront prêtes.
4. **Galerie d'une pellicule** — les photos révélées, une pellicule à la fois.
5. **Archives** — l'historique des anciennes pellicules.

---

## État d'avancement

- [x] Brief produit validé
- [x] Règles du jeu et direction visuelle décidées
- [x] Écran appareil photo (viseur, compteur, flash, retour haptique)
- [x] Compteur et stockage de la pellicule (photos jamais dans la pellicule système)
- [x] Écran pellicule en cours (grille des 36 cases)
- [ ] Développement différé (minuterie "demain 8h", écran d'attente)
- [ ] Renouvellement automatique de la pellicule (toutes les 2 semaines)
- [ ] Galerie d'une pellicule développée
- [ ] Archives des anciennes pellicules
- [ ] Rappel à 5 photos restantes

## Notes techniques

- Photos stockées via `expo-file-system` dans le dossier de documents de
  l'app (`rolls/roll-N/`) — jamais via `expo-media-library`, pour qu'elles
  restent invisibles ailleurs sur le téléphone tant qu'elles ne sont pas
  "développées".
- Compteur et métadonnées persistés avec `@react-native-async-storage/async-storage`.
- Prise de vue verrouillée pendant la sauvegarde (`isCapturing`) pour éviter
  les rafales, conformément au brief.
- Pas de police custom chargée pour l'instant : polices système partout,
  avec `Georgia`/`serif` pour les titres (voir `theme.ts`). À revoir si
  l'esprit "carnet" a besoin d'une vraie serif éditoriale plus tard.
- Prochaine dépendance native à prévoir : `expo-notifications` (rappel),
  `@shopify/react-native-skia` (rendu grain/couleur des pellicules payantes).
