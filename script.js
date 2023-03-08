let numbPlayers = 4;
let numbTotalCards = 12;
let numbCardInit = 3; 
const mainPlayBtn = document.querySelector('#main-play-btn');
const secSelecCards = document.querySelector('.selected-cards');
const decks = [];
const deck1 = document.querySelector('#deck-1');
const deck2 = document.querySelector('#deck-2');
const deck3 = document.querySelector('#deck-3');
const deck4 = document.querySelector('#deck-4');
const deckCenter = document.querySelector('#center-deck');
const infoPlayers = [];
const atribButtons1 = document.querySelector('#player-1').getElementsByClassName('button-card');
const atrib1 = document.querySelector('#player-1').querySelector('.atributes-card');
const atrib2 = document.querySelector('#player-2').querySelector('.atributes-card');
const atrib3 = document.querySelector('#player-3').querySelector('.atributes-card');
const atrib4 = document.querySelector('#player-4').querySelector('.atributes-card');
const textResult = document.querySelector('#text-result');
const btnSelecCards = document.querySelector('#btn-selected-cards');


countPlayers(numbPlayers);

function countPlayers(nPlayers) {
    for(let i = 1; i < nPlayers + 1; i++){
        decks.push(document.querySelector(`#deck-${i}`));
        infoPlayers.push(document.querySelector(`#info-pl-${i}`));
        infoPlayers[i-1].querySelector('.info-name').textContent = `Player ${i}`;
    }
    addCard();
    infoCards(nPlayers);
}

function addCard() {
    let indexDeck = 0; 

    for(let i = 1; i < numbTotalCards + 1; i++) {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('id', `deck-1-card-${i}`);
        
        decks[indexDeck].appendChild(card);
        if(i === (indexDeck+1)*numbCardInit) {
            indexDeck++;
        }
    }
};

function infoCards(nPlayers) {
    for(let i = 0; i < nPlayers; i++) {
        infoPlayers[i].querySelector('.info-cards').textContent = `${decks[i].childElementCount} cartas`;
        if(decks[i].childElementCount === 0) {
            closeSelecCards();
            numbPlayers -= 1;
            delete decks[i];
            console.log(`O jogador ${i+1} perdeu.`);
            console.log(decks);
        }      
    }
}

mainPlayBtn.addEventListener('click', openSelecCards);

btnSelecCards.addEventListener('click', closeSelecCards);

function openSelecCards(){
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
        compareValues(i);
    });
    
};

function showAdvCards(turn) {
    if(turn === "on") {
        for(let i = 2; i < numbPlayers+1; i++) {
            const cardPlayer = document.querySelector(`#player-${i}`);
            cardPlayer.style.display = 'flex';
        }
        btnSelecCards.style.display = 'flex';
    } else {
        for(let i = 2; i < numbPlayers+1; i++) {
            const cardPlayer = document.querySelector(`#player-${i}`);
            cardPlayer.style.display = 'none';
        }
        btnSelecCards.style.display = 'none';
        textResult.style.display = 'none';
    }
};

function disableBtn(id) {
    const allAtribBtns = document.getElementsByClassName('button-card');
    
    if(id < atribButtons1.length) {
        atrib1.children[id].classList.add('chosen');
        atrib2.children[id].classList.add('chosen');
        atrib3.children[id].classList.add('chosen');
        atrib4.children[id].classList.add('chosen');
        
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

function compareValues(id) {
    
    const value1 = Number(atrib1.children[id].querySelector('.atrib-value').textContent);
    const value2 = Number(atrib2.children[id].querySelector('.atrib-value').textContent);
    const value3 = Number(atrib3.children[id].querySelector('.atrib-value').textContent);
    const value4 = Number(atrib4.children[id].querySelector('.atrib-value').textContent);

    const maxValue = Math.max(value1, value2, value3, value4);
    let maxCount = 0;
    let idWinners = [];
    
    if(maxValue === value1) {
        maxCount++;
        idWinners.push('1');
    }
    if(maxValue === value2){
        maxCount++;
        idWinners.push('2');
    }
    if(maxValue === value3){
        maxCount++;
        idWinners.push('3');
    }
    if(maxValue === value4){
        maxCount++;
        idWinners.push('4');
    }

    if(maxCount === 1) {
        distrCard(idWinners, numbPlayers);
        textResult.querySelector('p').innerText = `O jogador ${idWinners} foi o vencedor`;
    } else {
        distrCard(0, numbPlayers);
        textResult.querySelector('p').innerText = `Os jogadores ${idWinners.join(', ')} empataram`;
    }
    textResult.style.display = 'flex';
};

function distrCard(idPlayer, cardsCount) {
    
    for(d of decks) {
        if(d != undefined) {
            d.removeChild(d.lastChild);
        }
    }
    
    const numbCardsCenterDeck = deckCenter.children.length;
    
    if(idPlayer != 0) {
        const deckWinner = document.querySelector(`#deck-${idPlayer}`);
        const numbCards = deckWinner.childElementCount;

        for(let i = numbCards + 1; i < cardsCount + numbCards + numbCardsCenterDeck +   1; i++) {
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
    infoCards(numbPlayers);
};

