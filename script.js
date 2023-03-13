let numbPlayers = 4;
let numbTotalCards = 12;
let numbCardInit = 3; 
const mainPlayBtn = document.querySelector('#main-play-btn');
const secSelecCards = document.querySelector('.selected-cards');
const decks = [];
const deckCenter = document.querySelector('#center-deck');
const infoPlayers = [];
const cardsSelec = [];
const atribButtons1 = document.querySelector('#player-1').getElementsByClassName('button-card');
const atribPlayers = [];
const textResult = document.querySelector('#text-result');
const btnSelecCards = document.querySelector('#btn-selected-cards');
let maxCount = 0;
let idWinners = [];


countPlayers(numbPlayers);

function countPlayers(nPlayers) {
    for(let i = 1; i < nPlayers + 1; i++){
        decks.push(document.querySelector(`#deck-${i}`));
        infoPlayers.push(document.querySelector(`#info-pl-${i}`));
        infoPlayers[i-1].querySelector('.info-name').textContent = `Player ${i}`;
        cardsSelec.push(document.querySelector(`#player-${i}`));
        atribPlayers.push(document.querySelector(`#player-${i}`).querySelector('.atributes-card'));
    }
    addCard();
    infoCards();
};

function addCard() {
    let indexDeck = 0;
    let indexCard = 0; 

    for(let i = 1; i < numbTotalCards + 1; i++) {
        indexCard += 1;
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('id', `deck-${indexDeck+1}-card-${indexCard}`);
        
        decks[indexDeck].appendChild(card);
        if(i === (indexDeck+1)*numbCardInit) {
            indexDeck++;
            indexCard = 0;
        }
    }
};

function infoCards() {
    for(let i = 0; i < decks.length; i++) {
        if(decks[i] != undefined) {
            infoPlayers[i].querySelector('.info-cards').textContent = `${decks[i].childElementCount} cartas`;
            if(decks[i].childElementCount === 0) {
                closeSelecCards();
                numbPlayers -= 1;
                delete decks[i];
                delete cardsSelec[i];
                delete atribPlayers[i];
            }      
        }
    }
};

mainPlayBtn.addEventListener('click', openSelecCards);

btnSelecCards.addEventListener('click', closeSelecCards);

function openSelecCards() {
    secSelecCards.style.display = 'block';
};

function closeSelecCards() {
    secSelecCards.style.display = 'none';  
    showAdvCards("off");
    disableBtn(atribButtons1.length);
};

for(let i = 0; i < atribButtons1.length; i++) {
    atribButtons1[i].addEventListener('click', () => {
        showAdvCards("on");
        disableBtn(i);
        takeCards();
        compareValues(i);
    });
    
};

function showAdvCards(turn) {
    if(turn === "on") {
        for(cs of cardsSelec) {
            if(cs != undefined) {
                if(maxCount > 1) {
                    idWinners.forEach((ids) => {
                        if(cardsSelec.indexOf(cs) === ids-1) {
                            cs.style.display = 'flex';
                        }
                    });
                } else {
                    cs.style.display = 'flex';
                }
            }
        }
        btnSelecCards.style.display = 'flex';
    } else {
        for(cs of cardsSelec) {
            if(cs != undefined && cs != cardsSelec[0]) {
                cs.style.display = 'none';
            }
        }
        btnSelecCards.style.display = 'none';
        textResult.style.display = 'none';
    }
};

function disableBtn(id) {
    const allAtribBtns = document.getElementsByClassName('button-card');
    
    if(id < atribButtons1.length) {
        for(ap of atribPlayers) {
            if(ap != undefined) {
                ap.children[id].classList.add('chosen');
            }
        }
        for(let i = 0; i < allAtribBtns.length; i++) {
            allAtribBtns[i].disabled = true;
        }
    } else {
        for(let i = 0; i < allAtribBtns.length; i++) {
            allAtribBtns[i].classList.remove('chosen');
            allAtribBtns[i].disabled = false;
        }
    }
};

function takeCards() {
    for(d of decks) {
        if(d != undefined) {
            if(maxCount > 1) {
                idWinners.forEach((ids) => {
                    if(decks.indexOf(d) === ids-1) {
                        d.removeChild(d.lastChild);
                    }
                });
            } else {
                d.removeChild(d.lastChild);
            }
        }
    }
};

function compareValues(id) {
    let values = [];
    for(ap of atribPlayers) {
        if(ap != undefined) {
            if(maxCount > 1) {
                if(idWinners.includes(atribPlayers.indexOf(ap)+1)) {
                    values.push(Number(ap.children[id].querySelector('.atrib-value').textContent));
                } else {
                    values.push(-Infinity);
                }
            } else {
                values.push(Number(ap.children[id].querySelector('.atrib-value').textContent));
            }
        } else {
            values.push(-Infinity);
        }
    };
    console.log(values);
    
    const maxValue = values.reduce(function(a, b) {
        return Math.max(a, b);
    }, -Infinity);
    
    maxCount = 0;
    idWinners = [];
    
    for(let i = 0; i < values.length; i++) {
        if(values[i] === maxValue) {
            maxCount++;
            idWinners.push(i+1);
        }
    };

    console.log(numberRoundCards(values));

    if(maxCount === 1) {
        distrCard(idWinners, numberRoundCards(values));
        textResult.querySelector('p').innerText = `O jogador ${idWinners} foi o vencedor`;
    } else {
        distrCard(0, numberRoundCards(values));
        textResult.querySelector('p').innerText = `Os jogadores ${idWinners.join(', ')} empataram`;
    }
    textResult.style.display = 'flex';
};

function numberRoundCards(vals) {
    nrCards = 0;
    vals.forEach((value) => {
        if(value != -Infinity) {
            nrCards++;
        }
    });
    return nrCards;
};

function distrCard(idPlayer, cardsCount) {
    const numbCardsCenterDeck = deckCenter.children.length;
    
    if(idPlayer != 0) {
        const deckWinner = document.querySelector(`#deck-${idPlayer}`);
        const numbCards = deckWinner.childElementCount;

        for(let i = numbCards + 1; i < cardsCount + numbCards + numbCardsCenterDeck + 1; i++) {
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            card.setAttribute('id', `deck-${idPlayer}-card-${i}`);
            deckWinner.appendChild(card);
        }
        while(deckCenter.lastChild) {
            deckCenter.removeChild(deckCenter.lastChild);
        } 
    } else {
        for(let i = numbCardsCenterDeck; i < cardsCount + numbCardsCenterDeck; i++) {
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            card.setAttribute('id', `deck-${idPlayer}-card-${i}`);
            deckCenter.appendChild(card);
        }
    }
    infoCards();
};
