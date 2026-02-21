<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Japanese Culture Quiz</title>
    <style>
        /* --- CSS Section --- */
        :root {
            --primary-red: #BC002D;
            --soft-grey: #F0F2F5;
            --text-dark: #333333;
            --white: #ffffff;
            --correct-green: #4CAF50;
            --wrong-red: #e74c3c;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        body { background-color: var(--soft-grey); display: flex; justify-content: center; align-items: center; min-height: 100vh; color: var(--text-dark); }
        .app-container { width: 90%; max-width: 600px; text-align: center; }
        header h1 { color: var(--primary-red); margin-bottom: 10px; font-size: 2.5rem; letter-spacing: 2px; }
        header p { margin-bottom: 20px; color: #666; }
        .quiz-card, .result-card { background: var(--white); border-radius: 15px; padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-top: 5px solid var(--primary-red); }
        .quiz-info { margin-bottom: 15px; font-weight: bold; color: #888; font-size: 0.9rem; }
        #question-container { font-size: 1.3rem; margin-bottom: 25px; font-weight: 600; min-height: 60px; }
        .btn-grid { display: grid; gap: 10px; margin-bottom: 20px; }
        .btn { background-color: var(--white); border: 2px solid var(--soft-grey); border-radius: 8px; padding: 15px; font-size: 1rem; color: var(--text-dark); cursor: pointer; transition: all 0.2s ease; }
        .btn:hover:not([disabled]) { border-color: var(--primary-red); color: var(--primary-red); background-color: #fff5f5; }
        .btn.correct { background-color: var(--correct-green); color: white; border-color: var(--correct-green); }
        .btn.wrong { background-color: var(--wrong-red); color: white; border-color: var(--wrong-red); }
        .next-btn, .restart-btn { background-color: var(--primary-red); color: var(--white); border: none; padding: 12px 30px; font-size: 1.1rem; border-radius: 50px; cursor: pointer; transition: background 0.3s; width: 100%; }
        .hide { display: none; }
    </style>
</head>
<body>

    <div class="app-container">
        <header>
            <h1>Nihon Culture Quiz</h1>
            <p>Test your knowledge of Japan!</p>
        </header>

        <main>
            <div class="quiz-card" id="quiz-box">
                <div class="quiz-info">
                    <span id="question-number">1</span> / <span id="total-questions">5</span>
                </div>
                <div id="question-container">Loading Question...</div>
                <div id="answer-buttons" class="btn-grid"></div>
                <button id="next-btn" class="next-btn hide">Next Question &rarr;</button>
            </div>

            <div id="result-container" class="result-card hide">
                <h2>Quiz Completed!</h2>
                <p>You scored <span id="score">0</span> out of <span id="total-score">5</span></p>
                <p id="feedback-message"></p>
                <button id="restart-btn" class="restart-btn">Play Again</button>
            </div>
        </main>
    </div>

    <script>
        /* --- JavaScript Section --- */
        const questions = [
            { question: "What is the capital city of Japan?", answers: [{ text: "Osaka", correct: false }, { text: "Tokyo", correct: true }, { text: "Kyoto", correct: false }, { text: "Hiroshima", correct: false }] },
            { question: "Which symbol represents Japan on the national flag?", answers: [{ text: "A White Chrysanthemum", correct: false }, { text: "A Red Circle (The Sun)", correct: true }, { text: "A Red Torii Gate", correct: false }, { text: "A Cherry Blossom", correct: false }] },
            { question: "What is the currency used in Japan?", answers: [{ text: "Yuan", correct: false }, { text: "Won", correct: false }, { text: "Yen", correct: true }, { text: "Dollar", correct: false }] },
            { question: "Mount Fuji is the highest mountain in Japan.", answers: [{ text: "True", correct: true }, { text: "False", correct: false }] },
            { question: "Which writing system uses characters derived from Chinese characters?", answers: [{ text: "Hiragana", correct: false }, { text: "Katakana", correct: false }, { text: "Kanji", correct: true }, { text: "Romaji", correct: false }] }
        ];

        const questionElement = document.getElementById("question-container");
        const answerButtonsElement = document.getElementById("answer-buttons");
        const nextButton = document.getElementById("next-btn");
        const quizCard = document.getElementById("quiz-box");
        const resultContainer = document.getElementById("result-container");
        const scoreElement = document.getElementById("score");
        const totalScoreElement = document.getElementById("total-score");
        const questionNumberElement = document.getElementById("question-number");
        const totalQuestionsElement = document.getElementById("total-questions");
        const restartButton = document.getElementById("restart-btn");

        let currentQuestionIndex = 0;
        let score = 0;

        function startQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            nextButton.innerHTML = "Next Question";
            quizCard.classList.remove("hide");
            resultContainer.classList.add("hide");
            totalQuestionsElement.innerHTML = questions.length;
            showQuestion();
        }

        function showQuestion() {
            resetState();
            let currentQuestion = questions[currentQuestionIndex];
            questionNumberElement.innerHTML = currentQuestionIndex + 1;
            questionElement.innerHTML = currentQuestion.question;
            currentQuestion.answers.forEach(answer => {
                const button = document.createElement("button");
                button.innerHTML = answer.text;
                button.classList.add("btn");
                if (answer.correct) button.dataset.correct = answer.correct;
                button.addEventListener("click", selectAnswer);
                answerButtonsElement.appendChild(button);
            });
        }

        function resetState() {
            nextButton.classList.add("hide");
            while (answerButtonsElement.firstChild) answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }

        function selectAnswer(e) {
            const selectedBtn = e.target;
            const isCorrect = selectedBtn.dataset.correct === "true";
            if (isCorrect) { selectedBtn.classList.add("correct"); score++; } else { selectedBtn.classList.add("wrong"); }
            Array.from(answerButtonsElement.children).forEach(button => {
                if (button.dataset.correct === "true") button.classList.add("correct");
                button.disabled = true;
            });
            nextButton.classList.remove("hide");
        }

        function handleNextButton() {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) showQuestion(); else showScore();
        }

        function showScore() {
            quizCard.classList.add("hide");
            resultContainer.classList.remove("hide");
            scoreElement.innerHTML = score;
            totalScoreElement.innerHTML = questions.length;
            const feedback = document.getElementById("feedback-message");
            if(score === 5) feedback.innerHTML = "完美! (Perfect!) You are a Japan Expert!";
            else if(score >= 3) feedback.innerHTML = "よくできました! (Good job!) Keep learning!";
            else feedback.innerHTML = "頑張って! (Try harder!) Learn more about Japan!";
        }

        nextButton.addEventListener("click", () => {
            if (currentQuestionIndex < questions.length) handleNextButton(); else startQuiz();
        });

        restartButton.addEventListener("click", startQuiz);
        startQuiz();
    </script>
</body>
</html>
