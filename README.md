# jean-philippe-a-dit

Site de recueil des citations de **Jean-Philippe Sarcos**, chef de chœur — perles recueillies par plusieurs générations d'académiciens pendant les répétitions.

## Fonctionnalités

- 130+ citations classées en 7 chapitres (hommages, références animalières, réflexions, consignes vocales, menaces, mots doux, conseils de vie)
- Recherche plein texte (citation, œuvre, année) avec surlignage
- Filtres par chapitre
- Bouton « Citation au hasard »

## Structure

- `index.html` — page principale
- `data.js` — les citations (chapitre, texte, source)
- `app.js` — logique de recherche, filtres et affichage
- `style.css` — styles

## Publier sur GitHub Pages

1. Settings → Pages
2. Source : *Deploy from a branch* → `main` / `(root)`
3. Le site sera disponible sur `https://quentinperry.github.io/jean-philippe-a-dit/`

## Ajouter une citation

Dans `data.js`, ajoutez une ligne dans `QUOTES` :

```js
{ chapter: "voix", text: "Votre citation ici", source: "Œuvre, année" },
```

> « Faire n'importe quoi, ce n'est pas être libre, c'est être dingue. » — J.-P. Sarcos (Requiem, Mozart, 2022)