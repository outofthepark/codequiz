var homePageDiv = document.querySelector('#homePageDiv');
var highScoresLinkDiv = document.querySelector('#highScoresLinkDiv');
var quizDiv = document.querySelector('#quizDiv');
var highScoresDiv = document.querySelector('#highScoresDiv');
var addUserNameDiv = document.querySelector('#addUserNameDiv');
var retakeQuizDiv = document.querySelector('#retakeQuizDiv');
var clearHighScoresDiv = document.querySelector('#clearHighScoresDiv');
var currentScoreDiv = document.querySelector('#currentScoreDiv');
var scoresTableDiv = document.querySelector('#scoresTableDiv');
var quiz = { 'Commonly used data types DO Not Include': ['alerts', 'strings', 'booleans', 'alerts', 'numbers'], 
                'The condition in an if/else statement is enclosed with ________.': ['parenthesis', 'quotes', 'curly brackets', 'square brackets', 'parenthesis']
}
var myTimer;
var numberOfQuestions = Object.keys(quiz).length;
var userScore = 0;
var milliSecondLengthOfQuiz = 60000; //60 seconds

loadHomepage();

document.querySelector("#homePageTitle").addEventListener('click', function(){
    startTimer(false);
    loadHomepage();
});

document.querySelector("#highScoresLink").addEventListener('click', function(){
    clearPage();
    loadHighScores();
});

function loadHomepage() {
    clearPage();
    
    homePageDiv.appendChild(createElement('p', {'id': 'homePageDescription'}, 'Try to answer the following code-related questions with the time limit. Keep in mind that incorrect answerrs will penalize your score/time by ten seconds!'));
    homePageDiv.appendChild(createElement('button', {'id': 'homePageStartButton'}, 'Start Quiz'));

    document.querySelector('#homePageStartButton').addEventListener('click', loadQuiz );
}

function loadQuiz() {
    clearPage();

    quizDiv.append(createElement('div', {'id': 'quizQuestionDiv'}));
    quizDiv.append(createElement('p', {'id': 'timer'}, '60'))
    var questions = shuffleArray(Object.keys(quiz)).slice();
    loadQuizQuestion(questions, 0);
    startTimer();
}

//Questions is an array of key to the quiz object
function loadQuizQuestion(questions, number){
    if(number == numberOfQuestions){
        endQuiz();
    }else{
        var quizQuestionDiv = document.querySelector('#quizQuestionDiv');
        quizQuestionDiv.innerHTML = '';
        var question = questions[number];
        var correctAnswer = quiz[question][0];

        var possibleAnswers = quiz[question].slice();
        possibleAnswers.shift();
        shuffleArray(possibleAnswers);
        quizQuestionDiv.append(createElement('p', {'id': 'questionText'}, question));
        var maxQuestionScore = possibleAnswers.length * 10;
        possibleAnswers.forEach(answer => {

            var answerRadio = createElement('input', {'id': answer, 'class': 'answerRadio', 'type': 'radio', 'name':'answerRadio', 'value': answer})
            var answerLabel = createElement('label', {'for': answer, 'class': 'answerLabel'}, answer);
            quizQuestionDiv.append(answerRadio);
            quizQuestionDiv.append(answerLabel);
            
            answerRadio.addEventListener('click', function(){
                var chosenAnswer = this.value;
                var nextQuestionNumber = number + 1;
                if(chosenAnswer == correctAnswer)
                {
                    userScore = userScore + maxQuestionScore;
                    if( document.querySelector('.feedbackText') ){ document.querySelector('.feedbackText').remove(); }
                    quizQuestionDiv.append(createElement('p', {'class': 'feedbackText'}, 'Correct!'))
                    setTimeout(function(){
                            loadQuizQuestion(questions, nextQuestionNumber)
                    }, 600)
                }
                else
                {
                    maxQuestionScore = maxQuestionScore - 10;
                    document.querySelector('#timer').innerText = parseInt(document.querySelector('#timer').innerText) - 10
                    if( document.querySelector('.feedbackText') ){ document.querySelector('.feedbackText').remove(); }
                    quizQuestionDiv.append(createElement('p', {'class': 'feedbackText'}, 'Not Quite, try again!')); 
                }
                    
            });
        });
    }
}

function endQuiz(){
    clearPage();

    startTimer(false);
    
    highScoresDiv.style.display = '';
    var currentScore = userScore.toString();
    userScore = 0;
    currentScoreDiv.append(createElement('p', {'id': 'saveScoreText'}, 'You scored ' + currentScore + '!'));
    loadHighScores();

    retakeQuizButton = createElement('button', {'id': 'retakeQuizButton'}, 'Retake Quiz');
    retakeQuizDiv.append(retakeQuizButton);
    retakeQuizButton.addEventListener('click', loadQuiz);
    loadGetUserNameDiv(currentScore);
}

function loadHighScores() {
    
    //Prepare to reload high scores by removing previous score rows
    document.querySelectorAll('.scoreRow')?.forEach(e => e.parentNode.removeChild(e));
    document.querySelector('#clearHighScores')?.remove();

    //Check and see if their are scores to display 
    var totalScores = [];
    if(localStorage.length){
        Object.keys(localStorage).forEach((key) => {
            if(key.includes('userName'))
            {
                var scores = localStorage[key];
                var user = key.split(':')[1];

                numericalScoreArray = scores.split(',').map(function(strScore) {
                    return parseInt(strScore, 10);
                });

                numericalScoreSet = [...new Set(numericalScoreArray)];

                numericalScoreSet.forEach((score) => {
                    totalScores.push([score + ',' + user, score]);
                });
            }
        });
    }

    console.log(totalScores);
    if(totalScores.length != 0)
    {
        totalScores.sort(function(a, b) {
            return b[1] - a[1];
        });

        totalScores.forEach((scoreSet) => {
            var user = scoreSet[0].split(',')[1];
            var score = scoreSet[1];
            var scoreRow = createElement('tr', {'class': 'scoreRow'});
            var userNameCell = createElement('td', {'class': 'userNameCell'}, user);
            var scoreCell = createElement('td', {'class': 'userNameCell'}, score);
            scoresTableDiv.style.display = '';
            scoreRow.append(userNameCell);
            scoreRow.append(scoreCell);
            document.querySelector('#scoresTable').append(scoreRow);
        });
    
        //Button to clear recorded scores
        var clearHighScoresButton = createElement('button', {'id': 'clearHighScores'}, 'Clear High Scores')
        clearHighScoresDiv.append(clearHighScoresButton);
        
        //Event handler for button
        clearHighScoresButton.addEventListener('click', function(){
            localStorage.clear();
            document.querySelector('.scoreRow').remove();
            scoresTableDiv.style.display = 'none';
            $this.remove();
            loadHighScores();
        });
    }
    else{
        currentScoreDiv.append(createElement('p', {'id': 'noScoreText'}, 'No high scores to show!'));
    }
}

function loadGetUserNameDiv(thisUserScore) {
    addUserNameDiv.append(createElement('p', {'id': 'saveScoreText'}, 'Save your score by entering your initials!'));
    addUserNameDiv.append(createElement('input', {'id': 'userNameInput', 'type': 'text'}));
    addUserNameDiv.append(createElement('button', {'id': 'userNameSubmit', 'type':'submit'}, 'Save Score'));

    document.querySelector('#userNameSubmit').addEventListener('click', function(){
        if(document.querySelector('#userNameInput').value != ''){
            var userName = document.querySelector('#userNameInput').value;            
            
            //check to see if this username already exists in local storage
            if(localStorage.length){
                var added = false;
                Object.keys(localStorage).forEach((key) => {
                    if(key.includes('userName:' + userName))
                    {
                        otherScores = localStorage[key];
                        newScores = otherScores+','+thisUserScore;
                        localStorage[key] = newScores;
                        added = true;
                    }
                });
                if(added == false){ localStorage['userName:' + userName] = thisUserScore; }
            }else{
                localStorage['userName:' + userName] = thisUserScore;
            }
            addUserNameDiv.innerHTML = '';
            currentScoreDiv.innerHTML = '';
            loadHighScores();
        }else{
            alert('Please enter a username to save your score!')
        }
    });
}

function startTimer(start = true){
    if(start){
        myTimer = setInterval(function(){
            lastSecond = parseInt(document.querySelector('#timer').innerText);
            if(lastSecond < 0){ endQuiz(); }else{ document.querySelector('#timer').innerText = lastSecond - 1; }
        }, 1000)
    }else{
        clearInterval(myTimer);
    }
}

//Can't figure out how to do this with plain javascript in one line
function createElement(HTMLType, attributes, text = null){
    var newElement = document.createElement(HTMLType);
    Object.keys(attributes).forEach( attribute => {
        newElement.setAttribute(attribute, attributes[attribute]);
    });
    if(text){ newElement.innerText = text; }

    return newElement;
}

function clearPage() {
    homePageDiv.innerHTML = '';
    quizDiv.innerHTML = '';
    scoresTableDiv.style.display = 'none';
    addUserNameDiv.innerHTML = '';
    retakeQuizDiv.innerHTML = '';
    clearHighScoresDiv.innerHTML = '';
    currentScoreDiv.innerHTML = '';
}

function shuffleArray(array) {
    var shuffledArray = array;
    for (var i = shuffledArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffledArray[i];
        shuffledArray[i] = shuffledArray[j];
        shuffledArray[j] = temp;
    }
    return shuffledArray;
}