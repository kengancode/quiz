# Quiz Application

Une application web de quiz avec 3 écrans permettant de charger un fichier JSON de questions, sélectionner le nombre de questions, et répondre à un QCM avec affichage des résultats.

## Structure du projet

```
quiz-app/
├── index.html          # Page principale avec 3 écrans
├── style.css           # Styles CSS modernes et responsive
├── script.js           # Logique JavaScript complète
├── assets/
│   └── quiz_example.json  # Exemple de fichier JSON avec 10 questions
└── README.md           # Documentation
```

## Fonctionnalités

### Écran 1: Chargement du JSON
- Sélection d'un fichier JSON via input file
- Validation automatique de la structure
- Affichage du nom du fichier
- Bouton "Suivant" activé uniquement si le JSON est valide

### Écran 2: Sélection du nombre de questions
- Boutons radio pour 5, 10 ou 20 questions
- Option "Autre" avec champ numérique personnalisé
- Validation que le nombre ne dépasse pas le total disponible
- Bouton "Suivant" pour démarrer le quiz

### Écran 3: Quiz + Résultats
- **Toutes les questions affichées ensemble**
- Pour chaque question :
  - Texte de la question avec indication de difficulté
  - Réponses mélangées aléatoirement (bonne réponse + fausses réponses)
  - Sélection par boutons radio
- Bouton "Valider" à la fin
- **Après validation** :
  - Score affiché (X/Y)
  - Pour chaque question :
    - Indication visuelle (vert = correct, rouge = incorrect)
    - Votre réponse
    - La bonne réponse
    - L'explication (extrait_source)

## Format du JSON

Le fichier JSON doit contenir un tableau `questions` avec des objets ayant la structure suivante :

```json
{
  "questions": [
    {
      "id": "Q1_1",
      "chapitre": "Histoire",
      "section": "Révolution Française",
      "question": "En quelle année a eu lieu la prise de la Bastille ?",
      "bonne_reponse": "1789",
      "fausses_reponses": ["1492", "1815", "1914"],
      "extrait_source": "La prise de la Bastille le 14 juillet 1789 marque le début de la Révolution Française.",
      "difficulte": "Facile",
      "figure_associee": null
    }
  ]
}
```

### Champs requis
- `id` : Identifiant unique de la question
- `question` : Texte de la question
- `bonne_reponse` : La réponse correcte
- `fausses_reponses` : Tableau des réponses incorrectes (minimum 1)

### Champs optionnels
- `chapitre` : Catégorie ou chapitre
- `section` : Sous-catégorie
- `extrait_source` : Explication ou source
- `difficulte` : Niveau de difficulté (Facile, Moyen, Difficile)
- `figure_associee` : Référence à une image (non utilisé dans cette version)

## Utilisation

1. Ouvrez `index.html` dans un navigateur web moderne
2. Chargez un fichier JSON contenant les questions (ex: `assets/quiz_example.json`)
3. Sélectionnez le nombre de questions souhaité
4. Répondez à toutes les questions
5. Cliquez sur "Valider" pour voir vos résultats

## Technologie

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec variables CSS, animations, responsive design
- **JavaScript (Vanilla)** : Logique complète sans framework
- **Pas de dépendances externes**

## Compatibilité

Testé et fonctionnel sur les navigateurs modernes :
- Chrome
- Firefox
- Edge
- Safari

## Personnalisation

Vous pouvez facilement :
- Modifier les couleurs dans les variables CSS (`:root`)
- Adapter les styles dans `style.css`
- Ajouter des questions dans le fichier JSON
- Modifier la logique dans `script.js`

## Auteur

Application créée avec Mistral Vibe
