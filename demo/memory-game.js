"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

let firstPick = null;
let guessCount = 0;
let matches = 0;
const scoreToWin = COLORS.length/2;

const colors = shuffle(COLORS);

createCards(colors);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");
  let i = 0;
  let cardHTML = '';
  for (let color of colors) {
    cardHTML += `
    <div class=${color + i} id="down"><h1>\{R\}</h1></div>`;
    i++;
  }
  gameBoard.innerHTML = cardHTML;
}

function displayScore() {
  let scoreBoard = document.getElementById("stats");
  let loScore = localStorage.getItem("bestScore");
  let bestScore = loScore !== null ? loScore : "no wins";

  scoreBoard.innerHTML = `
  Current Score: <span class="score">${guessCount}</span>
  All Time Low: <span class="score">${bestScore}</span>`;
}

/** Flip a card face-up. */

function flipCard(card) {
  card.id = card.className;
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.id = "down";
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {

  const card = evt.target;
  const color = card.className.slice(0, card.className.length - 1);


  if (COLORS.includes(color)) {

    //First Guess
    if (firstPick === null) {
      flipCard(card);
      firstPick = card;

      //Second guess is correct
    } else if (hammingDistanceOne(firstPick.className, card.className)) {

      flipCard(card);
      firstPick = null;
      matches++;
      guessCount++;

      if (matches >= scoreToWin) {

        setTimeout(win, 1500);
      }

      //Second guess is not correct
    } else if (firstPick.className !== color) {
      flipCard(card);
      setTimeout(unFlipCard, 1000, card);
      setTimeout(unFlipCard, 1020, firstPick);
      firstPick = null;
      guessCount++;

    } else {
      setTimeout(unFlipCard, 1000, firstPick);
    }

  }
  displayScore();
}

function hammingDistanceOne(string1, string2) {
  if (string1.length !== string2.length) return false;
  let count = 0;
  const word1 = string1.toLowerCase();
  const word2 = string2.toLowerCase();

  for (let i = 0; i < string1.length; i++) {
    if (word1[i] !== word2[i]) {
      count++;
    }
  }
  return count === 1;
}

function handleStartClick(evt) {
  const scoreboard = document.getElementById("scoreboard");

  scoreboard.classList.add("move");
  scoreboard.innerHTML = `
  <div class="landing-page" id="game-board">
    <h2>Generic Memory Game!</h2>
    <p id="stats"></p>
    </div>`;
    displayScore();
}

function win() {
  const winBanner = document.getElementById("winBanner");
  const winMessage = winMsg(guessCount);
  const scoreMessage = checkBestScore(guessCount);

  console.log();

  winBanner.innerHTML = `
  ${winMessage}
  <p>${scoreMessage}</P>
  <button id="play-again" onClick="window.location.reload()"git>Play Again</button>
  `

  winBanner.classList.add("show");
}

function winMsg(score) {
  if (score <= 6) {
    return "<h1>PERFECT!</h1>";
  } else if (score <= 10) {
    return "<h1>YOU WIN!</h1>";
  } else if (score <= 15) {
    return "<h1>You win, I guess.</h1>"
  } else if (score > 15) {
    return "<h3>That was pretty good, for a goldfish.</h3>"
  }
}

function checkBestScore(score) {
  let currentBestScore = localStorage.getItem("bestScore");

  if (currentBestScore === null) {
    localStorage.setItem("bestScore", score);
    return `your new all time low is ${score}!`;

  } else if (currentBestScore > score) {
    localStorage.setItem("bestScore", score);
    return `your new all time low is ${score}!`;

  } else if (currentBestScore < score) {
    return `but you fail to beat your all time low of ${currentBestScore}`;

  } else {
    return "you've tied your all time low!";
  }

}

function handlePlayAgainClick() {
  window.location.reload();
  return false
}

document.getElementById("start-btn").addEventListener("click", handleStartClick);
document.getElementById("game").addEventListener("click", handleCardClick);
document.getElementById("play-again").addEventListener("click", handlePlayAgainClick);