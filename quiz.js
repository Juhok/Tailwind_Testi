const quizQuestions = [
  {
    question: "What is cloud computing primarily used for in game development?",
    choices: [
      "Storing game art assets and running servers", 
      "Increasing frame rates on local devices",
      "Replacing all game designers with AI",
      "Reducing the number of players online"
    ],
    answer: 0
  },
  {
    question: "Which AI tool is commonly used for generating game text, dialogue, or story ideas?",
    choices: [
      "A neural network that creates textures",
      "A language model like GPT",
      "A physics engine",
      "A sound mixer"
    ],
    answer: 1
  },
  {
    question: "What does sustainability mean for a game project?",
    choices: [
      "Making sure the game runs only on the latest hardware",
      "Building games that are maintainable and efficient over time",
      "Using as much power as possible to improve graphics",
      "Releasing a new title every month"
    ],
    answer: 1
  },
  {
    question: "What should you do while waiting for an AI response during development?",
    choices: [
      "Leave the project idle and wait", 
      "Plan the next steps and review current work",
      "Delete the project files",
      "Start a new unrelated game immediately"
    ],
    answer: 1
  },
  {
    question: "Why are databases important for AI tools and games?",
    choices: [
      "They make the game launch faster",
      "They store information and help AI learn from data",
      "They improve the color palette",
      "They are only used for player chat"
    ],
    answer: 1
  },
  {
    question: "What is one safe way to use AI prompts in game design?",
    choices: [
      "Copy the first result without checking it",
      "Refine prompts and validate output before using it",
      "Use prompts for unrelated videos only",
      "Avoid prompts completely"
    ],
    answer: 1
  },
  {
    question: "Which phrase best describes incremental game development?",
    choices: [
      "Build everything at once and launch once",
      "Develop features step by step and keep older versions available",
      "Only update one game per year",
      "Design without user feedback"
    ],
    answer: 1
  },
  {
    question: "How can AI help with sustainability in your game process?",
    choices: [
      "By generating optimized assets and reducing waste",
      "By using more energy for faster rendering",
      "By ignoring user feedback",
      "By deleting backups after each build"
    ],
    answer: 0
  },
  {
    question: "What is a good practice when using cloud services for development?",
    choices: [
      "Keep track of costs and performance",
      "Leave services running forever",
      "Use multiple providers for the same task always",
      "Never monitor usage"
    ],
    answer: 0
  },
  {
    question: "What should you do if your AI tool gives incorrect game content?",
    choices: [
      "Use it without checking",
      "Review, revise, and try a better prompt",
      "Ignore the AI and stop the project",
      "Publish it immediately"
    ],
    answer: 1
  }
];

let quizQuestionsShuffled = [];
let currentQuestion = 0;
let score = 0;
let selectedChoice = null;

function shuffleArray(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startQuiz() {
  quizQuestionsShuffled = shuffleArray(quizQuestions);
  currentQuestion = 0;
  score = 0;
  quizContainer.classList.remove('hidden');
  scoreContainer.classList.add('hidden');
  renderQuestion();
}

const quizContainer = document.getElementById('quiz-container');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const choicesList = document.getElementById('choices-list');
const nextButton = document.getElementById('next-button');
const scoreContainer = document.getElementById('score-container');
const scoreText = document.getElementById('score-text');
const restartButton = document.getElementById('restart-button');

function renderQuestion() {
  const item = quizQuestionsShuffled[currentQuestion];
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${quizQuestionsShuffled.length}`;
  questionText.textContent = item.question;
  choicesList.innerHTML = '';
  selectedChoice = null;
  nextButton.disabled = true;

  item.choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500';
    button.textContent = choice;
    button.addEventListener('click', () => selectChoice(index, button));
    const li = document.createElement('li');
    li.className = 'mb-3';
    li.appendChild(button);
    choicesList.appendChild(li);
  });

  if (currentQuestion === quizQuestions.length - 1) {
    nextButton.textContent = 'Finish';
  } else {
    nextButton.textContent = 'Next';
  }
}

function selectChoice(index, button) {
  selectedChoice = index;
  nextButton.disabled = false;
  const buttons = choicesList.querySelectorAll('button');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('border-indigo-500 bg-indigo-50', idx === index);
    btn.classList.toggle('bg-white', idx !== index);
  });
}

function showScore() {
  quizContainer.classList.add('hidden');
  scoreContainer.classList.remove('hidden');
  scoreText.textContent = `You scored ${score} out of ${quizQuestionsShuffled.length}!`;
}

function handleNext() {
  if (selectedChoice === null) {
    return;
  }

  if (selectedChoice === quizQuestionsShuffled[currentQuestion].answer) {
    score += 1;
  }

  currentQuestion += 1;
  if (currentQuestion >= quizQuestionsShuffled.length) {
    showScore();
  } else {
    renderQuestion();
  }
}

function restartQuiz() {
  startQuiz();
}

nextButton.addEventListener('click', handleNext);
restartButton.addEventListener('click', restartQuiz);

startQuiz();
