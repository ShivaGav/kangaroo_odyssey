const keyboard = document.querySelector(".keyboard");
const h4 = document.querySelector("h4");
const wordDisplay = document.querySelector(".word-display");
const chance = document.querySelector(".chance");
const img = document.querySelector(".img");

const gameover = document.querySelector(".GameOver");
const gameoverimg = document.querySelector(".gameoverImg");

const hintbox = document.querySelector(".hintBox");
const hintwarning = document.querySelector(".hintWarning")

const answer = document.querySelector(".answer");
const h3 = document.querySelector("h3");
const h6 = document.querySelector("h6");

let count = 0;
let score = 0;
let roundNum = 1;


let usedIndices = JSON.parse(localStorage.getItem('usedIndices')) || [];

function getRandomIndex() {
 let randomIndex;
 do {
     randomIndex = Math.floor(Math.random() * wordList.length);
 } while (usedIndices.includes(randomIndex));
   
 usedIndices.push(randomIndex);
 console.log('After adding index: ', usedIndices);

 localStorage.setItem('usedIndices', JSON.stringify(usedIndices));
 
 
 return randomIndex;
}

const randomIndex = getRandomIndex();
const { word, hint } = wordList[randomIndex];


let remainingTries = 3;
const autoGuessBtn = document.querySelector(".auto-guess-btn");

let autoGuessCount = 0;
const maxAutoGuessCount = 3;
const pointsDisplay = document.querySelector('.points');
const remainingHintsDisplay = document.querySelector('.remaining-hints');
let remainingHints = 3;



 
 // Split the letters into vowels and consonants
 let vowels = [];
 let consonants = [];
 
 let vowelBtn = document.getElementById("vowelBtn");
 let consonantBtn = document.getElementById("consonantBtn");
 let closeWindowBtn = document.getElementById("closeWindow");
 
 vowelBtn.addEventListener("click", () => {
  guessLetter('vowel');
 });
 
 consonantBtn.addEventListener("click", () => {
  guessLetter('consonant');
 });

 closeWindowBtn.addEventListener("click", () => {
  hideWindow();
 })
 
 
 autoGuessBtn.addEventListener("click", () => {
  // Check if the user has enough points (at least 25) to use the auto-guess

  
  if (score >= 25 && remainingHints > 0) {
    document.querySelector(".game").style.opacity = 0.8;
    hintbox.classList.remove('hide'); // Remove 'show' class if it exists
    hintbox.classList.add('show'); // Add 'hide' class
  }

  if (score < 25 && remainingHints > 0){
    document.querySelector(".game").style.opacity = 0.8;
    let hintwarning = document.querySelector('.hintWarning');
    let h3 = hintwarning.querySelector('h3');
    hintwarning.classList.remove('hide'); // Remove 'show' class if it exists
    hintwarning.classList.add('show'); // Add 'hide' class
    h3.innerText = "Not enough points (25 Required)";
  }

  if (remainingHints === 0){
    document.querySelector(".game").style.opacity = 0.8;
    let hintwarning = document.querySelector('.hintWarning');
    let h3 = hintwarning.querySelector('h3');
    hintwarning.classList.remove('hide'); // Remove 'show' class if it exists
    hintwarning.classList.add('show'); // Add 'hide' class
    h3.innerText = "No more hints available";
  }
});

function hideWindow(){
  document.querySelector(".game").style.opacity = 1.0;
  hintwarning.classList.remove('show'); // Remove 'show' class if it exists
  hintwarning.classList.add('hide'); // Add 'hide' class
}

function guessLetter(type) {
  // Check if the user has enough points (at least 25) to use the auto-guess
  if (score >= 25 && remainingHints > 0) {
      const letterElem = document.querySelectorAll(".letter");
  
      // Find the first missing letter (empty letter element)
      const emptyLetterIndex = Array.from(letterElem).findIndex((el) => el.innerText === "");
  
      if (emptyLetterIndex !== -1 && autoGuessCount < maxAutoGuessCount) {
        // Initialize a flag to indicate if a match was found
        let matchFound = false;
 
        // Start from the next letter after the first missing one
        for (let i = emptyLetterIndex + 1; i < word.length; i++) {
          // Get the current letter
          const currentLetter = word[i];
 
          // Determine if the current letter is a vowel or a consonant based on the type parameter
          const currentLetterIsVowel = ['a', 'e', 'i', 'o', 'u'].includes(currentLetter);
          const correctType = currentLetterIsVowel ? 'vowel' : 'consonant';
 
          // If the type matches the type of the current letter, guess it
          if (correctType === type) {
            // Call matchWord with the current letter
            matchWord(currentLetter);
 
            score -= 25;
 
            // Update the points display
            pointsDisplay.innerText = 'Points: ' + score;
 
            // Decrement the remaining hints
            remainingHints--;
 
            // Update the remaining hints display
            remainingHintsDisplay.innerText = `Remaining Hints: ${remainingHints}/${maxAutoGuessCount}`;
            localStorage.setItem('remainingHints', remainingHints.toString());
 
            // Increment the autoGuessCount
            autoGuessCount++;
            document.querySelector(".game").style.opacity = 1.0;
            hintbox.classList.remove('show'); // Remove 'show' class if it exists
            hintbox.classList.add('hide'); // Add 'hide' class
 
            // Set the flag to true and break the loop once a match is found
            matchFound = true;
            break;
          }
        }
 
        // If no match was found, display an alert message
        if (!matchFound) {
          alert(`There are no ${type}s in the word.`);
        }
      }
  }
 }

// Function to update the question number and save it to local storage
function updateAndSaveRoundNum() {
  const questionNumberElement = document.querySelector('.question-number');
  questionNumberElement.innerText = `Question: ${roundNum.num}/10`;
  localStorage.setItem('roundNum', roundNum.toString());
 }




 
 // Event listener for the "PLAY AGAIN" button
 document.querySelector('#nextlevel').addEventListener('click', function() {
  updateAndSaveRoundNum();
  location.reload();
 });
 
 // Load score from local storage when the game starts
 window.onload = function() {
  score = parseInt(localStorage.getItem('score')) || 0;
  roundNum = parseInt(localStorage.getItem('roundNum')) || 1;
  remainingHints = parseInt(localStorage.getItem('remainingHints')) || 3;
  document.querySelector('.points').innerText = 'Points: ' + score;
  document.querySelector('.question-number').innerText = `Question: ${roundNum}/10`;
  document.querySelector('.remaining-hints').innerText = 'Remaining hints: ' +remainingHints + "/3"

  document.querySelector(".game").style.opacity = 1.0;

  let usedIndices = JSON.parse(localStorage.getItem('usedIndices')) || [];
  console.log('After retrieving indices: ', usedIndices);
 };
 
 document.querySelector('.question-number').addEventListener('DOMSubtreeModified', function() {
  localStorage.setItem('roundNum', roundNum.toString());
 });
 
 // Save score to local storage whenever it changes
 document.querySelector('.points').addEventListener('DOMSubtreeModified', function() {
  localStorage.setItem('score', score);
 });



for (var i = 97; i <= 122; i++) {
  let button = document.createElement("button");
  button.classList.add("btn");
  button.innerHTML = String.fromCharCode(i);
  keyboard.appendChild(button);
}

function checkForRounds(round){
  if (round===11){

    let nextLevelButton = document.getElementById('nextlevel');
    let questionNumberElement = document.querySelector('.question-number');

    gameover.classList.add("show");
    document.querySelector(".game").style.opacity = 0.8;
    answer.innerText = word;
    h3.innerText="Congrats!"
    h6.innerText="You have cleared this difficulty!"
    nextLevelButton.innerText = "Proceed to Difficult";
    nextLevelButton.style.backgroundColor = "green";
	nextLevelButton.style.fontSize = "15px";

    score=0;
    roundNum = 1;
    remainingHints = 3;
    usedIndices = [];
    localStorage.removeItem('usedIndices');

    document.querySelector('.points').innerText = 'Points: ' + score;
    questionNumberElement.innerText = `Question: ${roundNum}/10`;
    localStorage.setItem('roundNum', roundNum);
    localStorage.setItem('remainingHints', remainingHints.toString());

    document.querySelector('#nextlevel').addEventListener('click', function() {
      window.location.href = 'diff.html';
  });
  }
}


const gameOver = (bool) => {
  let nextLevelButton = document.getElementById('nextlevel');
  let questionNumberElement = document.querySelector('.question-number');
 
  if (bool) {
     gameover.classList.add("show");
     document.querySelector(".game").style.opacity = 0.8;
     answer.innerText = word;

     score=0;
     roundNum = 1;
     remainingHints = 3;

     usedIndices = [];
     localStorage.removeItem('usedIndices');

     document.querySelector('.points').innerText = 'Points: ' + score;
     const questionNumberElement = document.querySelector('.question-number');
     questionNumberElement.innerText = `Question: ${roundNum}/10`;
     localStorage.setItem('roundNum', roundNum);
     localStorage.setItem('remainingHints', remainingHints.toString());
  } else {
    gameover.classList.add("show");
    document.querySelector(".game").style.opacity = 0.8;
    h3.innerText="Congrats!"
    h6.innerText="You Guessed The Correct Answer!"
    score += 10; // Increase score by 10
    roundNum += 1;
    document.querySelector('.points').innerText = 'Points: ' + score; // Update score display

    nextLevelButton.innerText = "Next Level";
    nextLevelButton.style.backgroundColor = "green";

    const questionNumberElement = document.querySelector('.question-number');
    questionNumberElement.innerText = `Question: ${roundNum}/10`;
    localStorage.setItem('roundNum', roundNum);
    checkForRounds(roundNum)
  }
};

const gameOverwin = () => {
  const letterElem = document.querySelectorAll(".letter");
  var matchLetter = "";

  letterElem.forEach((v) => {
    matchLetter += v.innerText.toLowerCase();
  });

  if (matchLetter === word) {
    // Check if all letters match the word

    // Add a delay before showing the pop-up (e.g., 500 milliseconds)
    setTimeout(() => {
      gameOver(false); // Show the pop-up window
    }, 400);
  }
};


const matchWord = (val) => {
  const matches = [];
  console.log(word);
  word.split("").forEach((el, index) => {
    if (el === val.toLowerCase()) {
      matches.push(index);
    }
  });

  if (matches.length === 0) {
    count++;
    chance.innerText = `${count}/3`;

    if (count >= 3) {
      // Add a delay before showing the pop-up when the user loses
      setTimeout(() => {
        gameOver(true);
      }, 500);
    }
  } else {
    matches.forEach((v) => {
      const letterElem = document.querySelectorAll(".letter");
      letterElem[v].innerText = val;
      letterElem[v].classList.add("guess");
    });
  }
};


const loadQuestion = () => {
 // Increment roundNum here

 let usedIndices = JSON.parse(localStorage.getItem('usedIndices')) || [];
 const storedUsedIndices = localStorage.getItem('usedIndices');
 usedIndices = storedUsedIndices ? JSON.parse(storedUsedIndices) : [];
 
 // Retrieve the updated roundNum from local storage
 roundNum = parseInt(localStorage.getItem('roundNum')) || roundNum;
 checkForRounds(roundNum)

 h4.innerText = `${hint}`;

 for (let i = 0; i < word.length; i++) {
    let liTag = document.createElement("li");
    liTag.classList.add("letter");
    wordDisplay.appendChild(liTag);
 }

 const buttonTag = document.querySelectorAll(".btn");

 buttonTag.forEach((v) => {
  v.addEventListener("click", (e) => {
     const letter = e.target.innerText;
     matchWord(letter);
 
     // Disable the button after it has been clicked
     e.target.disabled = true;
 
     // Use the isLetterMatched function to determine if the letter is matched
     if (isLetterMatched(letter)) {
       e.target.classList.add('matched');
     } else {
       e.target.classList.add('not-matched');
     }
 
     const letterElem = document.querySelectorAll(".letter");
 
     if (count >= 3) {
       setTimeout(() => {
         gameOver(true);
       }, 200);
     }
 
     gameOverwin();
  });
 });


 function isLetterMatched(letter) {
  const matches = [];
  word.split("").forEach((el, index) => {
     if (el === letter.toLowerCase()) {
       matches.push(index);
     }
  });
  return matches.length > 0;
 }




 // Update the question number display
 const questionNumberElement = document.querySelector('.question-number');
 questionNumberElement.innerText = `Question: ${roundNum}/10`;

 // Save the round number to local storage
 localStorage.setItem('roundNum', roundNum.toString());
};
 

loadQuestion();
