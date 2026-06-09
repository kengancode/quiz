// Développé par Gérald Grévrend avec l'aide de Mistral Vibe

document.addEventListener('DOMContentLoaded', () => {
  // ==================== Éléments DOM ====================
  const screens = document.querySelectorAll('.screen');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('.theme-icon');
  
  // Écran 1
  const nextBtn1 = document.getElementById('nextBtn1');
  const jsonFile = document.getElementById('jsonFile');
  const fileName = document.getElementById('fileName');
  const fileError = document.getElementById('fileError');
  const availableJsonList = document.getElementById('availableJsonList');
  const selectionError = document.getElementById('selectionError');
  const randomBtn = document.getElementById('randomBtn');
  const randomSelection = document.getElementById('randomSelection');
  const allBtn = document.getElementById('allBtn');
  const allSelection = document.getElementById('allSelection');
  const validationContainer = document.getElementById('validationContainer');
  const validationErrors = document.getElementById('validationErrors');
  const cancelValidationBtn = document.getElementById('cancelValidationBtn');
  const continueWithValidBtn = document.getElementById('continueWithValidBtn');
  
  // Écran 2
  const nextBtn2 = document.getElementById('nextBtn2');
  const backBtn2 = document.getElementById('backBtn2');
  const countError = document.getElementById('countError');
  const customCount = document.getElementById('customCount');
  const radioCustom = document.querySelector('input[name="questionCount"][value="custom"]');
  const totalQuestionsInfo = document.getElementById('totalQuestionsInfo');
  const totalQuestionsCount = document.getElementById('totalQuestionsCount');
  
  // Écran 3
  const quizForm = document.getElementById('quizForm');
  const questionsContainer = document.getElementById('questionsContainer');
  const results = document.getElementById('results');
  const scoreDisplay = document.getElementById('score');
  const resultsDetails = document.getElementById('resultsDetails');
  const showAllQuestions = document.getElementById('showAllQuestions');
  const quizProgress = document.getElementById('quizProgress');
  const currentQuestionNum = document.getElementById('currentQuestionNum');
  const totalQuestionsNum = document.getElementById('totalQuestionsNum');
  const progressBar = document.getElementById('progressBar');
  const prevQuestionBtn = document.getElementById('prevQuestionBtn');
  const nextQuestionBtn = document.getElementById('nextQuestionBtn');
  const restartBtn = document.getElementById('restartBtn');
  const backToStartBtn = document.getElementById('backToStartBtn');
  const validateBtn = document.getElementById('validateBtn');

  // ==================== État ====================
  let allQuizData = []; // Tableau de {data, fileName, isValid, errors}
  let selectedFiles = []; // Noms des fichiers sélectionnés
  let quizData = null; // Données combinées pour le quiz
  let selectedQuestions = [];
  let userAnswers = {};
  let currentQuestionIndex = 0;
  let availableJsonFiles = [];

  // ==================== Initialisation ====================
  
  // Charger la liste des fichiers JSON disponibles
  async function loadAvailableJsonFiles() {
    let filesToTest = [
            {nom: 'NIS2', chemin : 'recyf_v2_5_qcm.json' },
            {nom: 'Architecture', chemin : 'anssi_qcm_architectures_si_sensibles.json' },
            {nom: 'IGI1300', chemin : 'igi_1300_qcm_final.json' }
          ];
    try {
      // Liste des fichiers JSON à tester dans le dossier json/
      // on essaie de charger le fichier liste_referentiels
        const response = await fetch(`json/liste_referentiels.json`);
        if (response.ok) {
          filesToTest = await response.json();
          const validation = validateListeJsonData(filesToTest, 'json/liste_referentiels.json'); 
        } 
        else {
          console.log('Pas de fichier ou erreur sur liste_ referentiels.json, on utilise la liste par défaut');
          // en cas d'échec on utilise une liste par défaut
          filesToTest = [
            {nom: 'NIS2', chemin : 'recyf_v2_5_qcm.json' },
            {nom: 'Architecture', chemin : 'anssi_qcm_architectures_si_sensibles.json' },
            {nom: 'IGI1300', chemin : 'igi_1300_qcm_final.json' }
          ];
        }
      
console.log(filesToTest);
      availableJsonFiles = [];
      // Tester chaque fichier pour voir s'il existe
      for (const fileName of filesToTest) {
        console.log('A')
        try {
          const response = await fetch(`json/${fileName.chemin}`);
          if (response.ok) {
            availableJsonFiles.push(fileName);
          }
        } catch (err) {
          // Fichier non trouvé, on passe au suivant
          console.log(`Fichier non trouvé: ${fileName.chemin}`);
        }
      }
      
      // Si aucun fichier trouvé, afficher un message
      if (availableJsonFiles.length === 0) {
        availableJsonList.innerHTML = '<p class="loading-placeholder">Aucun fichier JSON trouvé dans le dossier json/</p>';
      } else {
        displayAvailableJsonFiles();
      }
    } catch (err) {
      console.error('Erreur lors du chargement des fichiers:', err);
      availableJsonList.innerHTML = '<p class="error">Impossible de charger la liste des fichiers JSON.</p>';
    }
  }

  function displayAvailableJsonFiles() {
    if (availableJsonFiles.length === 0) {
      availableJsonList.innerHTML = '<p class="loading-placeholder">Aucun fichier JSON trouvé dans le dossier json/A</p>';
      return;
    }

    let html = '<div class="checkbox-group">';
    availableJsonFiles.forEach(fileName => {
      const displayName = fileName.nom;
      html += `
        <label class="json-checkbox">
          <input type="checkbox" name="availableJson" value="${fileName.chemin}">
          <span class="checkbox-custom"></span>
          <span class="json-name">${displayName}</span>
        </label>
      `;
    });
    html += '</div>';
    availableJsonList.innerHTML = html;

    // Ajouter des écouteurs aux checkboxes
    const checkboxes = document.querySelectorAll('input[name="availableJson"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateSelectedFiles);
    });
  }

  function updateSelectedFiles() {
    const checkboxes = document.querySelectorAll('input[name="availableJson"]:checked');
    selectedFiles = Array.from(checkboxes).map(cb => cb.value);
    updateNextBtn1State();
  }

  function updateNextBtn1State() {
    // Activer le bouton Suivant si au moins une option est sélectionnée
    const hasSelection = selectedFiles.length > 0 || 
                         jsonFile.files.length > 0 || 
                         randomSelection.textContent || 
                         allSelection.textContent;
    nextBtn1.disabled = !hasSelection;
  }

  // Charger les fichiers JSON sélectionnés
  async function loadSelectedJsonFiles() {
    const filesToLoad = [...selectedFiles];
    
    // Ajouter le fichier téléchargé si présent
    if (jsonFile.files.length > 0) {
      filesToLoad.push('uploaded:' + jsonFile.files[0].name);
    }
    
    // Ajouter le fichier aléatoire si sélectionné
    if (randomSelection.textContent) {
      // Extraire le nom du fichier de la sélection aléatoire
      const match = randomSelection.textContent.match(/Fichier sélectionné: ([^\s]+)/);
      if (match) {
        filesToLoad.push(match[1]);
      }
    }
    
    // Ajouter tous les fichiers si sélectionné
    if (allSelection.textContent) {
      filesToLoad.push(...availableJsonFiles);
    }
    
    // Éviter les doublons
    const uniqueFiles = [...new Set(filesToLoad)];
    
    allQuizData = [];
    
    for (const fileIdentifier of uniqueFiles) {
      if (fileIdentifier.startsWith('uploaded:')) {
        // Fichier téléchargé
        const file = jsonFile.files[0];
        await processUploadedFile(file);
      } else {
        // Fichier du dossier json/
        await loadJsonFile(fileIdentifier);
      }
    }
    
    return allQuizData;
  }

  async function processUploadedFile(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const validation = validateJsonData(data, file.name);
          allQuizData.push({
            data: data,
            fileName: file.name,
            isValid: validation.isValid,
            errors: validation.errors,
            metadata: data.metadata || { titre: file.name }
          });
          resolve();
        } catch (err) {
          allQuizData.push({
            data: null,
            fileName: file.name,
            isValid: false,
            errors: [`Erreur de parsing: ${err.message}`],
            metadata: { titre: file.name }
          });
          resolve();
        }
      };
      reader.readAsText(file);
    });
  }

  async function loadJsonFile(fileName) {
    try {
      const response = await fetch(`json/${fileName}`);
      if (!response.ok) {
        throw new Error(`Fichier non trouvé: ${fileName}`);
      }
      const data = await response.json();
      const validation = validateJsonData(data, fileName);
      allQuizData.push({
        data: data,
        fileName: fileName,
        isValid: validation.isValid,
        errors: validation.errors,
        metadata: data.metadata || { titre: fileName }
      });
    } catch (err) {
      allQuizData.push({
        data: null,
        fileName: fileName,
        isValid: false,
        errors: [`Erreur de chargement: ${err.message}`],
        metadata: { titre: fileName }
      });
    }
  }

  function validateJsonData(data, fileName) {
    const errors = [];
    
    if (!data) {
      errors.push('Fichier vide ou invalide');
      return { isValid: false, errors };
    }
    
    if (!data.questions || !Array.isArray(data.questions)) {
      errors.push('Le champ "questions" est manquant ou n\'est pas un tableau');
    }
    
    if (data.questions && data.questions.length === 0) {
      errors.push('Le fichier ne contient aucune question');
    }
    
    // Valider chaque question
    if (data.questions) {
      data.questions.forEach((q, index) => {
        if (!q.question) {
          errors.push(`Question ${index + 1}: le champ "question" est manquant`);
        }
        if (!q.bonne_reponse) {
          errors.push(`Question ${index + 1}: le champ "bonne_reponse" est manquant`);
        }
        if (!q.fausses_reponses || !Array.isArray(q.fausses_reponses)) {
          errors.push(`Question ${index + 1}: le champ "fausses_reponses" est manquant ou invalide`);
        }
        if (!q.id) {
          errors.push(`Question ${index + 1}: le champ "id" est manquant`);
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  function validateListeJsonData(data, fileName) {
    const errors = [];
    if (data) {
      errors.push('Fichier vide ou invalide');
      return { isValid: false, errors };
    }
    
    if (!Array.isArray(data)) {
      errors.push('Le fichier n\'est pas un tableau');
    }

    if (data.length === 0) {
      errors.push('Fichier vide ou invalide');
      return { isValid: false, errors };
    }
    
    // Valider chaque entrée
    data.forEach((q, index) => {
      if (!q.nom) {
        errors.push(`Entrée ${index + 1}: le champ "nom" est manquant`);
      }
      if (!q.chemin) {
          errors.push(`Entrée ${index + 1}: le champ "chemin" est manquant`);
      }
        
    });
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  function showValidationErrors() {
    const invalidFiles = allQuizData.filter(f => !f.isValid);
    const validFiles = allQuizData.filter(f => f.isValid);
    
    if (invalidFiles.length === 0) {
      // Tous les fichiers sont valides, passer à l'écran 2
      prepareQuizData();
      showScreen(1);
      return;
    }
    
    // Afficher les erreurs de validation
    let errorsHtml = '<div class="validation-errors">';
    
    invalidFiles.forEach(fileData => {
      errorsHtml += `
        <div class="invalid-file">
          <h4>❌ ${fileData.metadata.titre || fileData.fileName}</h4>
          <ul>
            ${fileData.errors.map(error => `<li>${error}</li>`).join('')}
          </ul>
        </div>
      `;
    });
    
    errorsHtml += '</div>';
    
    if (validFiles.length > 0) {
      errorsHtml += `<p class="validation-info">✅ ${validFiles.length} fichier(s) valide(s) peuvent être utilisés.</p>`;
      continueWithValidBtn.classList.remove('hidden');
    } else {
      continueWithValidBtn.classList.add('hidden');
    }
    
    validationErrors.innerHTML = errorsHtml;
    validationContainer.classList.remove('hidden');
  }

  function prepareQuizData() {
    const validFiles = allQuizData.filter(f => f.isValid);
    
    // Combiner toutes les questions des fichiers valides
    let allQuestions = [];
    validFiles.forEach(fileData => {
      if (fileData.data && fileData.data.questions) {
        fileData.data.questions.forEach(question => {
          // Ajouter des métadonnées à chaque question
          allQuestions.push({
            ...question,
            sourceFile: fileData.fileName,
            sourceTitle: fileData.metadata.titre || fileData.fileName
          });
        });
      }
    });
    
    quizData = {
      questions: allQuestions,
      metadata: {
        sources: validFiles.map(f => f.metadata.titre || f.fileName)
      }
    };
    
    // Mettre à jour l'affichage du nombre total de questions
    totalQuestionsCount.textContent = quizData.questions.length;
  }

  // ==================== Navigation ====================
  const showScreen = (index) => {
    screens.forEach((screen, i) => {
      screen.classList.toggle('active', i === index);
    });
  };

  // ==================== Écran 1: Gestion des options ====================
  
  // Option 2: Téléchargement de fichier
  jsonFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
      fileName.textContent = 'Aucun fichier sélectionné';
      fileError.textContent = '';
      updateNextBtn1State();
      return;
    }

    fileName.textContent = file.name;
    fileError.textContent = '';
    updateNextBtn1State();
  });

  // Option 3: Sélection aléatoire
  randomBtn.addEventListener('click', () => {
    if (availableJsonFiles.length === 0) {
      randomSelection.textContent = 'Aucun fichier disponible';
      randomSelection.classList.add('error');
      return;
    }
    
    // Désélectionner les autres options
    selectedFiles = [];
    document.querySelectorAll('input[name="availableJson"]').forEach(cb => {
      cb.checked = false;
    });
    jsonFile.value = '';
    fileName.textContent = 'Aucun fichier sélectionné';
    allSelection.textContent = '';
    
    const randomIndex = Math.floor(Math.random() * availableJsonFiles.length);
    const selectedFile = availableJsonFiles[randomIndex];
    randomSelection.textContent = `Fichier sélectionné: ${selectedFile}`;
    randomSelection.classList.remove('error');
    updateNextBtn1State();
  });

  // Option 4: Tous les fichiers
  allBtn.addEventListener('click', () => {
    if (availableJsonFiles.length === 0) {
      allSelection.textContent = 'Aucun fichier disponible';
      allSelection.classList.add('error');
      return;
    }
    
    // Désélectionner les autres options
    selectedFiles = [];
    document.querySelectorAll('input[name="availableJson"]').forEach(cb => {
      cb.checked = false;
    });
    jsonFile.value = '';
    fileName.textContent = 'Aucun fichier sélectionné';
    randomSelection.textContent = '';
    
    allSelection.textContent = `Tous les fichiers sélectionnés (${availableJsonFiles.length})`;
    allSelection.classList.remove('error');
    updateNextBtn1State();
  });

  // Bouton Suivant écran 1
  nextBtn1.addEventListener('click', async () => {
    if (!nextBtn1.disabled) {
      await loadSelectedJsonFiles();
      showValidationErrors();
    }
  });

  // Boutons de validation
  cancelValidationBtn.addEventListener('click', () => {
    validationContainer.classList.add('hidden');
  });

  continueWithValidBtn.addEventListener('click', () => {
    prepareQuizData();
    validationContainer.classList.add('hidden');
    showScreen(1);
  });

  // ==================== Écran 2: Sélection du nombre de questions ====================
  
  radioCustom.addEventListener('change', () => {
    customCount.disabled = !radioCustom.checked;
    if (!radioCustom.checked) customCount.value = '';
  });

  backBtn2.addEventListener('click', () => {
    showScreen(0);
  });

  nextBtn2.addEventListener('click', () => {
    let count;
    const selectedRadio = document.querySelector('input[name="questionCount"]:checked');

    if (selectedRadio.value === 'custom') {
      count = parseInt(customCount.value);
      if (isNaN(count) || count < 1 || count > quizData.questions.length) {
        countError.textContent = `Nombre invalide (1-${quizData.questions.length})`;
        return;
      }
    } else {
      count = parseInt(selectedRadio.value);
      if (count > quizData.questions.length) {
        //countError.textContent = `Nombre trop élevé. Maximum disponible: ${quizData.questions.length}`;
        count = quizData.questions.length;
        //return;
      }
    }

    countError.textContent = '';
    selectedQuestions = getRandomQuestions(count);
    currentQuestionIndex = 0;
    renderQuiz();
    showScreen(2);
  });

  // ==================== Écran 3: Quiz ====================
  
  const getRandomQuestions = (count) => {
    const shuffled = [...quizData.questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => 0.5 - Math.random());
  };

  function renderQuiz() {
    questionsContainer.innerHTML = '';
    userAnswers = {};
    
    const showAll = showAllQuestions.checked;
    
    if (showAll) {
      // Afficher toutes les questions
      quizProgress.classList.add('hidden');
      prevQuestionBtn.classList.add('hidden');
      nextQuestionBtn.classList.add('hidden');
      
      selectedQuestions.forEach((q, index) => {
        renderQuestion(q, index);
      });
    } else {
      // Afficher une question à la fois
      quizProgress.classList.remove('hidden');
      prevQuestionBtn.classList.remove('hidden');
      nextQuestionBtn.classList.remove('hidden');
      
      totalQuestionsNum.textContent = selectedQuestions.length;
      renderSingleQuestion();
    }
  }

  function renderSingleQuestion() {
    const q = selectedQuestions[currentQuestionIndex];
    questionsContainer.innerHTML = '';
    renderQuestion(q, currentQuestionIndex);
    
    currentQuestionNum.textContent = currentQuestionIndex + 1;
    const progressPercent = ((currentQuestionIndex) / selectedQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Gérer les boutons Précédent/Suivant
    prevQuestionBtn.disabled = currentQuestionIndex === 0;
    nextQuestionBtn.disabled = currentQuestionIndex === selectedQuestions.length - 1;
  }

  function renderQuestion(q, index) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.dataset.id = q.id;
    questionDiv.dataset.index = index;

    const options = shuffleArray([q.bonne_reponse, ...q.fausses_reponses]);
    const questionId = `q_${index}`;

    // Ajouter les métadonnées de la question
    const metadataHtml = `
      <div class="question-metadata" style="visibility: hidden ; display:inline;">
        <span class="source">📚 ${q.sourceTitle || q.sourceFile}</span>
        ${q.chapitre ? `<span class="chapitre">📖 ${q.chapitre}</span>` : ''}
        ${q.section ? `<span class="section">📝 ${q.section}</span>` : ''}
      </div>
    `;
      //${metadataHtml} etait dans innerHTML
    questionDiv.innerHTML = `
      ${metadataHtml}
      <h3>Question ${index + 1}</h3>
      <p>${q.question}</p>
      <div class="options">
        ${options.map((option, i) => `
          <label class="option">
            <input type="radio" name="${questionId}" value="${escapeHtml(option)}">
            <span class="option-text">${option}</span>
          </label>
        `).join('')}
      </div>
    `;

    questionsContainer.appendChild(questionDiv);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  prevQuestionBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderSingleQuestion();
    }
  });

  nextQuestionBtn.addEventListener('click', () => {
    // Sauvegarder la réponse actuelle
    saveCurrentAnswer();
    
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      currentQuestionIndex++;
      renderSingleQuestion();
    }
  });

  function saveCurrentAnswer() {
    const q = selectedQuestions[currentQuestionIndex];
    const questionId = `q_${currentQuestionIndex}`;
    const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
    userAnswers[q.id] = selectedOption ? selectedOption.value : null;
  }

  // Basculer entre affichage une par une et toutes ensemble
  showAllQuestions.addEventListener('change', () => {
    // Sauvegarder la réponse actuelle si on est en mode question par question
    if (!showAllQuestions.checked && currentQuestionIndex < selectedQuestions.length) {
      saveCurrentAnswer();
    }
    renderQuiz();
  });

  // Validation du quiz
  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Si on est en mode question par question, sauvegarder la réponse actuelle
    if (!showAllQuestions.checked) {
      saveCurrentAnswer();
    } else {
      // Collecter toutes les réponses
      selectedQuestions.forEach((q, index) => {
        const questionId = `q_${index}`;
        const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
        userAnswers[q.id] = selectedOption ? selectedOption.value : null;
      });
    }

    displayResults();
  });

  function displayResults() {
    // Calculer le score
    let score = 0;
    const resultsHTML = selectedQuestions.map((q) => {
      const userAnswer = userAnswers[q.id];
      const isCorrect = userAnswer === q.bonne_reponse;
      if (isCorrect) score++;

      return `
        <div class="result-question ${isCorrect ? 'correct' : 'incorrect'}">
          <div class="result-metadata">
            <span class="source">📚 ${q.sourceTitle || q.sourceFile}</span>
            ${q.chapitre ? `<span class="chapitre">📖 ${q.chapitre}</span>` : ''}
            ${q.section ? `<span class="section">📝 ${q.section}</span>` : ''}
          </div>
          <h4>${q.question}</h4>
          <p>Votre réponse: <strong>${userAnswer || 'Non répondue'}</strong></p>
          <p class="correct-answer">✅ Bonne réponse: ${q.bonne_reponse}</p>
          ${q.extrait_source ? `<p class="explanation">💡 Explication: ${q.extrait_source}</p>` : ''}
          ${!isCorrect && userAnswer ? `<p class="wrong-answer">❌ Vous avez répondu: ${userAnswer}</p>` : ''}
        </div>
      `;
    }).join('');

    // Afficher les résultats
    scoreDisplay.textContent = `${score}/${selectedQuestions.length}`;
    resultsDetails.innerHTML = resultsHTML;
    results.classList.remove('hidden');
    quizForm.style.display = 'none';
    quizProgress.classList.add('hidden');
  }

  // Boutons de résultats
  restartBtn.addEventListener('click', () => {
    // Recommencer le quiz avec les mêmes paramètres
    selectedQuestions = getRandomQuestions(selectedQuestions.length);
    currentQuestionIndex = 0;
    userAnswers = {};
    results.classList.add('hidden');
    quizForm.style.display = 'block';
    renderQuiz();
  });

  backToStartBtn.addEventListener('click', () => {
    // Retour à l'écran 1
    resetQuiz();
    showScreen(0);
  });

  function resetQuiz() {
    allQuizData = [];
    selectedFiles = [];
    quizData = null;
    selectedQuestions = [];
    userAnswers = {};
    currentQuestionIndex = 0;
    
    // Réinitialiser les sélections
    document.querySelectorAll('input[name="availableJson"]').forEach(cb => {
      cb.checked = false;
    });
    jsonFile.value = '';
    fileName.textContent = 'Aucun fichier sélectionné';
    fileError.textContent = '';
    randomSelection.textContent = '';
    allSelection.textContent = '';
    validationContainer.classList.add('hidden');
    
    // Réinitialiser l'écran 2
    document.querySelector('input[name="questionCount"][value="5"]').checked = true;
    customCount.value = '';
    customCount.disabled = true;
    countError.textContent = '';
    
    // Réinitialiser l'écran 3
    showAllQuestions.checked = true;
    results.classList.add('hidden');
    quizForm.style.display = 'block';
    questionsContainer.innerHTML = '';
  }

  // ==================== Thème clair/sombre ====================
  
  // Charger la préférence de thème
  function loadThemePreference() {
    const savedTheme = localStorage.getItem('quizTheme');
    if (savedTheme) {
      document.body.classList.add(savedTheme);
      updateThemeIcon(savedTheme);
    } else {
      // Utiliser la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.add('dark-mode');
        updateThemeIcon('dark-mode');
      }
    }
  }

  function updateThemeIcon(theme) {
    if (theme === 'dark-mode') {
      themeIcon.textContent = '☀️';
      themeToggle.setAttribute('aria-label', 'Basculer en mode clair');
    } else {
      themeIcon.textContent = '🌙';
      themeToggle.setAttribute('aria-label', 'Basculer en mode sombre');
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    const theme = isDark ? 'dark-mode' : 'light-mode';
    localStorage.setItem('quizTheme', theme);
    updateThemeIcon(theme);
  }

  themeToggle.addEventListener('click', toggleTheme);

  // Écouter les changements de préférence système
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('quizTheme')) {
      // Seulement appliquer si pas de préférence sauvegardée
      if (e.matches) {
        document.body.classList.add('dark-mode');
        updateThemeIcon('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcon('light-mode');
      }
    }
  });

  // ==================== Initialisation ====================

  loadThemePreference();
  loadAvailableJsonFiles();
  updateNextBtn1State();
});
