# quiz
Cette application basique permet de répondre à des quiz à partir de questionnaires pré construits en JSON
Cela peut peut etre utile pour auto apprendre/réviser des référentiels/cours

## Utilisation
### Ecran 1 de sélection du quiz
Le premier écran permet de choisir le quiz, il y a 4 options :
- 1 : Choisir un ou plusieur quiz parmi les fichiers disponibles dans le dossier json
- 2 : Laisser le système prendre un quiz au hasard
- 3 : Utiliser tous les quiz en même temps
- 4 : Uploader votre propre quiz (voir plus loin la structure)

En cas d'erreur sur un fichier de quiz, l'application affiche une erreur et permet de revenir en arrière ou de continuer

### Ecran 2 de configuration du nombre de question
Vous choisisser le nombre de question parmi les options disponibles ou en entrant un nombre
Le système vérifie que le nombre retenu n'excède pas le nombre de questions disponibles

### Ecran 3 quiz
Les questions sont toutes affichées dans le désordre au format QCM, vous repondez aux questions puis validez.

### Ecran 4 Fin
Une fois toutes les questions répondues, le système reprendre les questions en indiquant la réussite ou pas.
En cas d'erreur, la bonne réponse est indiquée avec l'extrait du texte expliquant la réponse.
Pour chaque question nous indiquons le référentiel utilisé ainsi que le chapitre concerné


## Pour l'administrateur, définition de la liste des référentiels
La liste est chargée depuis le fichier "json/liste_referentiels.json" qui a la structure suivante :
 {
"liste": [
    {
        "nom" : "Nom du référentiel",
        "chemin" : "Chemin d'accès au JSON"
    },
    {
        "nom" : "Nom du référentiel",
        "chemin" : "Chemin d'accès au JSON"
    }
  ]
 }
Le fichier est édité manuellement par la personne ayant les droits sur l'hébergement du quiz.


## Pour générer un fichier JSON à partir du référentiel, tu peux utiliser le prompt suivant : 

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


## TODO
Faire en sorte que l'option de chargement ne fonctionne qu'en local
Sur la page 4 afficher une statistiques globale et par référentiel s'il y en a plusieurs, regouper par référentiel