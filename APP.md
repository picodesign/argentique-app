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

## Règles du jeu (décidées le 11/09/2026, révisées le 12/09/2026)

| Règle | Décision |
|---|---|
| Taille d'une pellicule | **Réglage utilisateur : 24 ou 36 photos** (défaut 36) — n'est plus fixe. Pas encore implémenté. |
| Renouvellement | **Plus de pause forcée.** Rechargement manuel via le tiroir, dès que la pellicule précédente est sauvegardée — pas de minuteur. Remplace l'ancienne pause de 48h (voir section dédiée ci-dessous, obsolète). |
| Développement | **Réglage utilisateur : 2h à 8h** (défaut 2h), plus le point fixe "8h du matin le lendemain". Pas encore implémenté. |
| Sauvegarde | **Nommer la pellicule = la sauvegarder**, obligatoire à la fin de la révélation. Crée un album natif (Photos/Google Photos) au nom de la pellicule ; la copie privée de l'app est ensuite effacée. Voir section dédiée. Pas encore implémenté. |
| Photos finies avant la fin du cycle | On attend d'avoir fini les vues restantes — plus de "cycle" temporel puisqu'il n'y a plus de pause de renouvellement. |
| Suppression | Jamais (les photos quittent le stockage privé de l'app seulement pour rejoindre la galerie du téléphone, jamais supprimées). |
| Import galerie | Interdit |
| Notification | À revoir : l'ancienne règle "une seule, à 5 photos restantes" tient toujours, mais le toggle "me prévenir quand elle arrive" construit dans Réglages n'a plus de sens sans pause de renouvellement — **incohérence à trancher**, voir "Questions en attente". |
| Modèle économique | Gratuit intégralement. Pellicules spéciales en achat unique (1-2 €), possédées à vie. |
| Catalogue au lancement | 3 pellicules payantes maximum |

Ces révisions viennent d'une discussion avec un autre agent (12/09/2026,
voir mémoire `project_pellicule_roll_lifecycle`) : conclusion que finir 36
vues + attendre le développement est déjà assez de friction/rituel, une
pause bloquante en plus punissait justement les utilisateurs les plus
enthousiastes.

**Point à surveiller au test** (obsolète avec la suppression de la pause de
renouvellement, gardé pour mémoire) : quelqu'un qui utilise ses 36 photos
en 3 jours restait bloqué 11 jours avec l'ancienne règle.

---

## Personnalité de la marque

Calme, sobre, un peu artisanale. L'app parle peu et ne relance jamais.
Elle ressemble davantage à un carnet qu'à une application photo.
Aucun compteur de likes, aucune pression sociale.

## Direction visuelle — « carnet le jour, chambre noire la nuit »

Validée avec le designer (canevas `Pellicule.dc.html`, round 4A retenu,
étendu par 5A/5B/6A). Le papier est l'état normal de l'app ; le noir
n'apparaît que dans les deux moments où la lumière compte : la visée et
la révélation. Pas de tab bar — un seul axe vertical (appareil au centre,
pellicule au-dessus, archives en dessous).

### Couleurs (alignées sur le canevas de design)

Mode clair
- Fond : `#E8E4DA`
- Surface : `#F3F0E8` / Surface alt : `#EFEBE2`
- Texte principal : `#2B2620` (encre)
- Texte secondaire : `#8A7F6F` · Texte atténué : `#6D6459`
- Trait / séparateur : `#D5CDBD`
- Accent : `#C9563C`

Mode sombre
- Fond : `#131110`
- Surface : `#1C1A18` / Surface alt : `#191715`
- Texte principal : `#EFE9DC`
- Texte secondaire : `#8D8579` · Texte atténué : `#C4BCAE`
- Trait / séparateur : `rgba(233,227,214,0.15)`
- Accent : `#C9563C`

### Typographie

- Titres : **Newsreader** (serif éditoriale, graisse 300) — `@expo-google-fonts/newsreader`
- Indicateurs techniques (compteurs, dates, labels d'écran) : **IBM Plex Mono** — `@expo-google-fonts/ibm-plex-mono`
- Polices chargées dans `App.tsx` via `expo-font` (`useFonts`) — dépendance native, nécessite un rebuild après ajout.

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

## Règle de renouvellement — HISTORIQUE, remplacée le 12/09/2026

**Obsolète.** Cette section documentait la pause de 48h après révélation
complète. Décision du 12/09/2026 (même jour, discussion séparée) : cette
pause est purement et simplement supprimée — voir la table "Règles du jeu"
ci-dessus et `project_pellicule_roll_lifecycle` en mémoire. Gardée ici pour
comprendre le code existant (`lib/pellicule.ts` implémente encore cette
règle : `canStartNewRoll`, `renewalRemainingMs`, la pause de 48h — **à
retirer** quand le rechargement manuel sans pause sera codé) :

- Développement : 8h00 le lendemain matin de l'instant où la pellicule
  devient pleine (pas l'heure de chargement). → remplacé par un réglage
  2h-8h, probablement plus ancré à un point fixe du matin (à confirmer).
- Révélation : obligatoirement dans l'ordre, une photo à la fois, après le
  développement — jamais de vue anticipée avant la fin des 36. **Toujours
  valable, inchangé.**
- ~~Pause de renouvellement : 48h fixes après la dernière révélation~~ →
  **supprimée**, rechargement manuel immédiat via le tiroir.

## État d'avancement

- [x] Brief produit validé
- [x] Règles du jeu et direction visuelle décidées
- [x] Règle de renouvellement revue (pause de 48h après révélation complète, au lieu des 14 jours initiaux)
- [x] Direction visuelle du design implémentée : couleurs + polices (Newsreader / IBM Plex Mono) dans `theme.ts`, `App.tsx`
- [x] Écran appareil photo restylé selon le canevas (cadre de visée, indicateurs mono, sans flash/grille — le design ne les montre plus)
- [x] Écran pellicule en cours restylé (grille des 36 cases, indicateurs mono)
- [x] Modèle de données : `lib/pellicule.ts` remplace `lib/roll.ts`. Stockage
      `{ current: Roll | null, archives: Roll[] }` (clé AsyncStorage
      `pellicule/state`). États dérivés via `getRollStatus()` :
      `en_cours` → `pleine_en_attente` (dès 36 photos, jusqu'à 8h le
      lendemain) → `prête` → `en_revelation` (révélation photo par photo,
      dans l'ordre) → `terminee`. Une fois `terminee`, la pellicule part
      dans `archives` et `current` repasse à `null` ("à sec") jusqu'à ce que
      `canStartNewRoll()` autorise une nouvelle pellicule (48h fixes après
      `lastRevealedAt` de la dernière archive) — alors une nouvelle
      pellicule démarre automatiquement (pas de tiroir de choix pour
      l'instant, une seule pellicule gratuite). `App.tsx`/`RollScreen.tsx`
      mis à jour pour ce nouveau modèle ; état "à sec" traité pour l'instant
      par un écran minimal de repli (pas le design final, voir écran
      développement ci-dessous).
- [x] Écran développement différé (`DevelopmentScreen.tsx`) — chambre noire
      toujours sombre, liste des photos "au bain" (heure + numéro), pas de
      compte à rebours visible, juste le texte "le grain se densifie
      jusqu'à l'aube".
- [x] Écran galerie / révélation (`GalleryScreen.tsx`) — une photo réelle à
      la fois (Image sur l'URI stockée), tap plein écran pour révéler la
      suivante via `revealNextPhoto()`, toujours sombre.
- [x] Écran archives (`ArchivesScreen.tsx`) — liste des pellicules
      terminées avec vignettes réelles (grille 6 colonnes), compteur total
      de photos, suit le thème clair/sombre du téléphone.
- [x] Navigation : pager vertical dans `App.tsx` (`ScrollView` `pagingEnabled`,
      3 pages : pellicule au-dessus / appareil au centre — page de départ —
      / archives en dessous), remplace l'ancien toggle `camera`/`roll`.
      `RollAreaScreen.tsx` choisit l'écran de la position "pellicule" selon
      `getRollStatus()` (grille en cours → développement → galerie).
      Barre système claire/sombre suit la page active. **À vérifier dans le
      simulateur** : le swipe vertical, le tap sur le titre de l'appareil
      pour remonter à la pellicule, et l'enchaînement automatique
      développement → galerie → archives quand une pellicule se termine.
- [x] Bug corrigé : pendant la pause "à sec" (48h), `App.tsx` remplaçait
      tout l'écran par un message plein écran — le pager disparaissait,
      rendant appareil et archives inaccessibles. `RollAreaScreen.tsx`
      gère maintenant `roll: Roll | null` (nouvel écran `DryScreen` interne,
      suit le thème clair/sombre comme les autres écrans hors chambre
      noire) ; le pager à 3 pages reste actif dans tous les états.
      Typecheck passe.
- [ ] **Encore à vérifier dans le simulateur** (impossible à tester par
      l'agent — pas de preview web pour un projet natif) : swipe vertical
      entre les 3 pages, tap sur le titre pellicule pour remonter, et
      l'enchaînement automatique pellicule pleine → développement → galerie
      → archives → (pause "à sec" avec pager toujours utilisable) → nouvelle
      pellicule.
- [x] **Tiroir à pellicules** (`lib/films.ts`, `components/FilmDrawerScreen.tsx`) —
      catalogue statique de 6 recettes (3 gratuites : Neutre 400, Contraste
      100, Argent N&B · 3 payantes achetables une fois, sans vrai paiement :
      Nuit 3200, Ambre, Polaire — couleurs et fiches techniques inventées,
      placeholders à ajuster). `lib/pellicule.ts` ne démarre plus jamais de
      pellicule automatiquement : `Roll` porte maintenant un `filmId`,
      `startNewRoll(state, filmId)` remplace l'ancienne logique auto (appelé
      depuis le tiroir), `purchaseFilm(state, filmId)` persiste les achats
      (`purchasedFilmIds` dans le state). `RollAreaScreen` affiche le tiroir
      (liste → fiche → chargement, 3 écrans internes à
      `FilmDrawerScreen.tsx`) dès que `current` est `null` ET que la pause de
      48h est passée (ou premier lancement) ; sinon toujours `DryScreen`
      (compte à rebours). **À vérifier dans le simulateur** (pas de preview
      web pour ce projet natif) : premier lancement → le tiroir s'affiche
      directement (plus de pellicule n°1 auto-créée) ; tap sur une pellicule
      gratuite → fiche → "CHARGER" → écran de chargement sombre → "CHARGER ET
      COMMENCER" démarre bien la pellicule ; tap sur une payante → bouton
      "ACQUÉRIR · prix" → passe en "CHARGER" après achat simulé ; le pager à
      3 pages reste utilisable pendant tout ce flux.
- [x] **Écran réglages/profil** (`SettingsScreen.tsx`, canevas round 6A) —
      ouvert en modal (slide up) depuis un lien « RÉGLAGES › » en haut de
      l'écran Archives (pas dans le pager vertical, comme dans le canevas ;
      pas de nom d'utilisateur inventé — titre générique + vraies stats).
      Sections : Ravitaillement (statut prochaine pellicule + toggle
      « me prévenir », préférence persistée mais pas encore reliée à une
      vraie notification), Pellicules custom (3 emplacements « Bientôt »,
      pas d'éditeur), Soutien (liste des payantes possédées). **Section
      Outils de test** ajoutée à la demande de l'utilisateur, pas dans le
      canevas — avancer l'horloge de l'app (+1h/+8h/+24h/+48h via un
      décalage persisté dans `PelliculeState.debugTimeOffsetMs`, appliqué
      partout où `lib/pellicule.ts` calcule un timing via la nouvelle
      fonction `getNow()`), remplir la pellicule en cours instantanément
      (`fillRollForTesting`, photos factices à URI vide), et tout effacer
      pour retester le premier lancement (`resetPellicule`, confirmation
      via `Alert`). **À retirer avant toute publication** — clairement
      labellisée comme telle dans l'écran.
- [ ] Rappel notifié à 5 photos restantes ET notification de renouvellement
      (`expo-notifications`, dépendance native à ajouter — le toggle
      « me prévenir » existe déjà dans Réglages mais n'est pas encore relié)

## Notes du design (canevas `Pellicule.dc.html`)

- Round retenu : 4A, étendu par 5A (ambiances de l'écran développement),
  5B (tiroir à pellicules), 6A (états du viseur, réglages/profil).
- Le tiroir est un choix avant chargement, jamais après — pas de stock
  mensuel. Les pellicules achetées restent acquises pour toujours.
- Les pellicules « custom » (recettes perso) vivent dans Réglages, pas
  dans le tiroir — juste des emplacements achetables pour l'instant,
  pas d'éditeur de recette détaillé dans le canevas.

## Onboarding (décidé en discussion le 12/09/2026, pas encore construit)

L'app n'a aujourd'hui aucun onboarding. Forme décidée avec un autre agent,
détail dans `project_pellicule_onboarding_parked` en mémoire — écrans pas
encore dessinés, en attente du designer :

- **Style « option A »** : une courte séquence d'écrans explicatifs avant
  la toute première utilisation (les photos restent cachées jusqu'au
  développement, etc.) — pas de tooltips contextuels pendant l'usage réel.
- Deux réglages posés pendant l'onboarding (les seuls, choix explicite de
  favoriser le fonctionnel sur l'esthétique — pas de choix clair/sombre ou
  de petit nom du carnet à ce stade) :
  - Temps de développement (2h à 8h, défaut 2h)
  - Taille de la pellicule (24 ou 36, défaut 36)
- Nombre d'écrans, copy et visuels encore à faire — nécessite le designer.

## Sauvegarde native obligatoire (décidé le 12/09/2026, pas encore codé)

Remplace l'ancien comportement où les photos révélées restaient
uniquement dans le stockage privé de l'app indéfiniment. Détail complet
dans `project_pellicule_roll_lifecycle` en mémoire :

1. À la fin de la révélation d'une pellicule, **nommer la pellicule est
   obligatoire** (pas de bouton "passer", mais pas chronométré — au rythme
   de l'utilisateur) et déclenche la sauvegarde.
2. Nommer crée un **album natif** (Photos iOS / Google Photos) portant le
   nom donné — un album par pellicule, jamais un album unique qui mélange
   tout.
3. La copie privée de l'app est ensuite effacée : les photos ne vivent
   plus que dans la galerie du téléphone.
4. Une modale de confirmation informe l'utilisateur et l'invite à
   envisager d'imprimer l'album.

**Pourquoi** : (a) le risque de sauvegarde repose sur le système
(iCloud/Google Photos) plutôt que sur l'app ; (b) un album par pellicule
encourage à vraiment parcourir/imprimer par voyage ou occasion ; (c) ça
empêche aussi de "tricher" en allant fouiller la galerie avant la fin de
la révélation, puisque rien n'y arrive avant que la pellicule soit
entièrement révélée et nommée.

**Cas limite non tranché** : que se passe-t-il si l'utilisateur quitte
l'app en pleine révélation, avant de nommer/sauvegarder ? La pellicule
terminée mais non nommée doit rester récupérable au prochain lancement,
pas perdue. À trancher avant de coder ce flux.

**Dépendance native à ajouter** : `expo-media-library` (permissions
d'écriture galerie à déclarer dans `app.json`, rebuild nécessaire).

## Questions en attente pour le designer (posées le 12/09/2026, mises à jour)

Chantiers identifiés lors d'une relecture du canevas 6A et d'une
discussion séparée sur le fonctionnement de l'app, mis en pause en
attendant ses réponses :

1. **Navigation façon 6A** — le canevas décrit un viseur permanent en fond,
   un tiroir tiré vers le haut (bottom sheet) pour la pellicule/le choix de
   film, et les archives tirées depuis le bord droit — remplace le pager
   vertical 3 pages actuel. Questions posées : hauteur du tiroir (partielle
   ou plein écran), existence d'un retour clavier/bouton en plus du geste
   (accessibilité), et le texte « vous ne verrez rien avant demain matin »
   (round 4A) qui reste vrai seulement si la pellicule est pleine.
2. **Rendu par pellicule pour un aperçu en direct** — `lib/films.ts` n'a
   que 4 couleurs d'aplat inventées par l'agent par film, jamais validées.
   Demandé : des valeurs de rendu réelles (teinte/contraste/grain) avant
   de coder un filtre en temps réel dans le viseur (piste technique
   retenue : `@shopify/react-native-skia` en calque au-dessus d'`expo-camera`,
   pas encore installé).
3. Question annexe : existence (ou non) d'un tampon de date prévu sur les
   photos elles-mêmes — rien de tel dans le code actuel ni dans le canevas
   synchronisé, l'utilisateur en a vu un et on n'a pas encore identifié où.
4. **Suppression de la pause de renouvellement** — l'écran "VISEUR À SEC"
   du canevas 6A montre un compte à rebours vers une date fixe ("Prochaine
   pellicule, mardi 24 septembre"). Cette pause n'existe plus (voir
   "Règles du jeu" ci-dessus) : le rechargement est manuel et immédiat via
   le tiroir. Cet écran doit donc changer de message — quelque chose comme
   une invitation à ouvrir le tiroir plutôt qu'un décompte. À redessiner.
5. **Deux nouveaux écrans à concevoir** : l'onboarding (séquence
   explicative avant la première utilisation + 2 réglages, voir section
   dédiée) et l'étape "nommer sa pellicule" en fin de révélation
   (obligatoire, déclenche la sauvegarde vers un album natif + une modale
   de confirmation). Aucun des deux n'existe dans le canevas actuel.
6. **Réglage taille de pellicule (24 ou 36 photos)** — les grilles du
   canevas (pellicule en cours, archives) sont toutes pensées pour 36 en
   6 colonnes. Est-ce que la grille doit s'adapter visuellement pour 24,
   ou garder la même mise en page avec moins de cases ?

**Ne pas commencer le code de ces chantiers avant retour du designer.**

## Corrections du 12/09/2026 (retours utilisateur)

- Le badge « ● PRÊT » en rouge dans le viseur a été retiré : il venait par
  erreur de la ronde **1A** (première exploration, explicitement
  abandonnée), pas de la direction retenue (4A → 6A). Le chrome du viseur
  (`CameraScreen.tsx`) suit maintenant fidèlement le round 6A : compteur
  `X/36` toujours visible en haut à gauche, nom de la pellicule chargée +
  date de chargement en haut à droite, aucun élément coloré/statut. État
  « boîtier vide » ajouté (obturateur barré, message discret) pour le cas
  où le viseur est affiché sans pellicule en cours — ce cas n'était pas du
  tout traité visuellement avant.
- Archives : taper sur une pellicule ouvre maintenant sa grille de photos
  en plus grand format (modal), plutôt que rien. Décision utilisateur :
  grille agrandie seulement, pas de visionneuse photo par photo pour les
  archives (contrairement à la révélation qui reste photo par photo).

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
