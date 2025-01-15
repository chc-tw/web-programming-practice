////////////////////////////////////////////////////////////////
// I will print the answer in the console for testing purpose //
////////////////////////////////////////////////////////////////
let currentRow = 0;
let currentColumn = 0;
let gameOver = false;
let word = ""; // To store the word entered by the user
const str = "ABOUT ALERT ARGUE BEACH ABOVE ALIKE ARISE BEGAN ABUSE ALIVE ARRAY BEGIN ACTOR ALLOW ASIDE BEGUN ACUTE ALONE ASSET BEING ADMIT ALONG AUDIO BELOW ADOPT ALTER AUDIT BENCH ADULT AMONG AVOID BILLY AFTER ANGER AWARD BIRTH AGAIN ANGLE AWARE BLACK AGENT ANGRY BADLY BLAME AGREE APART BAKER BLIND AHEAD APPLE BASES BLOCK ALARM APPLY BASIC BLOOD ALBUM ARENA BASIS BOARD BOOST BUYER CHINA COVER BOOTH CABLE CHOSE CRAFT BOUND CALIF CIVIL CRASH BRAIN CARRY CLAIM CREAM BRAND CATCH CLASS CRIME BREAD CAUSE CLEAN CROSS BREAK CHAIN CLEAR CROWD BREED CHAIR CLICK CROWN BRIEF CHART CLOCK CURVE BRING CHASE CLOSE CYCLE BROAD CHEAP COACH DAILY BROKE CHECK COAST DANCE BROWN CHEST COULD DATED BUILD CHIEF COUNT DEALT BUILT CHILD COURT DEATH DEBUT ENTRY FORTH GROUP DELAY EQUAL FORTY GROWN DEPTH ERROR FORUM GUARD DOING EVENT FOUND GUESS DOUBT EVERY FRAME GUEST DOZEN EXACT FRANK GUIDE DRAFT EXIST FRAUD HAPPY DRAMA EXTRA FRESH HARRY DRAWN FAITH FRONT HEART DREAM FALSE FRUIT HEAVY DRESS FAULT FULLY HENCE DRILL FIBER FUNNY NIGHT DRINK FIELD GIANT HORSE DRIVE FIFTH GIVEN HOTEL DROVE FIFTY GLASS HOUSE DYING FIGHT GLOBE HUMAN EAGER FINAL GOING IDEAL EARLY FIRST GRACE IMAGE EARTH FIXED GRADE INDEX EIGHT FLASH GRAND INNER ELITE FLEET GRANT INPUT EMPTY FLOOR GRASS ISSUE ENEMY FLUID GREAT IRONY ENJOY FOCUS GREEN JUICE ENTER FORCE GROSS JOINT JUDGE METAL MEDIA NEWLY KNOWN LOCAL MIGHT NOISE LABEL LOGIC MINOR NORTH LARGE LOOSE MINUS NOTED LASER LOWER MIXED NOVEL LATER LUCKY MODEL NURSE LAUGH LUNCH MONEY OCCUR LAYER LYING MONTH OCEAN LEARN MAGIC MORAL OFFER LEASE MAJOR MOTOR OFTEN LEAST MAKER MOUNT ORDER LEAVE MARCH MOUSE OTHER LEGAL MUSIC MOUTH OUGHT LEVEL MATCH MOVIE PAINT LIGHT MAYOR NEEDS PAPER LIMIT MEANT NEVER PARTY PEACE POWER RADIO ROUND PANEL PRESS RAISE ROUTE PHASE PRICE RANGE ROYAL PHONE PRIDE RAPID RURAL PHOTO PRIME RATIO SCALE PIECE PRINT REACH SCENE PILOT PRIOR READY SCOPE PITCH PRIZE REFER SCORE PLACE PROOF RIGHT SENSE PLAIN PROUD RIVAL SERVE PLANE PROVE RIVER SEVEN PLANT QUEEN QUICK SHALL PLATE SIXTH STAND SHAPE POINT QUIET ROMAN SHARE POUND QUITE ROUGH SHARP SHEET SPARE STYLE TIMES SHELF SPEAK SUGAR TIRED SHELL SPEED SUITE TITLE SHIFT SPEND SUPER TODAY SHIRT SPENT SWEET TOPIC SHOCK SPLIT TABLE TOTAL SHOOT SPOKE TAKEN TOUCH SHORT SPORT TASTE TOUGH SHOWN STAFF TAXES TOWER SIGHT STAGE TEACH TRACK SINCE STAKE TEETH TRADE SIXTY START TEXAS TREAT SIZED STATE THANK TREND SKILL STEAM THEFT TRIAL SLEEP STEEL THEIR TRIED SLIDE STICK THEME TRIES SMALL STILL THERE TRUCK SMART STOCK THESE TRULY SMILE STONE THICK TRUST SMITH STOOD THING TRUTH SMOKE STORE THINK TWICE SOLID STORM THIRD UNDER SOLVE STORY THOSE UNDUE SORRY STRIP THREE UNION SOUND STUCK THREW UNITY SOUTH STUDY THROW UNTIL SPACE STUFF TIGHT UPPER UPSET WHOLE WASTE WOUND URBAN WHOSE WATCH WRITE USAGE WOMAN WATER WRONG USUAL TRAIN WHEEL WROTE VALID WORLD WHERE YIELD VALUE WORRY WHICH YOUNG VIDEO WORSE WHILE YOUTH VIRUS WORST WHITE WORTH VISIT WOULD VITAL VOICE";
const vocabulary = str.split(" ");
let randomIndex = Math.floor(Math.random() * Date.now() * vocabulary.length) % vocabulary.length;
let correctWord = vocabulary[randomIndex];
console.log("Answer:");
console.log(correctWord);

window.onload = function() {
    // Create the board
    currentRow = 0;
    currentColumn = 0;
    gameOver = false;
    const board = document.getElementById('board');
    for (let i = 0; i < 6; i++) {
        let row = board.insertRow(i);
        for (let j = 0; j < 5; j++) {
            let cell = row.insertCell(j);
            cell.innerHTML = "&nbsp;";
        }
    }

    // Assign event handlers to the keyboard buttons
    const keys = document.getElementsByClassName('key');
    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = function() {
            handleKeyClick(this.id);
        };
    }

    // Reset the game when the 'Restart' button is clicked
    document.getElementById('restart').addEventListener('click', function() {
        // Enable all the keyboard buttons
        // const keys = document.getElementsByClassName('key');
        for (let i = 0; i < keys.length; i++) {
            keys[i].style.backgroundColor = '#4CAF50';
        }

        // Hide the 'Restart' button
        document.getElementById('restart').style.display = 'None';

        // Reset the game board and currentRow
        for (let row of board.rows) {
            for (let cell of row.cells) {
                cell.innerText = '';
                cell.className = '';
            }
        }
        currentRow = 0;
        currentColumn = 0;
        word = "";
        gameOver = false;
        randomIndex = Math.floor(Math.random() * Date.now() * vocabulary.length) % vocabulary.length;
        correctWord = vocabulary[randomIndex];
        console.log("Answer:");
        console.log(correctWord);

    });


    // Event listener for keydown event
    window.addEventListener('keydown', function(e) {
        const keyName = e.key.toUpperCase();
        const validKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (validKeys.includes(keyName)) {
            handleKeyClick('key' + keyName);
        } else if (e.key === 'Enter') {
            handleKeyClick('keyEnter');
        } else if (e.key === 'Backspace') {
            handleKeyClick('keyBackspace');
        }
    });
};

function handleKeyClick(keyId) {
    if (gameOver) return;
    if (keyId.startsWith('key')) {
        const board = document.getElementById('board');
        const currentCell = board.rows[currentRow].cells[currentColumn];
        const key = keyId.charAt(3); // Get the key pressed

        if (keyId === 'keyEnter') {
            // Submit the word
            if (currentColumn === 5) {
                // Check if the word is in the vocabulary
                if (!vocabulary.includes(word)) {
                    displayWarning("The word is not in the vocabulary!");
                    return; // Don't advance to the next row
                }
                
                // Provide color clues for the guessed word
                for (let i = 0; i < 5; i++) {
                    let cell = board.rows[currentRow].cells[i];
                    // Add flip animation with delay
                    ((i, word) => {
                        setTimeout(function() {
                            if (word[i] === correctWord[i]) {
                                // Green for correct letter in correct position
                                cell.classList.add('green');
                            } else if (correctWord.includes(word[i])) {
                                // Yellow for correct letter in wrong position
                                cell.classList.add('yellow');
                            } else {
                                cell.classList.add('gray');
                                document.getElementById(`key${word[i]}`).style.backgroundColor = 'gray';
                            }
                            cell.classList.add('flip');
                        }, i * 750);  // Delay increases by 750ms for each cell
                    })(i, word);
                }
                
                if (word === correctWord){
                    gameOver = true;
                    // Check if the word is the correct answer
                    ((word, correctWord) => {
                        setTimeout(function() { 
                            displayWarning("Congratulations! You've found the correct word!");
                            // Show the 'Restart' button
                            document.getElementById('restart').style.display = 'flex';
                        },4000); // Delay for 4.75s
                    })(word, correctWord)
                } else if(currentRow === 5){
                    gameOver = true;
                    ((word, correctWord) => {
                        setTimeout(function() {
                            displayWarning("Game Over! You've reached the end of the board!");
                            // Show the 'Restart' button
                            document.getElementById('restart').style.display = 'flex';
                        },4000); // Delay for 4.75s
                    })(word, correctWord)
                }
                else{
                currentRow++;
                currentColumn = 0;
                word = ""; // Reset the word
                }
                
            } else {
                displayWarning('Please enter a 5-letter word');
            }
        } else if (keyId === 'keyBackspace') {
            // Remove the last letter
            if (currentColumn > 0) {
                currentColumn--;
                word = word.slice(0, -1); // Remove the last character from the word
                board.rows[currentRow].cells[currentColumn].innerHTML = "&nbsp;";
            }
        } else {
            // Add the letter to the current word
            if (currentColumn < 5) {
                currentCell.innerHTML = key;
                currentColumn++;
                word += key; // Add the key to the word
            }
        }
    }
}

function displayWarning(message) {
    alert(message);
}
