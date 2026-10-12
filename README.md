# jean-philippe-a-dit

Site de recueil des citations de **Jean-Philippe Sarcos**, chef de chœur — perles recueillies par plusieurs générations d'académiciens pendant les répétitions.

## Fonctionnalités

- 130+ citations classées en 7 chapitres (hommages, références animalières, réflexions, consignes vocales, menaces, mots doux, conseils de vie)
- Recherche plein texte (citation, œuvre, année) avec surlignage
- Filtres par chapitre
- Bouton « Citation au hasard »
- Ajout de citations depuis le site (catégorie, œuvre, année), sauvegardées dans le navigateur (localStorage) et supprimables d'un clic

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

### Depuis le site
Cliquez sur « ＋ Ajouter une citation », choisissez la catégorie, saisissez la citation, l'œuvre et l'année, puis validez. La citation est ajoutée immédiatement et sauvegardée dans votre navigateur (localStorage) ; elle est supprimable via le bouton ✕ sur la carte.

> Les citations ajoutées en ligne ne sont visibles que dans votre navigateur. Pour les partager, ajoutez-les aussi dans `data.js`.

### Manuellement, dans data.js

```js
{ chapter: "voix", text: "Votre citation ici", source: "Œuvre, année" },
```

> « Faire n'importe quoi, ce n'est pas être libre, c'est être dingue. » — J.-P. Sarcos (Requiem, Mozart, 2022)