
// Word Guesser
console.log("Word Guesser");
// Global arrays
const word = ['M','E','O','W'];
var guess = ['','','',''];
// guess Letter function
function guessLetter(guess_letter){
    var guess_letter = guess_letter;

    for (let i = 0; i < word.length; i++){
        if (guess_letter == word[i]){
            guess[i] == word[i];
            console.log("The current word is: ", guess);
            console.log("Congratulations! You've found a new letter");
        }
        console.log("The guessed letter is not in the word. Try another one.");
        if(guess != word){
            guessLetter();
        }
    }

    if(guess == word){
        console.log("Congratulations! You won the game.");
    }
}