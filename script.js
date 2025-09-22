const words = [
  {
    front: 'Hello',
    back: 'Привет',
    example: 'Hello, how are you?',
  },
  {
    front: 'Goodbye',
    back: 'До свидания',
    example: 'Goodbye, see you later!',
  },
  {
    front: 'Thank you',
    back: 'Спасибо',
    example: 'Thank you for your help.',
  },
  {
    front: 'Please',
    back: 'Пожалуйста',
    example: 'Please, come in.',
  },
  {
    front: 'Yes',
    back: 'Да',
    example: 'Yes, I understand.',
  },
  {
    front: 'Cat',
    back: 'Кот',
    example: 'Cat is sleeping now.',
  },
  {
    front: 'Morning',
    back: 'Утро',
    example: 'Good morning!',
  },
  
];

let currentWordIndex = 0;
let examWords = [];
let firstCard = null;
let examMode = false;

const flipCard = document.querySelector('.flip-card');
const cardFront = document.querySelector('#card-front h1');
const cardBackWord = document.querySelector('#card-back h1');
const cardBackExample = document.querySelector('#card-back span');
const backButton = document.querySelector('#back');
const nextButton = document.querySelector('#next');
const currentWordSpan = document.querySelector('#current-word');
const totalWordSpan = document.querySelector('#total-word');
const examButton = document.querySelector('#exam');
const studyCards = document.querySelector('.study-cards');
const examCardsContainer = document.querySelector('#exam-cards');
const studyModeDiv = document.querySelector('#study-mode');
const examModeDiv = document.querySelector('#exam-mode');

const studyWordsSlider = document.querySelector('#words-progress');

function updateStudyWordsSlider() {
    const progress = ((currentWordIndex + 1) / words.length) * 100;
    studyWordsSlider.style.width = `${progress}%`;
}

function displayWord() {
    cardFront.textContent = words[currentWordIndex].front;
    cardBackWord.textContent = words[currentWordIndex].back;
    cardBackExample.textContent = words[currentWordIndex].example;
    currentWordSpan.textContent = currentWordIndex + 1;
    totalWordSpan.textContent = words.length;

    backButton.disabled = currentWordIndex === 0;
    nextButton.disabled = currentWordIndex === words.length - 1;
    flipCard.classList.remove('active');
    updateStudyWordsSlider();
}

function nextWord() {
    if (currentWordIndex < words.length - 1) {
        currentWordIndex++;
        displayWord();
    }
}

function prevWord() {
    if (currentWordIndex > 0) {
        currentWordIndex--;
        displayWord();
    }
}

function startExamMode() {
    examMode = true;
    studyCards.classList.add('hidden');
    examCardsContainer.classList.remove('hidden');
    studyModeDiv.classList.add('hidden');
    examModeDiv.classList.remove('hidden');

    const frontWords = words.map(word => ({ ...word, type: 'front' }));
    const backWords = words.map(word => ({ ...word, type: 'back' }));
    examWords = [...frontWords, ...backWords].sort(() => Math.random() - 0.5);
    renderExamCards();
}

function renderExamCards() {
    examCardsContainer.innerHTML = '';
    examWords.forEach((word, index) => {
        const card = document.createElement('div');
        card.dataset.index = index;
        card.classList.add('card');
        card.textContent = word.type === 'front' ? word.front : word.back;
        card.dataset.front = word.front;
        card.dataset.back = word.back;
        card.dataset.type = word.type;
        card.dataset.flipped = 'false';
        card.addEventListener('click', handleExamCardClick);
        examCardsContainer.appendChild(card);
    });
}

async function handleExamCardClick(event) {
    const card = event.target;
    const index = parseInt(card.dataset.index);
    const word = examWords[index];

    if (card.classList.contains('correct') || card.classList.contains('wrong') || card.classList.contains('hidden')) {
        return; 
    }

    if (!firstCard) {
        firstCard = { card, word, index };
        card.classList.add('correct'); 
        card.classList.remove('active'); 
    } else {
        
        const isMatch =
            firstCard.card.dataset.front === card.dataset.front &&
            firstCard.card.dataset.back === card.dataset.back &&
            firstCard.card.dataset.type !== card.dataset.type; 
        if (isMatch) {
            
            card.classList.add('correct'); 

            firstCard.card.classList.add('fade-out');
            card.classList.add('fade-out');
            await new Promise((resolve) => setTimeout(resolve, 500)); 
            
            examWords[firstCard.index] = null; 
            examWords[index] = null;

            const remainingCards = examWords.filter((word) => word !== null);
            if (remainingCards.length === 0) {
                alert('Congratulations! You completed the test!');
            }
        } else {
            
            card.classList.add('wrong');
            firstCard.card.classList.add('wrong');

            await new Promise((resolve) => setTimeout(resolve, 500));

            card.classList.remove('wrong');
            firstCard.card.classList.remove('wrong');
            firstCard.card.classList.remove('correct');
        }

        firstCard = null; 

    }
}

flipCard.addEventListener('click', () => {
    flipCard.classList.toggle('active');
});

nextButton.addEventListener('click', nextWord);
backButton.addEventListener('click', prevWord);
examButton.addEventListener('click', startExamMode);

displayWord();