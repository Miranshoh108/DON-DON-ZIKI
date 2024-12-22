const selectionButtons = document.querySelectorAll("[data-selection]");
const finalColumn = document.querySelector("[data-final-column]");
const computerScoreSpan = document.querySelector("[data-computer-score]");
const yourScoreSpan = document.querySelector("[data-your-score]");
const winnerMessage = document.querySelector(".winner-message");
const winnerText = document.getElementById("winner");
const restartButton = document.getElementById("restart");

const SELECTIONS = [
  {
    name: "rock",
    emoji: "\u270A",
    beats: "scissors",
  },
  {
    name: "paper",
    emoji: "\u270B",
    beats: "rock",
  },
  {
    name: "scissors",
    emoji: "\u270C",
    beats: "paper",
  },
];

// Load scores from localStorage
function loadScores() {
  const savedYourScore = localStorage.getItem("yourScore") || 0;
  const savedComputerScore = localStorage.getItem("computerScore") || 0;
  yourScoreSpan.innerText = savedYourScore;
  computerScoreSpan.innerText = savedComputerScore;
}

function saveScores() {
  localStorage.setItem("yourScore", yourScoreSpan.innerText);
  localStorage.setItem("computerScore", computerScoreSpan.innerText);
}

function resetScores() {
  localStorage.removeItem("yourScore");
  localStorage.removeItem("computerScore");
  yourScoreSpan.innerText = 0;
  computerScoreSpan.innerText = 0;
}

selectionButtons.forEach((selectionButton) => {
  selectionButton.addEventListener("click", (e) => {
    const selectionName = selectionButton.dataset.selection;
    const selection = SELECTIONS.find(
      (selection) => selection.name === selectionName
    );
    makeSelection(selection);
  });
});

function makeSelection(selection) {
  const computerSelection = randomSelection();
  const yourWinner = isWinner(selection, computerSelection);
  const computerWinner = isWinner(computerSelection, selection);

  addSelectionResult(computerSelection, computerWinner);
  addSelectionResult(selection, yourWinner);

  if (yourWinner) incrementScore(yourScoreSpan);
  if (computerWinner) incrementScore(computerScoreSpan);

  saveScores();
  checkWinner();
}

function incrementScore(scoreSpan) {
  scoreSpan.innerText = parseInt(scoreSpan.innerText) + 1;
}

function addSelectionResult(selection, winner) {
  const div = document.createElement("div");
  div.innerText = selection.emoji;
  div.classList.add("result-selection");
  if (winner) div.classList.add("winner");
  finalColumn.after(div);
}

function isWinner(selection, opponentSelection) {
  return selection.beats === opponentSelection.name;
}

function randomSelection() {
  const randomIndex = Math.floor(Math.random() * SELECTIONS.length);
  return SELECTIONS[randomIndex];
}

function checkWinner() {
  const yourScore = parseInt(yourScoreSpan.innerText);
  const computerScore = parseInt(computerScoreSpan.innerText);

  if (yourScore === 3) {
    declareWinner("You Win!");
  } else if (computerScore === 3) {
    declareWinner("Computer Wins!");
  }
}

function declareWinner(message) {
  winnerText.innerText = message;
  winnerMessage.style.display = "block";
  selectionButtons.forEach((button) => (button.disabled = true));
}

restartButton.addEventListener("click", () => {
  resetScores();
  winnerMessage.style.display = "none";
  selectionButtons.forEach((button) => (button.disabled = false));
  document.querySelectorAll(".result-selection").forEach((element) => {
    element.remove();
  });
});

// Initialize the game
loadScores();
