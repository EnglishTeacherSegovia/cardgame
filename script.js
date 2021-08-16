// PIXI
window.onload = function() {
    app = new PIXI.Application({
        width: 1000,
        height: 400,

        transparent: true,
        antialias: true,
        //  backgroundColor: 0x23395D,
        resolution: 1

    });
    document.getElementById('display').appendChild(app.view);

    // create a new Sprite from an image path.
    const bunny = PIXI.Sprite.from('image/easternDragon.png');

    // center the sprite's anchor point

    bunny.anchor.set(0.5);
    // move the sprite to the center of the screen
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;


    app.stage.addChild(bunny);
    let delta = 0;
    app.ticker.add(() => {

        delta += 0.05;
        bunny.x = 400 + Math.sin(delta) * 40;

        // just for fun, let's rotate mr rabbit a little
        // bunny.rotation += 0.1;
    });
}



//RUN GAME SCRIPT
class AudioController {
    constructor() {
        this.bgMusic = new Audio('./audio/Lau Tzu Ehru - Doug Maxwell.mp3');
        this.flipSound = new Audio('/audio/Assets_Audio_flip.wav');
        this.bgMusic.volume = 0.3;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    flipS() {
        this.flipSound.play();
    }
}


class MixOrMatch {
    constructor(cards) {
        this.cardsSum = document.getElementById('card-total');
        this.cardsArray = cards;
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();

    }



    startGame() {


        this.audioController.startMusic();
        this.totalClicks = 0;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.matchedCardsNumber = [];
        this.busy = true;
        setTimeout(() => {

            this.shuffleCards(this.cardsArray);

            this.busy = false;
        }, 500)
        this.hideCards();
    }


    victory() {

        this.busy = true;
        this.totalClicks = 0;
        this.ticker.innerText = this.totalClicks;
        document.getElementById('game-over-text').classList.add('visible');
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');

        });
    }

    flipCard(card) {


        if (this.canFlipCard(card)) {
            this.audioController.flipS();
            this.matchedCards;
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');
            this.matchedCardsNumber.push(parseInt(card.dataset.number));

            if (this.cardToCheck) {
                this.cardMatch(card);

            } else {
                this.cardToCheck = card;
            }
        }
    }


    cardMatch(card) {

        this.matchedCards.push(card);
        const sum = this.matchedCardsNumber.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);
        this.cardsSum.innerText = sum;
        if (this.matchedCards.length === (this.length = 4))
            this.victory()
    }


    shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm.
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }

    getCardType(card) {
        return card.getElementsByClassName('card')[0].src;
    }

    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }


}

//mainJS

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);


} else {


    ready();
}



function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(cards);


    console.log(cards);
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');

            game.startGame();
        });
    });

    cards.forEach(card => {

        card.addEventListener('click', () => {

            game.flipCard(card);
        });
    });

}