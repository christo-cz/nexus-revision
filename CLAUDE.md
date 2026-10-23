# Nexus Revision

Site public de révision pour la promo EDHEC BBA1 (track anglais, campus de Lille), créé par Alexi (GitHub : christo-cz).
Une page d'accueil (hub) qui liste les matières, et un « lab » par matière.

- En ligne : https://nexus-revision-bba1.netlify.app (projet Netlify `nexus-revision-bba1`, public, relié à ce dépôt). Chaque push sur `main` est mis en ligne automatiquement.
- **Crédits Netlify (plan gratuit, 300 crédits par mois, cycle du 22 au 21) : chaque mise en ligne sur `main` coûte 15 crédits.** Si les crédits sont épuisés, le site est mis en pause jusqu'au cycle suivant. Règle : travailler et pousser sur la branche `dev` (aperçu gratuit sur https://dev--nexus-revision-bba1.netlify.app une fois les branch deploys activés). Ne fusionner `dev` dans `main` qu'en lot, et seulement avec l'accord explicite d'Alexi. Le 22 octobre, 10 mises en ligne ont consommé environ 150 crédits.
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
/management/index.html  lab « Fundamentals of Management and Organizations » (S1). Nom interne `mgmt` (stockage `mgmt-v1`, avis `lab: "mgmt"`).
/global/index.html  lab « Societal and Global Challenges » (S1). Nom interne `sgc` (stockage `sgc-v1`, avis `lab: "sgc"`).
/404.html          page « introuvable » servie par Netlify : « 404/20 » entouré au stylo rouge sur papier quadrillé, liens vers les labs
/og.jpg, /macro/og.jpg, /management/og.jpg, /global/og.jpg   images d'aperçu des liens partagés (1200 × 630, < 100 Ko pour WhatsApp), balises og: et twitter: dans chaque page. Adresses absolues vers le site en production : elles ne s'affichent qu'une fois `main` mis en ligne. Générées avec Playwright à partir d'une maquette HTML (pas d'étape de build dans le dépôt)
/CLAUDE.md         ce fichier
/package.json      dépendance de la fonction des avis
/netlify/functions/reviews.mjs   API des avis (GET liste + résumé, POST avis, POST suppression admin)
```

## Avis des étudiants

- Étoiles 1 à 5, tags fixes (liste `TAGS` dans la fonction, à garder identique côté pages), commentaire obligatoire de 10 à 600 caractères, prénom facultatif (« BBA1 student » sinon). Liens refusés. Publication immédiate.
- Labs acceptés par l'API : `flow` (Macroeconomics), `mgmt` (Management) et `sgc` (Societal and Global Challenges). Un nouveau lab = l'ajouter à `LABS` dans la fonction et dans l'objet `LABS` du hub.
- Code commun : le « kit avis » `NXR` (JS entre `/* nxr:start` et `/* nxr:end */`, CSS entre `/* nxr-css:start` et `/* nxr-css:end */`), identique dans le hub et les labs. Source dans le dossier de travail `rv/` (`nx_reviews.js`, `nx_reviews.css`), copié par `rv/sync.py` dans la macro et le hub, puis dans Management et Global Challenges par `extract.py` + `build.py` / `build_sg.py`.
- Demande d'avis, voulue par Alexi, avec le message « A review helps me a lot » signé Christo :
  - à la fin d'un module, une petite carte en bas à droite (`nudgeReview(kind)`) : quiz fini, pile de flashcards vidée, chapitre entièrement coché, sprint, 15 drills, 3 questions d'examen auto-corrigées, exercice de TD, scène de lab, diagramme causal vérifié, etc. Un clic sur une étoile ouvre le formulaire avec cette note. Une fois par visite (`sessionStorage` `nexus-rv-nudge`), jamais si l'avis du lab a été donné dans les 24 h, et plus pendant 4 jours après deux « Not now » (`nexus-rv-later`) ;
  - à la fin d'un cas et d'un examen blanc : formulaire dans la carte de bilan ;
  - bouton étoile « Review » dans l'en-tête de chaque lab (formulaire dans une fenêtre, `NXR.sheet`) ;
  - « Write a review » sur le mur (sur le hub, on choisit d'abord la matière).
- Le mur (demande d'Alexi) : section « The class wall » sur le hub (tous les labs) et « What the class says » sur l'accueil de chaque lab. Chaque avis est un bout de copie quadrillée (marge rouge) scotché au mur, légèrement penché, la note écrite au stylo rouge et entourée à la main (le cercle se dessine à l'apparition). En tête : la moyenne entourée au stylo rouge, le nombre d'avis, les tags les plus cités, le message d'Alexi. Grille de colonnes décalées, dans l'ordre du plus récent. Après publication, le nouvel avis tombe sur le mur.
- Anti-triche côté serveur : un avis par lab et par 24 h, à la fois par IP (hachée, jamais stockée en clair) et par appareil (`nexus-did`). Champ piège `website` contre les robots.
- Mise en page volontairement différente du site de Zadig : pas d'histogramme de notes, pas de filtres en pastilles, pas de cartes en verre identiques : des copies d'examen scotchées.
- Suppression : la variable d'environnement `ADMIN_KEY` (au moins 8 caractères) se règle dans Netlify. Ouvrir `/?admin`, saisir la clé une fois : un lien « Delete » apparaît sous chaque avis (hub et labs).
- Ne jamais écrire de faux avis, même pour « amorcer » la section.

Une nouvelle matière = un dossier `/<matiere>/index.html` autonome, plus une ligne dans la liste « Courses » de `/index.html`.
**Chaque lab porte le nom exact de la matière** (« Macroeconomics », pas un nom de marque), demandé par Alexi.

## Page d'accueil (hub)

- Élément signature : une feuille d'examen quadrillée (petits carreaux, trait renforcé tous les 5) en WebGL écrit à la main, sans librairie. Elle vit seule même sans interaction : le puits se promène sur un trajet qui ne se répète pas, des ondes de 4 couleurs (bleu, violet, rose, cyan) naissent au hasard, et de petits arcs électriques claquent de temps en temps dans la moitié haute. La souris prend la main sur le puits, un clic ou un toucher envoie une onde.
- Garde-fous : pause hors écran et onglet caché, mode économe automatique si les images sont lentes (résolution réduite, une image sur deux, mais l'animation continue), image fixe si « mouvement réduit », fond quadrillé en CSS si WebGL est absent.
- Sous le titre, directement dans le haut de page : une tuile par matière (Macroeconomics, Management and Organizations, Societal and Global Challenges ; Financial Accounting retiré à la demande d'Alexi). Survol : la tuile prend la couleur de sa matière, change de visuel (vitrine façon popterror.com) et s'incline vers la souris, les autres s'effacent. Sur téléphone : carrousel, la tuile centrée est mise en valeur. Un clic mène à l'overview de la matière, jamais directement à un cas.
- Ensuite : « How it works », avis, bloc auteur. Pas de sous-catégorie (« All cases », etc.) sur l'accueil.
- Sous « How it works », une bande de feuille d'examen (`#spec`) montre une question tirée en direct par de petits générateurs (multiplicateur, APC, valeur ajoutée, équité), avec la ligne de calcul ; nouveau tirage toutes les 7,5 s quand elle est visible (pas au survol, pas en mouvement réduit) et bouton « Draw another ». Les réponses sont calculées par le code, comme dans les labs.

## Effets communs (toutes les pages sauf l'exercice en cours)

- Plein écran : bouton dans l'en-tête de chaque page, touche F. Un navigateur sort toujours du plein écran quand la page change : en plein écran, les liens vers une autre page Nexus s'ouvrent donc dans un cadre (`#nxShell`) qui couvre la page restée en plein écran. En sortant du plein écran, on recharge normalement la page affichée dans le cadre. Pas de plein écran possible sur iPhone (bouton masqué). Une bulle d'invitation (« Revise better in full screen ») apparaît une fois par session sur l'accueil et les pages Macroeconomics hors exercice ; le bouton de l'en-tête pulse en même temps. Un site ne peut pas s'ouvrir directement en plein écran : les navigateurs exigent un clic.
- Fond qui change de couleur au défilement (`scrollTint`, mélange en OKLab, inspiration keblow.com). Règle d'Alexi : 2 ou 3 couleurs au plus, transition lente sur toute la descente, la dernière couleur est nettement différente de la première et reste jusqu'en bas. Hub : bleu nuit → prune → écru en sombre (le texte passe en encre foncée sur l'écru, classe `tint-light`), papier → crème en clair. Macroeconomics : 3 couleurs, encre teal → crépuscule ambre → corail profond (sombre), menthe → crème → rose corail (clair).
- Overview Macroeconomics : le circuit économique en particules WebGL (ménages ⇄ entreprises, injections I, G, X en ambre, fuites S, T, M en corail). Les particules s'écartent sous la souris. Survoler une lettre de la formule ou une étiquette allume le flux. Un halo de couleur suit la souris (teal → ambre → corail selon la position). Les cartes de cas montrent l'économie du cas au survol.
- La vue d'un cas (exercice) garde un fond fixe et aucune animation.
- Bloc auteur en bas du hub et de l'accueil de chaque lab : Christo Czysz, EDHEC BBA1 English track Lille, Instagram @christo.cz, LinkedIn (https://www.linkedin.com/in/christo-czysz-2a133a43a), christo.czysz@edhec.com.

Chaque page est un fichier unique : CSS et JS dans la page. Seules dépendances externes autorisées : Google Fonts.

## Effets ajoutés le 22 octobre (labs)

- En-tête de chaque module : une petite scène 3D derrière le titre (`.mini3d`, canvas sous le contenu, masque radial, `pointer-events: none`). Macroeconomics : le circuit économique incliné qui tourne (`mountFlow(box, { mini: true })`). Management : la foule / organisation (`mountSwarm(box, { mini: true, mode })`), forme choisie par module (objet `MINI`). Pas de scène dans la vue d'un cas, l'examen blanc ni les pages d'écriture.
- Tuiles qui s'inclinent vers la souris avec un reflet (`--rx`, `--ry`, `--gx`, `--gy`), blocs qui apparaissent au défilement (`.rv-in` / `.rv-on`, avec `translate` pour ne pas casser l'inclinaison).
- Transitions de vue : `document.startViewTransition` entre les vues d'un lab (sauf vers un cas), et `@view-transition { navigation: auto }` entre les pages (hub ⇄ labs). L'en-tête garde `view-transition-name: hdr`.
- Éclats de couleur sur les bonnes réponses (`burst()`), compteur de série qui rebondit (`bump()`), paquet de flashcards en 3D qui part à droite (connue) ou à l'arrière (à revoir).
- Recherche dans chaque lab : bouton dans l'en-tête, touche `/` ou Ctrl/Cmd+K. Index : fiches, définitions des flashcards, questions d'examen, cas, labs, pages. Choisir une fiche ouvre le chapitre et l'allume (`GOTO.note`, `landOnNote()`).
- `#recap` dans chaque lab : toutes les fiches sur une page, filtrable et imprimable (CSS `@media print`).
- Changement de thème : le nouveau thème s'étend en cercle depuis le bouton (`themeSwap`, transition de vue avec la classe `theme-vt`).
- Fond de Management : aubergine → indigo nuit → baie profonde (sombre), papier rosé → lavande → abricot (clair).
- Haut de page (hub, accueil Macroeconomics, accueil Management) : la scène bascule en arrière et s'efface quand on fait défiler (`heroTilt`).
- Hub : tuiles dans l'ordre Macroeconomics, Management, puis Financial Accounting (bientôt). Au survol, la tuile Management montre une foule qui se range en organigramme.
- Hub : « Pick up where you left off » lit `flow-v1` et `mgmt-v1` pour proposer de reprendre (un examen blanc en cours passe en premier, avec les minutes restantes) (la liste des cas Management et leur nombre d'étapes est recopiée dans le hub, à tenir à jour si on ajoute un cas).
- Le texte posé sur une pastille pleine verte ou rouge utilise `var(--bg)` (dans `.mod`, `--surface` est un verre transparent).

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
- Deux thèmes seulement, sombre et clair, définis par des variables CSS (demande d'Alexi : plus de mode « Auto »). On arrive toujours en sombre ; le clair n'est utilisé que si le visiteur l'a choisi (`nexus-theme` = `light`, toute autre valeur, y compris l'ancien `system`, donne le sombre). Le petit script dans le `<head>` pose toujours `data-theme` avant l'affichage.
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

## Lab « Management » : Fundamentals of Management and Organizations (S1)

Coordinatrice : Nuria Tolsá Caballero. 18 h, 2 ECTS, 9 séances (4 cours, 5 TD).

**Évaluation :** 40 % présentation orale de groupe (séance 9 : un problème « people » réel d'une organisation, diagnostic avec au moins 2 théories, recommandations) ; 60 % examen écrit individuel de 90 minutes, des questions qui testent la compréhension ET l'application des concepts (cours, TD, lectures obligatoires). Le format exact des questions n'est pas publié : l'examen blanc du site le dit.

**Contenu (4 cours + TD 1 et 2) :**
1. Organizations, management, theories : problème = écart entre résultat voulu et obtenu (définir, trouver la cause, recommander) ; OB, 6 disciplines, 3 niveaux ; de l'intuition à la preuve, Theory of Planned Behavior ; définition d'une organisation (performance contrôlée, buts collectifs), 5 critères, foule / groupe / équipe / organisation ; écoles : administrative (Fayol, seulement nommée), bureaucratie (Weber, 3 autorités, 5 traits), efficacité (Taylor, Ford), humaniste (Hawthorne, Mayo, Herzberg, McGregor), contingence, contemporaine (Drucker, seulement nommée).
2. Personality, values, attitudes : valeurs (Schwartz, cercle, voisines complémentaires, opposées incompatibles, dilemme du bonus) ; attitudes (3 composantes, 4 attitudes au travail, dissonance) ; personnalité (MBTI et ses limites, Big Five, test à 10 items avec items inversés 2-4-6-8-10, Barrick & Mount, « too much of a good thing », Grant 2013, biais de désirabilité sociale) ; TD 2 : Trait Activation Theory (Tett & Burnett 2003 ; la slide écrit « Trett », c'est une coquille), force de la situation et les 4 C.
3. Decision-making and biases : System 1 / 2, quand l'intuition marche (Dane et al.), biais (confirmation, surconfiance, ancrage, disponibilité, aversion aux pertes, cadrage 72 % / 78 %, coût irrécupérable et escalade, biais d'action), perception sociale (halo, contraste, stéréotypes), attribution (biais d'autocomplaisance, erreur fondamentale, modèle de Kelley et cas de Peter), groupes (Asch, Milgram, groupthink), modèle rationnel et Simon.
4. Motivation : direction, intensité, persistance ; Maslow (hiérarchie non confirmée) ; intrinsèque / extrinsèque ; SDT (3 besoins, continuum d'internalisation, supervision qui soutient l'autonomie, feedback informatif, Gmail) ; Herzberg ; Job Characteristics Model ; fixation d'objectifs (médiateurs, modérateurs, SMART) ; équité (6 façons de rétablir) ; justice organisationnelle.

**Modules** (hash dans `/management/`) : `#home`, `#learn`, `#learn-<org|person|decide|motiv>`, `#cases`, `#case-<id>`, `#spot`, `#labs`, `#lab-<kelley|equity|bigfive|who>`, `#quiz`, `#cards`, `#open`, `#open-<id>`, `#exam`.
- Accueil : élément signature en 3D (canvas 2D, sans librairie) : des personnes qui passent de foule (chacun garde une teinte de sa couleur, et deux passants proches échangent un trait) à groupe, équipe puis organisation (les 4 formes du cours 1), rotation lente, la souris incline la scène et écarte les points, un clic passe à la forme suivante. Couleurs : baie `--pri` (individu, couleur du lab), violet `--c1` (organisation), orange `--c3` (décisions, groupes), bleu ciel `--c4` (motivation).
- Learn : fiches + 10 modèles interactifs (test foule/organisation, frise des écoles, cercle de Schwartz avec distance calculée, force de la situation, énigmes System 1, cadrage, Kelley, continuum d'internalisation, JCM, équité).
- Cases : 8 cas inventés, méthode du cours (problème, cause, recommandation), fiche à gauche et étapes à droite comme en macro ; étapes QCM, « select all », et rédaction comparée à une réponse modèle (juste si 60 % des points clés cochés).
- Spot it : ~100 scènes, les fausses réponses viennent de la même famille ; série et sprint de 60 s.
- Labs : Kelley (scènes générées), équité (chiffres générés, ratios calculés par le code), Big Five (scores calculés avec les réponses), « Who said what ».
- Quiz, Flashcards, Exam questions (toutes les self-check questions des slides + cas d'application, réponses modèles et points clés), examen blanc de 90 minutes.
- Progression dans `mgmt-v1` : `learn`, `cases`, `lastcase`, `spot`, `labs`, `kel`, `eqlab`, `big5`, `who`, `quiz`, `cards`, `open`, `exam`, `examHist` (20 derniers examens blancs, affichés sur la page de départ de l'examen), `project` (cases cochées de la checklist du projet).

## Lab « Global Challenges » : Societal and Global Challenges (S1)

Neuf séances de 2 h (dont l'atelier 2tonnes). **Évaluation :** 20 % travail de groupe en classe (le TD de la séance 7 : arbre des causes de l'écart de salaire femmes-hommes), 80 % examen individuel organisé par le Hub sur les slides des séances 1 à 8 : savoir définir les concepts clés et comprendre les leçons des études empiriques montrées en cours. Selon Alexi : questions ouvertes ou « explain this notion », et très probablement un diagramme causal à dessiner.

**Contenu reçu :** séances 1 à 6 et TD 7 (pas encore la séance 8, révision).
1. Systems thinking : canicules (pic de chaleur, vague de chaleur, canicule et seuils), diagramme causal, signe d'un lien « toutes choses égales par ailleurs », boucles de rétroaction positives (renforçantes) et négatives (équilibrantes), règle de polarité (nombre pair ou impair de −), effet pervers (climatisation), diagramme des canicules, mesures macro/méso/micro, pensée systémique contre pensée linéaire.
2. Développement durable : von Carlowitz (1713), rendement maximal durable (MSY), 3 principes, rapport Meadows (1972, 5 variables, capacité de charge, 2 boucles de population, méthode diagramme → paramétrage → simulation, recommandations, critiques), Brundtland (1987), 3 piliers (vivable, viable, équitable), jalons, ODD (17/169), 15 % sur la bonne voie, obstacles macro/méso/micro.
3. Écologie : écologie (Haeckel), biosphère (Suess), écosystème (Tansley, biocénose + biotope), Vernadsky, résilience, point de bascule, éléments de bascule climatiques, cascades, Grande Accélération, Anthropocène, Holocène.
4. Limites planétaires (Rockström 2009, 9 limites, 7 franchies en 2025 avec les années, limites cœur), météo/climat, +1,17 °C, biodiversité (3 types, 6e extinction, 5 facteurs directs IPBES), cacao et Lindt.
5. Doughnut (Raworth 2012, 12 + 9 dimensions, 2025), pauvreté absolue (3,00 $/jour) et relative (60 % de la médiane, 1 337 €, 15,4 %), niveau de vie et unités de consommation, Palma, Gini, écart salarial 24/15/4 %, inégalités et problèmes sociaux.
6. Modèle économique : économie, marché, capitalisme (Fulcher), économie de marché ; croissance brune, verte, sélective, décroissance ; les 4 scénarios ADEME 2050.
7. TD : écart de salaire (21,8 %, Insee 2026), arbre des causes, exemple des homicides aux États-Unis, présenter, corroborer ou réfuter, sources fiables.

**Modules** (hash dans `/global/`) : `#home`, `#learn`, `#learn-<systems|sd|ecology|bounds|social|economy|method>`, `#studio`, `#studio-<id>`, `#studio-free`, `#studio-drills`, `#sort`, `#figures`, `#quiz`, `#cards`, `#open`, `#open-<id>`, `#exam`, `#recap`.
- Accueil : élément signature, le système des canicules (séance 1) en 3D vivante (canvas 2D) : variables environnementales au fond, sociales au milieu, économiques devant ; l'influence circule en impulsions sur chaque flèche (ocre pour +, cyan pour −). 5 vues : le système, boucle renforçante, boucles équilibrantes, effet pervers, « Your turn » (un clic sur une variable la fait monter et chaque variable atteinte monte ▲ ou baisse ▼, calculé à partir des signes).
- **Causal studio** : 9 diagrammes (6 du cours : canicules, forêt de von Carlowitz, cacao, population, homicides, et l'écart de salaire, réponse à nous car les slides n'en donnent pas ; 3 cas d'entraînement : pêche, ZFE, Amazonie). Trois exercices par diagramme : remplir les signes, dessiner les liens (vérification lien par lien : juste, mauvais signe, manquant, en plus), voir la réponse du cours (pousser une variable, boucles). Tableau libre (ajouter, déplacer, relier, signes, boucles et effets calculés, téléchargement en PNG). Drills générés (signe d'un lien, polarité d'une boucle, effet le long des chemins).
- Moteur commun (`sg_engine.js`) : boucles élémentaires et leur polarité par la règle du cours, chemins et effet net (monte, baisse, « ça dépend » si des chemins de signes opposés), propagation, dessin SVG des diagrammes (couleurs de la légende des slides : environnement vert, social rose, économie bleu). Rien n'est écrit à la main.
- Learn : 89 fiches et 18 modèles interactifs (lire un lien, règle de polarité avec simulation, diagramme des canicules, forêt et MSY, deux boucles de population, trois piliers, bille et point de bascule avec hystérésis, Grande Accélération, roue des limites par année, facteurs IPBES, cacao, Doughnut, calculateur de niveau de vie et seuil de pauvreté, courbe de Lorenz avec Gini et Palma, quatre mots, quatre positions sur la croissance, scénarios ADEME côte à côte, homicides).
- Sort it (classements, ~130 items), Key figures (33 chiffres avec source et leçon, mode « cacher les chiffres »), Quiz, Flashcards, Exam questions (définir, expliquer, appliquer, dessiner : réponses modèles et points clés, diagramme modèle), examen blanc 60 ou 90 min (notions + un diagramme construit flèche par flèche, comparé au diagramme du cours).
- Progression dans `sgc-v1` : `learn`, `studio`, `board`, `cdrill`, `spot`, `figs`, `quiz`, `cards`, `open`, `exam`, `examHist`.
- Le fichier est généré par `build_sg.py` (dossier de travail de la session, comme `build.py` pour Management) à partir des pièces communes extraites de la macro et des pièces propres au lab.

## Modules de révision du lab Macroeconomics (en place)

Navigation par hash dans `/macro/` : `#home`, `#learn`, `#learn-<chapitre>`, `#cases`, `#caseN`, `#drills`, `#spot`, `#quiz` (`#quiz-<chapitre>`), `#cards` (`#cards-<chapitre>`), `#open`, `#open-oN`, `#mock`, `#recap`. Chapitres : `thought`, `activity`, `determinants`, `growth`.

- **Contenu** (constantes JS dans la page, rédigées à partir des slides, reformulées) : `COURSE` (4 chapitres, sections, fiches : `line`, `points`, `formula`, `example`, `trap`, `exam`), `QUIZ` (QCM, bonne réponse en position 0 dans les données, mélangée à l'affichage), `CARDS` (flashcards), `OPEN` (questions ouvertes : réponse modèle + points clés à cocher).
- **Learn** : fiches à cocher « I know this », sommaire collant, 18 modèles interactifs. Une section peut en porter plusieurs (`widget: ["realgdp", "ppp", "hdi"]`). Liste :
  - frise des écoles ; tableau classiques/Keynes ; tableau des agents ; schéma du circuit ;
  - fonction de consommation ; courbe d'investissement ; tours du multiplicateur ;
  - ajoutés le 23 octobre pour être au niveau de Management :
    - avantage comparatif de Ricardo (ses chiffres de 1817 ou des chiffres tirés, prédiction puis production mondiale avant/après) ;
    - Say contre Keynes (chaîne animée, et ce que chacun prédit si l'incertitude monte) ;
    - valeur ajoutée le long de la chaîne blé → farine → pain (les trois approches du PIB et le double comptage) ;
    - emplois = ressources (C + I + G + X contre Y + M) ;
    - balance des fuites et injections prévues (la production s'ajuste jusqu'à Y*) ;
    - choix intertemporel de Fisher (droite de budget qui pivote avec r) ;
    - croissance trimestrielle à qualifier (expansion, ralentissement, récession au sens de l'INSEE, un seul trimestre négatif) ;
    - PIB nominal et réel (deux biens) ;
    - PPA façon indice Big Mac (prix inventés) ;
    - IDH avec la méthode du PNUD (profils inventés) ;
    - vagues de Kondratiev et destruction créatrice (stylisé).
- **Drills** : générateurs `GEN` (nombres aléatoires, réponse calculée par le code), série, sprint de 60 s.
- **Spot it** (`#spot`) : même moteur que Management (`viewSpot`), 159 énoncés en 19 familles (école, auteur, motif de détention de la monnaie, vue classique ou keynésienne, agent, fuite ou injection, approche du PIB, W contre J, déterminant et nature de l'investissement, propensions, multiplicateur, phase du cycle, nominal ou réel, mesure, ce que le PIB compte, sources de la croissance, Fisher, Kuznets, Schumpeter, Kondratiev, Rosling). Données `FAMILIES` et `SPOT` dans la page. Progression `spot` dans `flow-v1`.
- Accueil : 8 tuiles de modules (Learn, Tutorials, Drills, Spot it, Quiz, Flashcards, Open questions, Recap), puis la bannière de l'examen blanc.
- **Quiz**, **Flashcards** (pile, touches Espace / ← / →), **Open questions** (texte sauvegardé, grille de points).
- Progression dans `flow-v1` : `learn`, `drills`, `spot`, `quiz`, `cards`, `open`, `td`, `mock` (examen blanc en cours ou terminé), `mockHist` (20 derniers résultats).
- **Mock exam** (`#mock`) : les deux parties du final. Partie A : questions ouvertes tirées dans `OPEN` (toujours une sur l'histoire de la pensée, puis une par chapitre). Partie B : un ou plusieurs exercices de TD générés par `TD_GEN` (les chiffres sont enregistrés avec l'examen, pour survivre à un rechargement). Durée au choix, 60, 90 ou 120 minutes (`MOCK_FMT`), car le syllabus ne la donne pas : la page le dit. Rien n'est corrigé avant « Finish and mark » (deux appuis) ou la fin du temps ; ensuite les calculs et les QCM sont notés par le code, l'écriture par l'étudiant avec les points clés. Bannière « Mock exam » (feuille quadrillée avec marge rouge) sous les modules de l'accueil et en haut d'Open questions.
- **Tutorials** (`#td`, `#td-<type>`, `#td-all`) : les 5 exercices du TD 1 avec des chiffres aléatoires. Calculs vérifiés par le code ; questions « explain » comparées à une réponse modèle avec points clés à cocher. Attention : dans le TD, W et J sont des montants prévus, et W ≠ J signifie un déséquilibre (W > J : contraction). Dans les comptes réalisés, W = J toujours. Les fiches distinguent les deux.
- Vue d'un cas : carte des 30 questions cliquable (centre la question), blocs de données cliquables, carte entière verte ou rouge selon la réponse, bouton Restart.

## Ce qui reste à faire (dans cet ordre, sauf avis contraire d'Alexi)

1. **Caler les full cases sur les vraies feuilles de TD.** TD 1 reçu (corrigé : équilibre AD/AS, fuites/injections, consommation keynésienne, choix intertemporel, multiplicateur) : il a servi à créer le module Tutorials (`#td`, générateurs `TD_GEN`) et à corriger Learn, Quiz, Flashcards, Drills et Open. Format de l'exercice d'examen : calculer puis expliquer/interpréter. À faire avec les TD suivants : même traitement.
2. **Examen blanc** : une version générique existe (`#mock`, durée au choix). Dès qu'Alexi fournit l'examen blanc du prof, caler `MOCK_FMT` (durée, nombre de questions, barème) sur le vrai format.
3. Ajouter les chapitres suivants (inflation et monnaie, marché du travail, politiques, climat) quand les slides sont disponibles.
4. Plus tard, en option : un assistant IA limité au sujet de la matière. Il faudrait une Netlify Function avec une clé API côté serveur, **une vraie limite côté serveur** (pas seulement dans le navigateur) et un plafond de dépense. À ne faire qu'avec l'accord d'Alexi, car cela coûte de l'argent à chaque question.

## Vérifier avant de pousser

- Ouvrir chaque page modifiée sur ordinateur et à 390 px de large, en clair et en sombre : pas d'erreur dans la console, pas de défilement horizontal.
- Pour un générateur de cas : générer au moins 50 graines et vérifier que toutes les réponses sont des nombres finis et que les données restent cohérentes (par exemple S > 0 et T > 0).
