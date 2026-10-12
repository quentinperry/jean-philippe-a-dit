# jean-philippe-a-dit

Site de recueil des citations de **Jean-Philippe Sarcos**, chef de chœur — perles recueillies par plusieurs générations d'académiciens pendant les répétitions.

## Fonctionnalités

- 130+ citations classées en 7 chapitres (hommages, références animalières, réflexions, consignes vocales, menaces, mots doux, conseils de vie)
- Recherche plein texte (citation, œuvre, année) avec surlignage
- Filtres par chapitre
- Bouton « Citation au hasard »
- Ajout de citations depuis le site (catégorie, œuvre, année) : mutualisées via le backend, ou en repli sauvegardées dans le navigateur (localStorage) ; supprimables d'un clic

## Structure

- `index.html` — page principale
- `data.js` — les citations (chapitre, texte, source)
- `app.js` — logique de recherche, filtres et affichage
- `style.css` — styles
- `server.js` — serveur HTTP sans dépendance (API REST + fichiers statiques), stockage dans `quotes.json`

## Backend (citations mutualisées)

Lancez le serveur Node.js (aucune dépendance) :

```bash
node server.js
```

Puis ouvrez `http://localhost:3000`. Les citations ajoutées via le formulaire sont stockées côté serveur dans `quotes.json` et mutualisées : tout le monde les voit, sans compte.

### API

- `GET /api/quotes` — liste des citations mutualisées
- `POST /api/quotes` — ajouter `{ chapter, text, work?, year? }`
- `DELETE /api/quotes/:id` — supprimer une citation

## Publier sur GitHub Pages

1. Settings → Pages
2. Source : *Deploy from a branch* → `main` / `(root)`
3. Le site sera disponible sur `https://quentinperry.github.io/jean-philippe-a-dit/`

> Sur GitHub Pages, il n'y a pas de backend : le formulaire sauvegarde alors les citations dans le navigateur (localStorage). Elles ne sont visibles que localement.

## Ajouter une citation

### Depuis le site

Cliquez sur « ＋ Ajouter une citation », choisissez la catégorie, saisissez la citation, l'œuvre et l'année, puis validez. Avec le backend lancé, la citation est mutualisée ; sinon elle reste locale à votre navigateur.

### Manuellement, dans data.js

```js
{ chapter: "voix", text: "Votre citation ici", source: "Œuvre, année" },
```

> « Faire n'importe quoi, ce n'est pas être libre, c'est être dingue. » — J.-P. Sarcos (Requiem, Mozart, 2022)
