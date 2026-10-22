# Nexus Revision

Site public de révision pour la promo EDHEC BBA1 (track anglais, campus de Lille), créé par Alexi (GitHub : christo-cz).
Une page d'accueil (hub) qui liste les matières, et un « lab » par matière.

- En ligne : https://nexus-revision-bba1.netlify.app (projet Netlify `nexus-revision-bba1`, public, relié à ce dépôt). Chaque push sur `main` est mis en ligne automatiquement.
- Le site est statique : du HTML, CSS et JS écrits à la main, sans framework, sans build et sans serveur. Ne rien ajouter qui demande une étape de build.
- Modèle d'inspiration : le site d'un camarade (midterms-work.netlify.app), en particulier son « IT-4U Ledger Lab ». On s'en inspire pour l'ergonomie, sans copier ni son code ni son identité visuelle.

## Façon de travailler avec Alexi

- Réponds en français, de façon directe, sans flatterie. Signale clairement ce qui est incertain.
- Le site lui-même est en **anglais**, comme les cours.
- Avant un gros changement (nouveau module, refonte), propose le plan en quelques lignes et attends son accord.
- Termine chaque tâche en disant ce qui a changé et comment le vérifier en ligne.

## Structure

```
/index.html        hub Nexus : liste des matières (cartes), thème clair/sombre
/favicon.svg       logo N de Nexus (dégradé bleu → violet → rose)
/macro/index.html  « Flow », le lab de Business Economics (macroéconomie, semestre 1)
/CLAUDE.md         ce fichier
```

Une nouvelle matière = un dossier `/<matiere>/index.html` autonome, plus une carte dans `/index.html`.
Chaque page est un fichier unique : CSS et JS dans la page. Seules dépendances externes autorisées : Google Fonts.

## Principes de contenu (ce qui fait la qualité du site)

1. **Fidélité au cours.** Tout part des vrais supports (slides, feuilles de TD, annales, consignes d'examen). On calque le format réel de l'examen.
2. **Les réponses sont calculées par le code, jamais écrites à la main ni par une IA.** Un cas est décrit par ses paramètres (générateur pseudo-aléatoire avec une graine, `mulberry32`), et le programme calcule les réponses et la ligne de calcul affichée dans la correction. Résultat : toujours juste, et des exercices nouveaux à l'infini.
3. **Chaque correction montre le calcul avec les chiffres de l'étudiant, puis le « pourquoi ».**
4. **Ergonomie des full cases** :
   - énoncé (case sheet) à gauche, questions à droite ;
   - sur ordinateur, la colonne de droite défile avec un aimantage au centre (`scroll-snap-type: y mandatory`, cartes en `scroll-snap-align: center`) ;
   - le bloc de données utilisé par la question courante s'allume à gauche (IntersectionObserver) ;
   - sur téléphone, colonne unique, case sheet repliable, et chaque question rappelle ses données (`.snip`).
5. **Saisie tolérante.** Les nombres acceptent `1600`, `1,600`, `1 600`, `0,75`, `0.75`, `4.2%` (fonction `parseNum`). La tolérance d'erreur est définie par question.
6. **Progression** enregistrée uniquement dans le navigateur (`localStorage`, clé `flow-v1` pour la macro, `nexus-theme` pour le thème, partagé par le hub et tous les labs). Chaque lecture et écriture est protégée par un try/catch. Pas de compte utilisateur.
7. **Juridique.** Pas de logo ni de charte EDHEC. Garder la mention « A student project to help with revision. Not an official EDHEC website. » Ne pas reprendre mot pour mot de longs passages des slides : reformuler.

## Identité visuelle

- Polices : Familjen Grotesk (titres), Public Sans (texte), JetBrains Mono (chiffres et calculs).
- Hub : encre neutre, avec le dégradé Nexus (#3B5BFF → #8E6CFF → #FF5FA2) comme seule touche.
- Chaque lab a sa couleur. Flow (macro) utilise :
  - teal `--flow` pour la production et le revenu ;
  - ambre `--inj` pour les injections (I, G, X) ;
  - corail `--leak` pour les fuites (S, T, M).
- Mode clair et mode sombre, définis par des variables CSS. Bouton de thème cyclique système / clair / sombre.
- Tout doit fonctionner à 390 px de large, sans défilement horizontal.

## Lab « Flow » : Business Economics, macroéconomie (S1)

Professeurs : S. Clot, Q. Deme, A. Safa. 36 h, 4 ECTS.

**Évaluation :**
- 40 % de contrôle continu en groupe :
  - 30 % pour un projet de groupe de 7 à 8 personnes : débat structuré où le groupe défend les deux côtés du sujet, rapport de 8 à 10 pages, 45 minutes ;
  - 10 % pour les TD, en groupes de 4 : un exercice rendu est tiré au sort.
- 60 % pour l'examen final, en deux parties :
  - des **questions ouvertes** sur le contenu des cours ;
  - un **exercice semblable à ceux des TD**.
- Un examen blanc est corrigé avant le final.

**Plan du cours :**
1. Introduction.
2. et 3. Histoire de la pensée économique : bloc asynchrone.
4. Représentation de l'activité économique (chapitre 2).
5. Déterminants fondamentaux de l'activité (chapitre 3).
6. TD.
7. Croissance (chapitre 4).
8. Inflation et monnaie.
9. TD.
10. Marché du travail.
11. Politiques économiques.
12. TD.
13. et 14. Changement climatique.
15. à 17. Débats.
18. Révision.

Le cours annonce que chaque thème est étudié sous deux angles, classique ou néoclassique et keynésien. C'est probablement l'axe des questions ouvertes.

**Contenu déjà couvert dans les full cases** (chapitres 2 à 4), 30 questions en 5 blocs :
- **A. Chaîne de production** : valeur ajoutée, PIB par la production, double comptage, approche par les revenus (salaires + profits).
- **B. Comptes nationaux** :
  - Y = C + I + G + (X − M) ;
  - demande intérieure C + I + G ;
  - demande extérieure nette X − M ;
  - fuites W = S + T + M et injections J = I + G + X : elles sont égales dans les comptes, mais S ≠ I, T ≠ G et M ≠ X pris un par un ;
  - solde budgétaire G par rapport à T.
- **C. Un ménage** :
  - Yd = Y − T ;
  - C = C₀ + cYd ;
  - S = Yd − C = sYd − C₀ ;
  - APC = C/Yd et APS = 1 − APC ;
  - c + s = 1 ;
  - revenu seuil Y_R = C₀/(1 − c) = C₀/s ;
  - loi psychologique de Keynes : l'APC baisse quand le revenu monte (Kuznets : vrai à court terme, stable à long terme).
- **D. Multiplicateur** :
  - k = 1/(1 − c) = 1/s ;
  - ΔY = k × ΔI ;
  - il est plus fort quand la propension marginale à épargner est faible, l'économie peu ouverte et les capacités sous-utilisées.
- **E. Croissance** :
  - taux = (PIB n+1 − PIB n) / PIB n × 100 ;
  - PIB nominal (prix courants) et PIB réel (prix de l'année de base) ;
  - PIB par habitant ;
  - PNB = PIB + revenus reçus de l'étranger − revenus versés à l'étranger ;
  - ralentissement (croissance positive mais plus faible), récession (au moins 2 trimestres consécutifs de baisse, définition INSEE), dépression (récession de plusieurs années).

**Autres notions du cours, pas encore exploitées :**
- les 5 agents économiques ;
- le circuit simplifié et le circuit ouvert ;
- le choix intertemporel de Fisher (le taux d'intérêt comme récompense de l'épargne) ;
- la fonction d'investissement I = f(i), décroissante ;
- les autres déterminants de l'investissement : anticipations, technologie, taux d'utilisation des capacités, politiques publiques ;
- la PPA et l'indice Big Mac ;
- les limites du PIB et l'IDH ;
- la croissance endogène et exogène ;
- Schumpeter : destruction créatrice, cycles de Kondratiev.

**Bloc asynchrone d'histoire de la pensée** (moins prioritaire selon Alexi, mais utile pour les questions ouvertes) :
- mercantilisme : la richesse, c'est l'or ; excédent commercial ; protectionnisme ;
- physiocratie : Quesnay ; seule l'agriculture est productive ; « laissez faire, laissez passer » ;
- classiques :
  - Smith : main invisible ;
  - Ricardo : avantage comparatif ;
  - Say : l'offre crée sa propre demande ;
  - Mill : neutralité de la monnaie ;
  - théorie de la valeur : valeur d'échange et valeur travail chez les Anglais, valeur d'usage chez les Français ;
  - État minimal ;
- théorie quantitative de la monnaie (Bodin, Hume) ;
- néoclassiques : Walras, Menger, Marshall, Pareto ; crise de 1929 ;
- Keynes (1936) :
  - analyse globale ;
  - monnaie non neutre, avec trois motifs de détention : transaction, précaution, spéculation ;
  - demande effective ;
  - État-providence et politique contracyclique ;
  - exemples du Covid et de 2008.

## Ce qui reste à faire (dans cet ordre, sauf avis contraire d'Alexi)

1. **Caler les full cases sur les vraies feuilles de TD** dès qu'Alexi les fournit. Pour l'instant, le format des exercices est déduit des slides seulement.
2. Onglet **Learn** : une fiche par chapitre (la règle en une ligne, la formule, un exemple, le piège classique).
3. Onglet **Drills** : séries rapides (fuite ou injection, MPC/APC, nominal ou réel, quelle école de pensée).
4. **Frise des écoles de pensée**, des mercantilistes à Keynes : leur vision de la richesse, de l'État et de la monnaie.
5. **Entraîneur aux questions ouvertes** : question type examen, réponse modèle, grille de points à cocher.
6. **Flashcards**.
7. Ajouter les chapitres suivants (inflation et monnaie, marché du travail, politiques, climat) quand les slides sont disponibles.
8. Plus tard, en option : un assistant IA limité au sujet de la matière. Il faudrait une Netlify Function avec une clé API côté serveur, **une vraie limite côté serveur** (pas seulement dans le navigateur) et un plafond de dépense. À ne faire qu'avec l'accord d'Alexi, car cela coûte de l'argent à chaque question.

## Vérifier avant de pousser

- Ouvrir chaque page modifiée sur ordinateur et à 390 px de large, en clair et en sombre : pas d'erreur dans la console, pas de défilement horizontal.
- Pour un générateur de cas : générer au moins 50 graines et vérifier que toutes les réponses sont des nombres finis et que les données restent cohérentes (par exemple S > 0 et T > 0).
