const words = ["NIGHT", "CAGE", "HUB"];
let word = words[Math.floor(Math.random() * words.length)];
let answer = "_".repeat(word.length).split("");
let attempts = 6;
document.getElementById("game").innerHTML = `
  <p>Guess: ${answer.join(" ")}</p>
  <p>Attempts left: ${attempts}</p>
  <input id="guess" maxlength="1"><button onclick="checkGuess()">Guess</button>
`;
function checkGuess() {
  let letter = document.getElementById("guess").value.toUpperCase();
  if (word.includes(letter)) {
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) answer[i] = letter;
    }
  } else {
    attempts--;
  }
  document.getElementById("game").innerHTML = `
    <p>Guess: ${answer.join(" ")}</p>
    <p>Attempts left: ${attempts}</p>
    <input id="guess" maxlength="1"><button onclick="checkGuess()">Guess</button>
  `;
  if (answer.join("") === word) {
    window.location.href = "teaser.html";
  }
}
