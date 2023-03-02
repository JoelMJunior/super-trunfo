let numbPlayers = 4;
let numbTotalCards = 32;
let numbCardInit = 8; 
let auxSelecCards = false;
const mainPlayBtn = document.querySelector('#main-play-btn');
const secSelecCards = document.querySelector('.selected-cards');
const decks = [];
const deck1 = document.querySelector('#deck-1');
const deck2 = document.querySelector('#deck-2');
const deck3 = document.querySelector('#deck-3');
const deck4 = document.querySelector('#deck-4');
const deckCenter = document.querySelector('#center-deck');
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
        decks.push(document.querySelector(`#deck-${i}`))
    }
    addCard();
}

function addCard() {

    /*
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
    */
    

    for(let i = 1; i < numbCardInit + 1; i++) {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('id', `deck-1-card-${i}`);
        card.style.left = `${(i-1)*10}px`;
        deck1.appendChild(card);
    }
    for(let i = 1; i < numbCardInit + 1; i++) {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('id', `deck-2-card-${i}`);
        card.style.top = `${(i-1)*10}px`;
        deck2.appendChild(card);
    }
    for(let i = 1; i < numbCardInit + 1; i++) {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('id', `deck-3-card-${i}`);
        card.style.right = `${(i-1)*10}px`;
        deck3.appendChild(card);
    }
    for(let i = 1; i < numbCardInit + 1; i++) {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('id', `deck-4-card-${i}`);
        card.style.bottom = `${(i-1)*10}px`;
        deck4.appendChild(card);
    }
};

mainPlayBtn.addEventListener('click', function() {

    secSelecCards.style.display = 'block';
    auxSelecCards = true;      
});

btnSelecCards.addEventListener('click', function() {

    secSelecCards.style.display = 'none';  
    showAdvCards("off");
    disableBtn(atribButtons1.length);
    auxSelecCards = false;
});

/*
function removeCard(i) {
    const deckId = i.substring(5,6);
    const cardId = i.substring(12,13);
    const card = document.querySelector(`#deck-${deckId}-card-${cardId}`);
    if(card != null) {
        card.remove(this);
    }
};
*/

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
    
    if(id < 4) {
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
        distrCard(idWinners, 4);
        textResult.querySelector('p').innerText = `O jogador ${idWinners} foi o vencedor`;
    } else {
        distrCard(0, 4);
        textResult.querySelector('p').innerText = `Os jogadores ${idWinners.join(', ')} empataram`;
    }
    textResult.style.display = 'flex';
};

function distrCard(idPlayer, cardsCount) {
    
    for(d of decks) {
        d.removeChild(d.lastChild);
    }
    
    const numbCardsCenterDeck = deckCenter.children.length;
    
    if(idPlayer != 0) {
        const deckWinner = document.querySelector(`#deck-${idPlayer}`);
        const numbCards = deckWinner.childElementCount;

        for(let i = numbCards + 1; i < cardsCount + numbCards + numbCardsCenterDeck +   1; i++) {
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            card.setAttribute('id', `deck-${idPlayer}-card-${i}`);
            if(idPlayer == 1) {
                card.style.left = `${(i-1)*10}px`;
            } else if(idPlayer == 2) {
                card.style.top = `${(i-1)*10}px`;
            } else if(idPlayer == 3) {
                card.style.right = `${(i-1)*10}px`;
            } else if(idPlayer == 4) {
                card.style.bottom = `${(i-1)*10}px`;
            }
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
            card.style.left = `${(i)*10}px`;
            deckCenter.appendChild(card);
        }
    }
};

