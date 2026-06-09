# Quiz Application

Une application web légère de quiz complète permettant de charger un ou plusieurs fichiers JSON de questions, sélectionner le nombre de questions, et répondre à un QCM avec affichage détaillé des résultats.

## 📁 Structure du projet

```
quiz-app/
├── index.html          # Page principale avec 3 écrans
├── style.css           # Styles CSS modernes et responsive
├── script.js           # Logique JavaScript complète
├── json/               # Dossier pour les fichiers JSON
│   ├── quiz_example.json
│   └── anssi_qcm_architectures_si_sensibles.json
└── README.md           # Documentation
```

## ✨ Fonctionnalités

### Écran 1: Chargement des référentiels de questions
L'application propose **4 options** pour charger les questions :

1. **Sélectionner un ou plusieurs référentiels existants**
   - Liste à choix multiples des fichiers Quiz au format JSON disponibles depuis le fichier  json/liste_referentiels.json. Par défaut les référentiels sont stockés dans le dossier json
   - Affichage du nom du référentiel (champ `nom`)
   - Sélection multiple possible

2. **Télécharger un fichier JSON**
   - Input de type file pour charger un fichier JSON personnalisé
   - Validation automatique du format
   - Affichage du nom du fichier sélectionné

3. **Utiliser un référentiel au hasard**
   - Sélection aléatoire d'un fichier parmi ceux disponibles dans `json/`
   - Affichage du fichier sélectionné

4. **Utiliser tous les référentiels**
   - Charge toutes les questions de tous les fichiers JSON disponibles
   - Combinaison automatique des questions

**Validation des fichiers** :
- Vérification de la structure JSON
- Affichage des erreurs pour les fichiers non conformes
- Possibilité de continuer avec les fichiers valides uniquement
- Boutons "Annuler" ou "Continuer avec les fichiers valides"

### Écran 2: Sélection du nombre de questions
- Boutons radio pour 5, 10, 20 ou 100 questions
- Champ libre pour un nombre personnalisé
- Validation que le nombre ne dépasse pas le total disponible sinon l'application utilise le nombre total de questions
- Affichage du nombre total de questions disponibles
- Bouton "Retour" pour revenir à l'écran 1

### Écran 3: Quiz
- **Deux modes d'affichage** :
  - Afficher toutes les questions ensemble (par défaut)
  - Afficher les questions une par une avec navigation Précédent/Suivant

- **Pour chaque question** :
  - Texte de la question 
  - Réponses mélangées aléatoirement (bonne réponse + fausses réponses)
  - Sélection par boutons radio

- **Barre de progression** en mode question par question
- Bouton "Valider" pour soumettre les réponses

**Après validation** :
- Score affiché (X/Y)
- Pour chaque question :
  - Indication visuelle (vert = correct, rouge = incorrect)
  - Nom du référentiel, chapitre et section
  - Votre réponse
  - La bonne réponse
  - L'explication (extrait_source)
- Boutons "Recommencer" ou "Retour à l'accueil"

### Fonctionnalités supplémentaires
- **Mode clair/sombre** : Bouton de bascule en haut à droite
  - Utilise la préférence système par défaut
  - Sauvegarde la préférence dans localStorage
  - Design adapté pour les deux modes

- **Responsive design** : Adapté aux mobiles, tablettes et desktop
- **Animations fluides** : Transitions entre écrans et effets visuels
- **Accessibilité** : Labels ARIA et navigation clavier

## 📋 Format du JSON

Le fichier JSON des quiz doit contenir un objet avec `metadata` et un tableau `questions` :

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
      "id": "Q1_1",
      "chapitre": "Chapitre 1",
      "section": "Section 1",
      "question": "Quelle est la capitale de la France ?",
      "bonne_reponse": "Paris",
      "fausses_reponses": ["Londres", "Berlin", "Madrid"],
      "extrait_source": "Paris est la capitale de la France depuis le Xe siècle.",
      "difficulte": "Facile",
      "figure_associee": null
    }
  ]
}
```

 Champs requis
- `id` : Identifiant unique de la question
- `question` : Texte de la question
- `bonne_reponse` : La réponse correcte
- `fausses_reponses` : Tableau des réponses incorrectes (minimum 1)

### Champs optionnels
- `chapitre` : Catégorie ou chapitre
- `section` : Sous-catégorie
- `extrait_source` : Explication ou source
- `difficulte` : Niveau de difficulté (Facile, Moyen, Difficile)
- `figure_associee` : Référence à une image (non utilisé actuellement)

Le fichier liste_referentiels.json a le format suivant :
```json
[
  {
    "nom": "Quiz 1",
    "chemin": "quiz1.json"
  },
  {
    "nom": "Quiz 2",
    "chemin": "quiz2.json"
  }
  
]
```

 Champs requis
- `nom` : Nom d'affichage du quiz
- `chemin` : Chemin (peut être une URL) de chargement du quiz


###
## 🚀 Utilisation

1. **Ouvrir l'application** : Ouvrez `index.html` dans un navigateur web moderne
2. **Choisir les référentiels** : Sélectionnez une des 4 options pour charger les questions
3. **Valider la sélection** : Cliquez sur "Suivant" (si des fichiers sont invalides, vous pourrez choisir de continuer avec les valides)
4. **Sélectionner le nombre de questions** : Choisissez combien de questions vous voulez
5. **Configurer l'affichage** : Cochez ou décochez "Afficher toutes les questions ensemble"
6. **Répondre au quiz** : Sélectionnez vos réponses
7. **Voir les résultats** : Cliquez sur "Valider" pour voir votre score et les explications

## 🛠️ Technologie

- **HTML5** : Structure sémantique et accessible
- **CSS3** : Styles modernes avec variables CSS, animations, responsive design
  - Variables CSS pour les couleurs et espacements
  - Media queries pour le responsive
  - Keyframes pour les animations
  - Support du mode sombre
- **JavaScript (Vanilla)** : Logique complète sans framework
  - Gestion asynchrone des fichiers
  - Validation des données
  - Mélange aléatoire des réponses
  - Calcul du score
  - Persistance des préférences (localStorage)
- **Pas de dépendances externes**

- Pour exécuter localement vous pouvez utiliser :
  - Linux : A Dead Simple Fileserver (ADSF - https://github.com/denisdefreyne/adsf/)
  - Windows : Simple Web Server (https://simplewebserver.org/)

## 🎯 Compatibilité

Testé et fonctionnel sur les navigateurs modernes :
- Chrome (recommandé)
- Firefox
- Edge
- Safari

## 🎨 Personnalisation

Vous pouvez facilement :
- **Modifier les couleurs** : Éditez les variables CSS dans `:root` et `.dark-mode`
- **Adapter les styles** : Modifiez les classes dans `style.css`
- **Ajouter des questions** : Créez de nouveaux fichiers JSON dans le dossier `json/`
- **Modifier la logique** : Adaptez le code dans `script.js`
- **Changer les options** : Modifiez les boutons radio dans l'écran 2

## 📊 Modification de la liste des quiz par défaut

L'ajout se fait en mettant à jour le fichier liste_referentiels.json dans le dossier json. Cela doit être fait par un utilisateur pouvant éditer ce fichier.
Le fichier peut pointer n'importe où mais il est recommandé de stocker les json dans le dossier json. Par exemple, l'application contient des référentiels publics ANSSI tels que :
- `anssi_qcm_architectures_si_sensibles.json` : 42 questions sur la cybersécurité (ANSSI)

## 📊 Création d'un quiz à partir d'un document existant

Pour générer un fichier JSON à partir du référentiel, tu peux utiliser une IA avec le prompt suivant : 
```
 partir du fichier INSERERNOM génères une matrice pour chaque exigence ou chapitre une question qcm, la bonne réponse, l'extrait du texte incluant les images et 3 fausses réponses.  Fais cela pour l'intégralité du document et génères un Fichier de sortie json au format suivant :
 {
  "metadata": {
      "titre": "Nom du référentiel",
      "source": "Nom du document",
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

## 💡 Conseils

- Pour de meilleurs résultats, utilisez des fichiers JSON avec des métadonnées complètes
- Les questions avec `chapitre`, `section` et `extrait_source` offrent une meilleure expérience utilisateur
- Testez toujours vos fichiers JSON avec la validation intégrée
- Le mode sombre est plus reposant pour les yeux en faible luminosité

## 📝 Historique des versions

### v2.0 (actuelle)
- Ajout des 4 options de chargement JSON
- Chargement de la liste des Quiz depuis le fichier liste_referentiels.json
- Validation multiple des fichiers
- Mode question par question ou toutes ensemble
- Bouton de bascule mode clair/sombre
- Affichage des métadonnées (référentiel, chapitre, section)
- Meilleure gestion des erreurs
- Design amélioré et responsive

### v1.0
- Version initiale avec chargement simple de JSON
- Quiz basique avec toutes les questions ensemble

## 🤝 Auteur

Application créée par Gérald Grévrend avec Mistral Vibe

## 📄 Licence

Ce projet est open source et peut être utilisé librement.
