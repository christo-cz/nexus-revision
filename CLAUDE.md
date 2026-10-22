# Nexus Revision

Site public de révision pour la promo EDHEC BBA1 (track anglais, campus de Lille), créé par Alexi (GitHub : christo-cz).
Une page d'accueil (hub) qui liste les matières, et un « lab » par matière.

- En ligne : https://nexus-revision-bba1.netlify.app (projet Netlify `nexus-revision-bba1`, public, relié à ce dépôt). Chaque push sur `main` est mis en ligne automatiquement.
- Le site est statique : du HTML, CSS et JS écrits à la main, sans framework et sans étape de build. Ne rien ajouter qui demande une étape de build.
- Seule exception côté serveur, validée par Alexi : la fonction Netlify des avis (`netlify/functions/reviews.mjs`, route `/api/reviews`), qui stocke dans Netlify Blobs (store `reviews`). Dépendance unique : `@netlify/blobs`, déclarée dans `package.json`.
- Modèle d'inspiration : le site d'un camarade (midterms-work.netlify.app), en particulier son « IT-4U Ledger Lab ». On s'en inspire pour l'ergonomie, sans copier ni son code ni son identité visuelle.

## Façon de travailler avec Alexi

- Réponds en français, de façon directe, sans flatterie. Signale clairement ce qui est incertain.
- Le site lui-même est en **anglais**, comme les cours.
- Avant un gros changement (nouveau module, refonte), propose le plan en quelques lignes et attends son accord.
- Termine chaque tâche en disant ce qui a changé et comment le vérifier en ligne.

## Structure

```
/index.html        hub Nexus : haut de page en WebGL (feuille quadrillée en 3D), liste des matières, avis, auteur
/favicon.svg       logo N de Nexus (dégradé bleu → violet → rose)
/macro/index.html  lab « Macroeconomics » (Business Economics, semestre 1). Nom interne `flow` gardé pour les clés de stockage et l'API des avis.
/CLAUDE.md         ce fichier
/package.json      dépendance de la fonction des avis
/netlify/functions/reviews.mjs   API des avis (GET liste + résumé, POST avis, POST suppression admin)
```

## Avis des étudiants

- Étoiles 1 à 5, tags fixes (liste `TAGS` dans la fonction, à garder identique côté pages), commentaire obligatoire de 10 à 600 caractères, prénom facultatif (« BBA1 student » sinon). Liens refusés. Publication immédiate.
- Demandés sur la carte de bilan à la fin d'un cas, et via « Write a review » sur l'accueil du lab Macroeconomics. Affichés sur l'accueil du lab et résumés sur le hub (section « From the class »).
- Anti-triche côté serveur : un avis par lab et par 24 h, à la fois par IP (hachée, jamais stockée en clair) et par appareil (`nexus-did`). Champ piège `website` contre les robots.
- Mise en page volontairement différente du site de Zadig : pas d'histogramme de notes, pas de filtres en pastilles, pas de grille de cartes. Une ligne de résumé et des citations sur une colonne.
- Suppression : la variable d'environnement `ADMIN_KEY` (au moins 8 caractères) se règle dans Netlify. Ouvrir `/?admin`, saisir la clé une fois : un lien « Delete » apparaît sous chaque avis (hub et labs).
- Ne jamais écrire de faux avis, même pour « amorcer » la section.

Une nouvelle matière = un dossier `/<matiere>/index.html` autonome, plus une ligne dans la liste « Courses » de `/index.html`.
**Chaque lab porte le nom exact de la matière** (« Macroeconomics », pas un nom de marque), demandé par Alexi.

## Page d'accueil (hub)

- Élément signature : une feuille d'examen quadrillée (petits carreaux, trait renforcé tous les 5) en WebGL écrit à la main, sans librairie. Elle vit seule même sans interaction : le puits se promène sur un trajet qui ne se répète pas, des ondes de 4 couleurs (bleu, violet, rose, cyan) naissent au hasard, et de petits arcs électriques claquent de temps en temps dans la moitié haute. La souris prend la main sur le puits, un clic ou un toucher envoie une onde.
- Garde-fous : pause hors écran et onglet caché, mode économe automatique si les images sont lentes (résolution réduite, une image sur deux, mais l'animation continue), image fixe si « mouvement réduit », fond quadrillé en CSS si WebGL est absent.
- Sous le titre, directement dans le haut de page : une tuile par matière (Macroeconomics + 2 « Coming soon » : Financial Accounting, Management & Organization, à remplacer quand Alexi choisit). Survol : la tuile prend la couleur de sa matière, change de visuel (vitrine façon popterror.com) et s'incline vers la souris, les autres s'effacent. Sur téléphone : carrousel, la tuile centrée est mise en valeur. Un clic mène à l'overview de la matière, jamais directement à un cas.
- Ensuite : « How it works », avis, bloc auteur. Pas de sous-catégorie (« All cases », etc.) sur l'accueil.

## Effets communs (toutes les pages sauf l'exercice en cours)

- Plein écran : bouton dans l'en-tête de chaque page, touche F. Un navigateur sort toujours du plein écran quand la page change : en plein écran, les liens vers une autre page Nexus s'ouvrent donc dans un cadre (`#nxShell`) qui couvre la page restée en plein écran. En sortant du plein écran, on recharge normalement la page affichée dans le cadre. Pas de plein écran possible sur iPhone (bouton masqué).
- Fond qui change de couleur au défilement (`scrollTint`, mélange en OKLab, inspiration keblow.com). Règle d'Alexi : 2 ou 3 couleurs au plus, transition lente sur toute la descente, la dernière couleur est nettement différente de la première et reste jusqu'en bas. Hub (page courte) : 2 couleurs, bleu nuit → lie-de-vin (sombre), papier → rose (clair). Macroeconomics : 3 couleurs, encre teal → crépuscule ambre → corail profond (sombre), menthe → crème → rose corail (clair).
- Overview Macroeconomics : le circuit économique en particules WebGL (ménages ⇄ entreprises, injections I, G, X en ambre, fuites S, T, M en corail). Les particules s'écartent sous la souris. Survoler une lettre de la formule ou une étiquette allume le flux. Un halo de couleur suit la souris (teal → ambre → corail selon la position). Les cartes de cas montrent l'économie du cas au survol.
- La vue d'un cas (exercice) garde un fond fixe et aucune animation.
- Bloc auteur en bas du hub et de l'accueil de chaque lab : Christo Czysz, EDHEC BBA1 English track Lille, Instagram @christo.cz, LinkedIn, christo.czysz@edhec.com. Le lien LinkedIn est provisoire (recherche) tant qu'Alexi n'a pas donné l'adresse exacte de son profil.

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
6. **Progression** enregistrée uniquement dans le navigateur (`localStorage`, clé `flow-v1` pour la macro, `nexus-theme` pour le thème, partagé par le hub et tous les labs ; `nexus-did`, `nexus-reviewed` et `nexus-admin-key` pour les avis). Chaque lecture et écriture est protégée par un try/catch. Pas de compte utilisateur.
7. **Juridique.** Pas de logo ni de charte EDHEC. Garder la mention « A student project to help with revision. Not an official EDHEC website. » Ne pas reprendre mot pour mot de longs passages des slides : reformuler.

## Identité visuelle

- Polices : Familjen Grotesk (titres), Public Sans (texte), JetBrains Mono (chiffres et calculs).
- Hub : papier #F5F6FB et encre #12142B en clair, encre bleu nuit #0D1024 en sombre. Le dégradé Nexus (#3B5BFF → #8E6CFF → #FF5FA2) n'apparaît que dans le quadrillage déformé et le logo, jamais sur un mot de titre.
- Chaque lab a sa couleur. Macroeconomics utilise :
  - teal `--flow` pour la production et le revenu ;
  - ambre `--inj` pour les injections (I, G, X) ;
  - corail `--leak` pour les fuites (S, T, M).
- Mode clair et mode sombre, définis par des variables CSS. Bouton de thème cyclique système / clair / sombre.
- Tout doit fonctionner à 390 px de large, sans défilement horizontal.

## Lab « Macroeconomics » : Business Economics (S1)

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

## Modules de révision du lab Macroeconomics (en place)

Navigation par hash dans `/macro/` : `#home`, `#learn`, `#learn-<chapitre>`, `#cases`, `#caseN`, `#drills`, `#quiz` (`#quiz-<chapitre>`), `#cards` (`#cards-<chapitre>`), `#open`, `#open-oN`. Chapitres : `thought`, `activity`, `determinants`, `growth`.

- **Contenu** (constantes JS dans la page, rédigées à partir des slides, reformulées) : `COURSE` (4 chapitres, sections, fiches : `line`, `points`, `formula`, `example`, `trap`, `exam`), `QUIZ` (QCM, bonne réponse en position 0 dans les données, mélangée à l'affichage), `CARDS` (flashcards), `OPEN` (questions ouvertes : réponse modèle + points clés à cocher).
- **Learn** : fiches à cocher « I know this », sommaire collant, widgets interactifs (frise des écoles, tableau classiques/Keynes, tableau des agents, schéma du circuit, fonction de consommation, courbe d'investissement, tours du multiplicateur).
- **Drills** : générateurs `GEN` (nombres aléatoires, réponse calculée par le code), série, sprint de 60 s.
- **Quiz**, **Flashcards** (pile, touches Espace / ← / →), **Open questions** (texte sauvegardé, grille de points).
- Progression dans `flow-v1` : `learn`, `drills`, `quiz`, `cards`, `open`.
- Vue d'un cas : carte des 30 questions cliquable (centre la question), blocs de données cliquables, carte entière verte ou rouge selon la réponse, bouton Restart.

## Ce qui reste à faire (dans cet ordre, sauf avis contraire d'Alexi)

1. **Caler les full cases sur les vraies feuilles de TD** dès qu'Alexi les fournit. Pour l'instant, le format des exercices est déduit des slides seulement.
2. **Examen blanc chronométré** au format réel (questions ouvertes + exercice), dès qu'Alexi fournit l'examen blanc du prof.
3. Ajouter les chapitres suivants (inflation et monnaie, marché du travail, politiques, climat) quand les slides sont disponibles.
4. Plus tard, en option : un assistant IA limité au sujet de la matière. Il faudrait une Netlify Function avec une clé API côté serveur, **une vraie limite côté serveur** (pas seulement dans le navigateur) et un plafond de dépense. À ne faire qu'avec l'accord d'Alexi, car cela coûte de l'argent à chaque question.

## Vérifier avant de pousser

- Ouvrir chaque page modifiée sur ordinateur et à 390 px de large, en clair et en sombre : pas d'erreur dans la console, pas de défilement horizontal.
- Pour un générateur de cas : générer au moins 50 graines et vérifier que toutes les réponses sont des nombres finis et que les données restent cohérentes (par exemple S > 0 et T > 0).
