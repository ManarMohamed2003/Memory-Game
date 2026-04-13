"use strict";
const soundEffects = {
    backgroundMusic: new Audio("./assets/audio/fulltrack.mp3"),
    flippingSoundEffect: new Audio("./assets/audio/flip.mp3"),
    successSoundEffect: new Audio("./assets/audio/good.mp3"),
    failSoundEffect: new Audio("./assets/audio/fail.mp3"),
    gameEndedSoundEffect: new Audio("./assets/audio/game-over.mp3")
};
soundEffects.backgroundMusic.loop = true;
let game = {
    gameCards: [],
    numOfCards: 20,
    finishedCards: 0,
    cardsHTML: ''
};
function checkCardClickability(index) {
    soundEffects.backgroundMusic.play();
    let selectedCard = game.gameCards[index];
    if (game.firstCard === undefined || game.secondCard === undefined) {
        addFlipClass(selectedCard, index);
        clickedCard(selectedCard, index);
    }
}
function addFlipClass(card, index) {
    soundEffects.flippingSoundEffect.play();
    let flippedCard = document.getElementById(`cardFlip-${index}`);
    if (card && flippedCard) {
        if (card.flip === '') {
            card.flip = 'flip';
        }
        else {
            card.flip = '';
        }
        flippedCard.classList.toggle('flip');
    }
}
function resetCards() {
    game.firstCard = undefined;
    game.firstCardIndex = undefined;
    game.secondCard = undefined;
    game.secondCardIndex = undefined;
}
function checkMatch() {
    var _a, _b;
    stopAudio(soundEffects.failSoundEffect);
    stopAudio(soundEffects.successSoundEffect);
    if (((_a = game.firstCard) === null || _a === void 0 ? void 0 : _a.source) === ((_b = game.secondCard) === null || _b === void 0 ? void 0 : _b.source)) {
        soundEffects.successSoundEffect.play();
        game.finishedCards += 2;
        game.firstCard.clickable = false;
        game.secondCard.clickable = false;
        updateProgressBarWidth();
        gameOverCheck();
        resetCards();
    }
    else {
        setTimeout(() => {
            soundEffects.failSoundEffect.play();
            const firstCard = game.firstCard;
            const firstCardIndex = game.firstCardIndex;
            const secondCard = game.secondCard;
            const secondCardIndex = game.secondCardIndex;
            resetCards();
            if (firstCard !== undefined && firstCardIndex !== undefined) {
                addFlipClass(firstCard, firstCardIndex);
            }
            if (secondCard !== undefined && secondCardIndex !== undefined) {
                addFlipClass(secondCard, secondCardIndex);
            }
        }, 1000);
    }
}
function clickedCard(card, index) {
    if (game.firstCardIndex === undefined) {
        game.firstCard = card;
        game.firstCardIndex = index;
    }
    else if (game.secondCardIndex === undefined) {
        game.secondCard = card;
        game.secondCardIndex = index;
        checkMatch();
    }
}
function updateProgressBarWidth() {
    let progressElement = document.getElementById('progressing');
    let progressWidth = (game.finishedCards / game.numOfCards) * 100;
    if (progressElement) {
        progressElement.style.width = `${progressWidth}%`;
    }
}
function gameOverCheck() {
    if (game.finishedCards === game.numOfCards) {
        stopAudio(soundEffects.backgroundMusic);
        stopAudio(soundEffects.failSoundEffect);
        stopAudio(soundEffects.successSoundEffect);
        soundEffects.gameEndedSoundEffect.play();
    }
}
function stopAudio(audio) {
    if (audio && audio.played) {
        audio.pause();
        audio.currentTime = 0;
    }
}
for (let i = 0; i < game.numOfCards / 2; i++) {
    game.gameCards.push({
        source: `./assets/images/${i}.jpg`,
        flip: '',
        clickable: true,
        index: i
    }, {
        source: `./assets/images/${i}.jpg`,
        flip: '',
        clickable: true,
        index: i
    });
}
for (let i = game.gameCards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [game.gameCards[i], game.gameCards[j]] = [game.gameCards[j], game.gameCards[i]];
}
function addCardToHTML() {
    game.gameCards.forEach((item, i) => {
        game.cardsHTML += `
    <span class="col-sm-3 col-lg-2">
        <div onclick="checkCardClickability(${i})" class="cardFlip">
            <div id="cardFlip-${i}">
                <div class="front">
                    <div class="card">
                        <img src="./assets/back.jpg" alt="" class="cardImage"> 
                    </div>
                </div>
                <div class="back">
                    <div class="card">
                        <img src="./assets/images/${item.index}.jpg" alt="" id="frontCard"> 
                    </div>
                </div>
            </div>
        </div>
    </span>
    `;
    });
    return game.cardsHTML;
}
let cards = document.getElementById('memoryCards');
if (cards) {
    cards.innerHTML = addCardToHTML();
}
