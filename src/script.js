document.addEventListener('DOMContentLoaded', () => {
  // Éléments DOM
  const screens = document.querySelectorAll('.screen');
  const nextBtn1 = document.getElementById('nextBtn1');
  const nextBtn2 = document.getElementById('nextBtn2');
  const jsonFile = document.getElementById('jsonFile');
  const fileName = document.getElementById('fileName');
  const fileError = document.getElementById('fileError');
  const countError = document.getElementById('countError');
  const customCount = document.getElementById('customCount');
  const radioCustom = document.querySelector('input[name="questionCount"][value="custom"]');
  const quizForm = document.getElementById('quizForm');
  const questionsContainer = document.getElementById('questionsContainer');
  const results = document.getElementById('results');
  const scoreDisplay = document.getElementById('score');
  const resultsDetails = document.getElementById('resultsDetails');

  // État
  let quizData = null;
  let selectedQuestions = [];
  let userAnswers = {};

  // Navigation
  const showScreen = (index) => {
    screens.forEach((screen, i) => {
      screen.classList.toggle('active', i === index);
    });
  };

  // Écran 1: Validation fichier JSON
  jsonFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileName.textContent = file.name;
    fileError.textContent = '';

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        quizData = JSON.parse(e.target.result);
        if (!quizData.questions || !Array.isArray(quizData.questions)) {
          throw new Error('Fichier invalide: "questions" manquant ou non tableau');
        }
        nextBtn1.disabled = false;
      } catch (err) {
        fileError.textContent = `Erreur: ${err.message}`;
        nextBtn1.disabled = true;
        quizData = null;
      }
    };
    reader.readAsText(file);
  });

  nextBtn1.addEventListener('click', () => {
    if (!quizData) return;
    showScreen(1);
  });

  // Écran 2: Sélection nombre de questions
  radioCustom.addEventListener('change', () => {
    customCount.disabled = !radioCustom.checked;
    if (!radioCustom.checked) customCount.value = '';
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
    }

    countError.textContent = '';
    selectedQuestions = getRandomQuestions(count);
    renderQuiz();
    showScreen(2);
  });

  // Génération du quiz
  const getRandomQuestions = (count) => {
    const shuffled = [...quizData.questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => 0.5 - Math.random());
  };

  const renderQuiz = () => {
    questionsContainer.innerHTML = '';
    userAnswers = {};

    selectedQuestions.forEach((q, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question';
      questionDiv.dataset.id = q.id;

      const options = shuffleArray([q.bonne_reponse, ...q.fausses_reponses]);
      const questionId = `q_${index}`;

      questionDiv.innerHTML = `
        <h3>Question ${index + 1}${q.difficulte ? ` (${q.difficulte})` : ''}</h3>
        <p>${q.question}</p>
        <div class="options">
          ${options.map((option, i) => `
            <label class="option">
              <input type="radio" name="${questionId}" value="${option}" required>
              <span>${option}</span>
            </label>
          `).join('')}
        </div>
      `;

      questionsContainer.appendChild(questionDiv);
    });
  };

  // Validation du quiz
  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collecter les réponses
    selectedQuestions.forEach((q, index) => {
      const questionId = `q_${index}`;
      const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
      userAnswers[q.id] = selectedOption ? selectedOption.value : null;
    });

    // Calculer le score
    let score = 0;
    const resultsHTML = selectedQuestions.map((q) => {
      const userAnswer = userAnswers[q.id];
      const isCorrect = userAnswer === q.bonne_reponse;
      if (isCorrect) score++;

      return `
        <div class="result-question ${isCorrect ? 'correct' : 'incorrect'}">
          <h4>${q.question}</h4>
          <p>Votre réponse: <strong>${userAnswer || 'Non répondue'}</strong></p>
          <p class="correct-answer">Bonne réponse: ${q.bonne_reponse}</p>
          ${q.extrait_source ? `<p class="explanation">Explication: ${q.extrait_source}</p>` : ''}
        </div>
      `;
    }).join('');

    // Afficher les résultats
    scoreDisplay.textContent = `${score}/${selectedQuestions.length}`;
    resultsDetails.innerHTML = resultsHTML;
    results.classList.remove('hidden');
    quizForm.style.display = 'none';
  });
});
