# Plan: Application Web de Quiz

## Objectif
Créer une application web de quiz avec 3 écrans :
1. Chargement d'un fichier JSON contenant les questions
2. Sélection du nombre de questions (5, 10, 20 ou champ libre)
3. Affichage des questions en QCM avec mélange des réponses, puis affichage du score et des explications

## Structure du Projet
```
src/
├── index.html          # Page principale
├── style.css           # Styles CSS
├── script.js           # Logique JavaScript
├── json/             # Dossier pour les fichiers JSON
└── README.md           # Documentation
```

## Structure du JSON
```json
{
  "metadata": {
      "titre": "Titre affiché dans la liste",
      "source": "Document source",
      "date_creation": "Date de création du JSON",
      "nombre_questions": 2,
      "chapitres_couverts": [
        "Chapitre 1",
        "Chapitre 2"
      ]
    },
  "questions": [
    {
      "id" : "Q1_1",
      "chapitre" : "Chapitre 1",
      "section" : "section",
      "question": "Quelle est la capitale de la France ?",
      "bonne_reponse": "Paris",
      "fausses_reponses": ["Londres", "Berlin", "Madrid"],
      "extrait_source": "Paris est la capitale de la France depuis le Xe siècle.",
      "difficulte" : "Difficulté",
      "figure_associee": null
    }
  ]
}
```

## Fonctionnalités

### Écran 1: Chargement du JSON
- l'application propose 4 options
  - Sélectionner un ou plusieurs référentiels existants la liste des json disponibles dans le dossier json. L'applicaiton proposer un liste à choix multiple des fichiers disponibles en affichant le champ titre du json
  - Télécharger un json
    - Input de type file pour charger un fichier JSON
    - Validation du format du fichier
  - Laisser le système utiliser un référentiel au hasard parmis ceux disponibles dans le dossier json
  - Utiliser tous les référentiels en même temps
- afficher une liste à choix multiples des fichiers json disponibles dans le sous dossier json
- Bouton "Suivant" pour passer à l'écran 2
- Si un ou plusieurs fichiers ne respectent pas le format, afficher un écran listant les fichiers non conformes avec l'option annuler (rester sur l'écran 1) ou si au moins un fichier est valide proposer de continuer et d'aller sur l'écran 2

### Écran 2: Sélection du nombre de questions
- Boutons radio pour 5, 10, 20, 100 questions
- Champ libre pour un nombre personnalisé
- Validation que le nombre ne dépasse pas le total disponible
- Bouton "Commencer le quiz" pour passer à l'écran 3

### Écran 3: Quiz
- Sélection au hasard des questions parmis toutes les questions disponibles
- Affichage des questions une par une ou toutes ensemble
- Pour chaque question :
  - Texte de la question
  - Boutons radio pour les réponses (bonne réponse + alternatives mélangées)
- Bouton "Valider" à la fin
- Après validation :
  - Affichage du score (X/Y)
  - Pour chaque question :
    - Donner le nom du référentiel, le chapitre et la section de la question,
    - Indication si la réponse était correcte/incorrecte
    - La bonne réponse
    - L'explication

## Implémentation Technique

### HTML (index.html)
- Structure avec 3 sections (une par écran)
- Navigation entre écrans avec JavaScript
- Formulaires pour chaque écran

### CSS (style.css)
- Style moderne et responsive
- Cacher/montrer les sections selon l'écran actuel
- Styles pour les boutons, questions, réponses
- Feedback visuel pour les bonnes/mauvaises réponses
- Proposer sur tous les écrans un bouton pour basculer entre mode clair / mode sombre (par défaut utiliser la configuraiton système ou le mode clair)

### JavaScript (script.js)
- Gestion des 3 écrans
- Parsing et validation du JSON
- Logique de mélange des réponses
- Calcul du score
- Affichage des résultats

## Étapes de Développement

1. **Créer la structure HTML de base**
   - 3 sections principales
   - Éléments pour chaque écran

2. **Implémenter le CSS**
   - Styles de base pour tous les écrans
   - Styles spécifiques pour chaque écran
   - Responsive design

3. **Implémenter le JavaScript**
   - Gestion de la navigation entre écrans
   - Chargement et validation du JSON
   - Logique du quiz (mélange, score, résultats)

4. **Tester l'application**
   - Vérifier le chargement du JSON
   - Tester la sélection du nombre de questions
   - Vérifier le bon fonctionnement du quiz
   - Tester l'affichage des résultats

5. **Créer un exemple de fichier JSON**
   - Fournir un exemple fonctionnel

## Contraintes
- Utilisation de Vanilla JavaScript (pas de framework)
- Design simple mais fonctionnel
- Compatible avec les navigateurs modernes
- Pas de dépendances externes (sauf éventuellement pour le style)

## Livrables
- Code complet de l'application dans le dossier src
- Documentation basique
