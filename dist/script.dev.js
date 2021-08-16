"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// PIXI
window.onload = function () {
  app = new PIXI.Application({
    width: 1000,
    height: 400,
    transparent: true,
    antialias: true,
    //  backgroundColor: 0x23395D,
    resolution: 1
  });
  document.getElementById('display').appendChild(app.view); // create a new Sprite from an image path.

  var bunny = PIXI.Sprite.from('image/easternDragon.png'); // center the sprite's anchor point

  bunny.anchor.set(0.5); // move the sprite to the center of the screen

  bunny.x = app.screen.width / 2;
  bunny.y = app.screen.height / 2;
  app.stage.addChild(bunny);
  var delta = 0;
  app.ticker.add(function () {
    delta += 0.05;
    bunny.x = 400 + Math.sin(delta) * 40; // just for fun, let's rotate mr rabbit a little
    // bunny.rotation += 0.1;
  });
}; //RUN GAME SCRIPT


var AudioController =
/*#__PURE__*/
function () {
  function AudioController() {
    _classCallCheck(this, AudioController);

    this.bgMusic = new Audio('./audio/Lau Tzu Ehru - Doug Maxwell.mp3');
    this.flipSound = new Audio('/audio/Assets_Audio_flip.wav');
    this.bgMusic.volume = 0.3;
    this.bgMusic.loop = true;
  }

  _createClass(AudioController, [{
    key: "startMusic",
    value: function startMusic() {
      this.bgMusic.play();
    }
  }, {
    key: "flipS",
    value: function flipS() {
      this.flipSound.play();
    }
  }]);

  return AudioController;
}();

var MixOrMatch =
/*#__PURE__*/
function () {
  function MixOrMatch(cards) {
    _classCallCheck(this, MixOrMatch);

    this.cardsSum = document.getElementById('card-total');
    this.cardsArray = cards;
    this.ticker = document.getElementById('flips');
    this.audioController = new AudioController();
  }

  _createClass(MixOrMatch, [{
    key: "startGame",
    value: function startGame() {
      var _this = this;

      this.audioController.startMusic();
      this.totalClicks = 0;
      this.cardToCheck = null;
      this.matchedCards = [];
      this.matchedCardsNumber = [];
      this.busy = true;
      setTimeout(function () {
        _this.shuffleCards(_this.cardsArray);

        _this.busy = false;
      }, 500);
      this.hideCards();
    }
  }, {
    key: "victory",
    value: function victory() {
      this.busy = true;
      this.totalClicks = 0;
      this.ticker.innerText = this.totalClicks;
      document.getElementById('game-over-text').classList.add('visible');
    }
  }, {
    key: "hideCards",
    value: function hideCards() {
      this.cardsArray.forEach(function (card) {
        card.classList.remove('visible');
      });
    }
  }, {
    key: "flipCard",
    value: function flipCard(card) {
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
  }, {
    key: "cardMatch",
    value: function cardMatch(card) {
      this.matchedCards.push(card);
      var sum = this.matchedCardsNumber.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);
      this.cardsSum.innerText = sum;
      if (this.matchedCards.length === (this.length = 4)) this.victory();
    }
  }, {
    key: "shuffleCards",
    value: function shuffleCards(cardsArray) {
      // Fisher-Yates Shuffle Algorithm.
      for (var i = cardsArray.length - 1; i > 0; i--) {
        var randIndex = Math.floor(Math.random() * (i + 1));
        cardsArray[randIndex].style.order = i;
        cardsArray[i].style.order = randIndex;
      }
    }
  }, {
    key: "getCardType",
    value: function getCardType(card) {
      return card.getElementsByClassName('card')[0].src;
    }
  }, {
    key: "canFlipCard",
    value: function canFlipCard(card) {
      return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
  }]);

  return MixOrMatch;
}(); //mainJS


if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

function ready() {
  var overlays = Array.from(document.getElementsByClassName('overlay-text'));
  var cards = Array.from(document.getElementsByClassName('card'));
  var game = new MixOrMatch(cards);
  console.log(cards);
  overlays.forEach(function (overlay) {
    overlay.addEventListener('click', function () {
      overlay.classList.remove('visible');
      game.startGame();
    });
  });
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      game.flipCard(card);
    });
  });
}