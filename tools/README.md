# tools/ : sources et outils de travail (rien ici n'est nécessaire au site en ligne)

Les pages Management et Global Challenges sont **générées** : ne pas éditer `management/index.html` ni `global/index.html` à la main, éditer les sources ici puis reconstruire.

## Reconstruire (depuis la racine du dépôt)

```
python3 tools/rv/sync.py        # kit avis (rv/nx_reviews.js|css) -> macro + hub
python3 tools/mg/extract.py     # pièces communes découpées dans macro/index.html -> tools/mg/css_*.css, js_*.js
python3 tools/mg/build.py       # -> management/index.html
python3 tools/sg/build_sg.py    # -> global/index.html
```

Toujours lancer les quatre dans cet ordre après avoir touché une pièce commune (macro ou kit avis).

- `tools/m_*.js` : contenu du lab Management (cours, quiz, questions ouvertes, Spot it, cas).
- `tools/mg/mg_*.js|css` : code propre à Management. `css_*.css` et `js_*.js` : pièces extraites de la macro (régénérées par `extract.py`, ne pas les éditer).
- `tools/sg/` : Global Challenges (`s_*.js` contenu, `sg_*.js|css` code, `sg_engine.js` moteur des diagrammes causaux).
- `tools/rv/` : kit avis commun `NXR`.

## Tester

```
node tools/revtest/server.mjs            # sert le dépôt sur http://localhost:8770, avec une fausse API d'avis (clé admin : local-admin-key)
python3 tools/tests/route_sweep.py      # toutes les vues, PC + 390 px, clair + sombre : erreurs et débordement
python3 tools/tests/sg_test.py           # (et mg_test, mac_test, mgexam_test, mock_test, resume_test, search_test, theme_test, rv_test, pen_test, spot_test, text_test, del_test)
```

Playwright + Chromium requis. Captures dans `tools/_shots/` (ignoré par git).
