# Application photo inspirée de la pellicule argentique
### Brief produit — V2

---

## Vision

Créer une application qui redonne de la valeur aux souvenirs en réintroduisant la contrainte de la pellicule argentique dans un monde où les utilisateurs accumulent des milliers de photos qu'ils ne regardent presque jamais.

*L'objectif n'est pas de reproduire l'esthétique vintage de l'argentique, mais de reproduire la psychologie de la limitation.*

> Les smartphones permettent de prendre un nombre illimité de photos. Cette abondance diminue la valeur émotionnelle de chaque image. Les galeries deviennent immenses (2 000, 5 000, parfois 20 000 photos), et la majorité des clichés ne sont jamais revus.

L'application veut recréer un comportement où chaque photo est réfléchie avant d'être prise.

---

## Le problème

### Aujourd'hui

- Les photos sont gratuites
- Elles sont illimitées
- On photographie tout
- On prend plusieurs versions de la même scène
- On ne trie jamais
- On ne regarde presque jamais sa galerie

**Résultat : le souvenir perd de sa valeur.**

### À l'époque de la pellicule

- Chaque photo coûtait de l'argent
- Chaque déclenchement était réfléchi
- Les albums étaient plus petits
- Chaque image racontait une histoire

---

## Analyse concurrentielle

Contrairement à l'hypothèse initiale, il existe une catégorie établie d'applications "appareil photo jetable numérique" combinant quota de prises de vue et développement différé : **Gudak Cam**, **Dispo**, **Huji Cam**, **Dazz Cam**, **Lightsnap** notamment.

Le point commun à ces concurrents : ils vendent avant tout une esthétique vintage (grain, fuites de lumière, filtres années 90). La contrainte de quota est un ingrédient parmi d'autres, pas le cœur du produit.

| | Gudak Cam | Dispo | Notre app |
|---|---|---|---|
| **Quota** | 24 photos / rouleau | Illimité | 36 photos / pellicule |
| **Développement** | Différé (3 jours) | Différé (16h, ou instantané via pub) | Différé (délai à définir) |
| **Esthétique par défaut** | Vintage (grain, fuites de lumière) | Filtre vintage automatique | Neutre, aucun filtre imposé |
| **Monétisation** | Achat unique de l'app (0,99$) | Filtres additionnels payants | Gratuit + pellicules spéciales en achat unique (soutien) |
| **Positionnement** | Nostalgie / objet de collection | Réseau social autour du souvenir | Rareté comme mécanique de valeur, esthétique optionnelle |

**Différenciation retenue** : notre application ne vend pas d'abord une esthétique. L'expérience par défaut est neutre — aucun filtre, aucun grain imposé. La rareté est la mécanique centrale ; le style vintage devient une option cosmétique payante, et non l'identité du produit. C'est ce qui nous distingue de l'ensemble de la catégorie existante.

---

## Concept principal

L'utilisateur reçoit une "pellicule numérique" de **36 photos**. Une fois le quota atteint, il est impossible de prendre davantage de photos jusqu'à la prochaine pellicule.

Le renouvellement pourrait être : chaque mois, toutes les deux semaines, à une date choisie, ou déclenché après "développement" de la pellicule *(question encore ouverte, voir plus bas)*.

Le quota est volontairement faible afin de forcer la sélection.

---

## Proposition de valeur

L'application ne vend pas des filtres vintage. Elle vend :

- Une meilleure relation avec ses souvenirs
- Une expérience plus intentionnelle
- Un retour à la photographie consciente
- Une galerie plus qualitative
- Moins de bruit numérique

---

## Positionnement

### Ce n'est PAS

- Une application de filtres rétro
- Un appareil photo vintage
- Une simulation d'argentique
- Une application de retouche

### C'est plutôt

> "L'application qui remet de la valeur dans chaque photo."

> "Chaque photo doit compter."

*Précision importante : ce rejet du rendu vintage concerne l'expérience par défaut, gratuite. Les pellicules spéciales payantes peuvent, elles, proposer un rendu visuel proche de vraies pellicules argentiques (couleur, grain) — voir la section Modèle économique. L'app n'est donc pas "anti-vintage" par nature ; elle refuse simplement d'en faire son identité de base.*

---

## Public cible

Personnes qui :

- Aiment photographier leur quotidien
- Aiment raconter leur vie
- Sont fatiguées d'avoir des milliers de photos inutiles
- Aiment le minimalisme
- Apprécient les objets analogiques
- Recherchent une approche plus lente (slow living)
- Voyagent
- Tiennent un journal visuel

---

## Expérience utilisateur

À l'ouverture, il reste par exemple : **18 / 36 photos**. Chaque déclenchement fait descendre le compteur.

Quand il reste peu de photos : tension positive, réflexion, anticipation. Le dernier cliché devient un véritable choix.

Une fois la pellicule terminée, l'utilisateur ne peut plus photographier avant le cycle suivant. Cette frustration est volontaire et fait partie du produit.

**Les photos ne sont visibles qu'après développement** : ce délai renforce la valeur du souvenir et recrée l'attente propre à l'argentique.

---

## Décisions produit validées

| Question | Décision |
|---|---|
| Taille de la pellicule de base (gratuite) | 36 photos |
| Visibilité des photos | Développement différé (invisibles jusqu'à la fin du traitement) |
| Suppression d'une photo après la prise | Impossible, jamais — renforce la contrainte et l'engagement |
| Import de photos depuis la galerie | Interdit — uniquement l'appareil intégré, pour préserver la cohérence |
| Modèle économique | Freemium : usage de base 100% gratuit et illimité dans le temps ; pellicules spéciales en achat unique, possédées à vie |

---

## Différence fondamentale

Le cœur du projet n'est pas la technologie. Le cœur est un changement de comportement.

L'application utilise la rareté comme mécanique de design. Elle transforme une contrainte en valeur.

---

## Modèle économique

### Principe : freemium

L'application est totalement gratuite pour son usage complet : appareil photo, quota de 36 photos, développement différé, galerie, historique. Aucune fonctionnalité essentielle n'est verrouillée.

### Monétisation : pellicules spéciales

Des pellicules "réalistes" ou spéciales, avec un rendu visuel proche de vraies pellicules argentiques (couleur, grain, cast colorimétrique), sont proposées en microtransaction :

- **Prix indicatif** : 1 à 2€ par pellicule
- **Achat unique** : une fois achetée, la pellicule est possédée à vie (logique de "skin" de jeu vidéo, pas de location ni d'abonnement)
- **Aucun impact sur le gameplay de base** : quota, développement différé et contrainte restent identiques quelle que soit la pellicule choisie
- **Positionnement du paiement** : présenté comme un soutien au développement de l'app plutôt que comme un péage, pour préserver l'accessibilité et la popularité visées

*Ce choix permet de concilier deux objectifs a priori en tension : une application accessible à tous et gratuite dans son usage quotidien, et une monétisation cohérente avec la philosophie du produit (posséder un objet plutôt que payer pour un service).*

---

## Fonctionnalités

### MVP

- Appareil photo intégré (aucun import depuis la galerie)
- Compteur de photos restantes
- Pellicule de base gratuite de 36 photos
- Développement différé avant visibilité des photos
- Impossibilité de supprimer une photo après la prise
- Galerie par pellicule
- Historique des anciennes pellicules

### Version avancée

- Pellicules spéciales payantes (rendu visuel, achat unique)
- Notes associées à chaque photo
- Carte des lieux photographiés
- Statistiques annuelles
- Album imprimable
- Partage d'une pellicule complète
- Rappel lorsqu'il reste peu de photos

---

## Contraintes techniques

L'application empêche :

- Les rafales
- Les captures depuis la galerie (import interdit)
- Les imports massifs
- Les retouches excessives
- La suppression d'une photo une fois prise

L'objectif est de conserver l'authenticité de l'expérience.

---

## Inspirations

L'idée s'inspire davantage de la philosophie de l'argentique que de son esthétique, par défaut.

### Principes repris

- Rareté
- Patience
- Intention
- Sélection
- Souvenirs précieux

### Principes abandonnés par défaut (mais accessibles en option payante)

- Rendu vintage
- Faux grain
- Effets rétro
- Imitation visuelle des appareils argentiques

---

## Ce qui rend l'idée intéressante

L'innovation ne réside pas dans une nouvelle technologie. Elle réside dans une inversion de paradigme : au lieu d'ajouter des fonctionnalités, l'application retire une liberté.

Cette contrainte crée davantage de valeur émotionnelle. C'est un produit qui lutte contre l'abondance numérique plutôt que de l'encourager.

**Face à des concurrents qui vendent d'abord une nostalgie visuelle, notre différenciation tient dans le fait de vendre d'abord un comportement — l'esthétique devenant une option, jamais une obligation.**

---

## Questions stratégiques restantes

- Quelle doit être la fréquence de renouvellement de la pellicule : mensuelle, toutes les deux semaines, à date choisie, ou déclenchée par le développement de la pellicule précédente ?
- Quel délai de développement retenir (quelques heures, comme Dispo, ou plusieurs jours, comme Gudak) ?
- Quelle doit être la profondeur du catalogue de pellicules spéciales au lancement (2-3 pellicules ou une gamme plus large) ?
- La frustration créée par la limite est-elle suffisamment forte pour générer un engagement récurrent, sans décourager les nouveaux utilisateurs dès la première pellicule ?
- Faut-il un mécanisme de rappel/notification lorsqu'il reste peu de photos, et comment le formuler sans recréer une pression de type réseau social ?

---

## Conclusion

Le projet ne cherche pas à concurrencer les applications photo existantes au sens large — il occupe un espace que même ses concurrents directs (Gudak, Dispo, Huji) n'occupent pas : celui d'une contrainte de rareté sans costume vintage imposé.

Le produit repose sur une idée simple :

> **Les meilleures photos ne naissent pas de possibilités infinies, mais de contraintes bien choisies.**

L'objectif est de transformer la photographie mobile en une pratique plus consciente, plus intentionnelle et plus mémorable — tout en restant accessible et gratuite dans son usage quotidien.
