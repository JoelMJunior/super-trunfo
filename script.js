import { getPokemon } from './servicePokemonApi.js';

let numbPlayers = 4;
let numbTotalCards = 12;
let numbCardInit = 3;
let pokemonList = []; 
let listPl1=[], listPl2=[], listPl3=[], listPl4=[];
let allListPl=[listPl1, listPl2, listPl3, listPl4];
const mainPlayBtn = document.querySelector('#main-play-btn');
const btnSelecCards = document.querySelector('#btn-selected-cards');
const btnGameOver = document.querySelector('#btn-ok-gameover');
const btnResetGOver = document.querySelector('#btn-reset-gameover');
const secSelecCards = document.querySelector('.selected-cards');
const secGameOver = document.querySelector('#gameover-sec'); 
const decks = [];
const deckCenter = document.querySelector('#center-deck');
const infoPlayers = [];
const cardsSelec = [];
const atribButtons1 = document.querySelector('#player-1').getElementsByClassName('button-card');
const atribPlayers = [];
const textResult = document.querySelector('#text-result');
const textGameOver = document.querySelector('#title-gameover');
let maxCount = 0;
let idWinners = [];
let oldWinner = 1;
let idGameOverPl = [];


async function getInfoPokemon() {
    pokemonList = await getPokemon();
};
await getInfoPokemon();
console.log(pokemonList);

mainPlayBtn.addEventListener('click', openSelecCards);
btnSelecCards.addEventListener('click', closeSelecCards);
btnGameOver.addEventListener('click', openCloseGameOver);
btnResetGOver.addEventListener('click', resetGame);

countPlayers(numbPlayers);
function countPlayers(nPlayers) {
    for(let i = 1; i < nPlayers + 1; i++){
        decks.push(document.querySelector(`#deck-${i}`));
        infoPlayers.push(document.querySelector(`#info-pl-${i}`));
        infoPlayers[i-1].querySelector('.info-name').textContent = `Player ${i}`;
        cardsSelec.push(document.querySelector(`#card-pl-${i}`));
        atribPlayers.push(document.querySelector(`#player-${i}`).querySelector('.atributes-card'));
    }
    addCard();
    infoCards();
    raffleIds();
    defineAttribs();
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
                numbPlayers -= 1;
                delete decks[i];
                delete cardsSelec[i];
                delete atribPlayers[i];
                idGameOverPl.push(i+1);
                if(idWinners.includes(i+1)) {
                    idWinners.splice(idWinners.indexOf(i+1), 1);
                }
            }      
        }
    }
};

function raffleIds() {
    const exemp = [];
    for(let i = 0; i < numbTotalCards; i++) {
        exemp[i] = i+1;
    }

    let p, n, tmp;
    for(p = exemp.length; p;) {
        n = Math.random() * p-- | 0;
        tmp = exemp[n];
        exemp[n] = exemp[p];
        exemp[p] = tmp;
    }

    let indexDeck = 0;
    for(let i = 0; i < exemp.length; i++) {
        allListPl[indexDeck].push(exemp[i]);

        if(i === ((indexDeck+1)*exemp.length/numbPlayers)-1) {
            indexDeck++;
        }
    }
    console.log(exemp);
    console.log(allListPl);
};

function defineAttribs() {
    for(let i=0; i < cardsSelec.length; i++) {
        cardsSelec[i].querySelector('.name-card').querySelector('p').innerText = pokemonList[allListPl[i][0]].name;
        cardsSelec[i].querySelector('.image-card').querySelector('img').setAttribute('src', pokemonList[allListPl[i][0]].image);
        atribPlayers[i].children[0].querySelector('.atrib-value').textContent = pokemonList[allListPl[i][0]].attribs[0];
        atribPlayers[i].children[1].querySelector('.atrib-value').textContent = pokemonList[allListPl[i][0]].attribs[1];
        atribPlayers[i].children[2].querySelector('.atrib-value').textContent = pokemonList[allListPl[i][0]].attribs[2];
        atribPlayers[i].children[3].querySelector('.atrib-value').textContent = pokemonList[allListPl[i][0]].attribs[3];
        atribPlayers[i].children[4].querySelector('.atrib-value').textContent = pokemonList[allListPl[i][0]].attribs[4];
    }
}

function openSelecCards() {
    if(numbPlayers > 1) {
        idGameOverPl = [];
        secSelecCards.style.display = 'block';
        if(oldWinner === 1) {
            cardsSelec[0].style.display = 'flex';
        } else {
            choseAtrib();
        }
    }
};

function closeSelecCards() {
    secSelecCards.style.display = 'none';  
    showAdvCards("off");
    disableBtn(atribButtons1.length);
    if(idGameOverPl.length > 0) {
        for(let id of idGameOverPl) {
            document.querySelector(`#card-pl-${id}`).style.display = 'none';
        }
        titleGameOver(idGameOverPl);
        openCloseGameOver();
    }
};

for(let i = 0; i < atribButtons1.length; i++) {
    atribButtons1[i].addEventListener('click', () => {
        showAdvCards("on");
        disableBtn(i);
        takeCards();
        compareValues(i);
    });
};

function choseAtrib() {
    const auxAtrib = Math.floor(Math.random() * 5);
    showAdvCards("on");
    disableBtn(auxAtrib);
    takeCards();
    compareValues(auxAtrib);
};

function showAdvCards(turn) {
    if(turn === "on") {
        for(let cs of cardsSelec) {
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
        for(let cs of cardsSelec) {
            if(cs != undefined) {
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
        for(let ap of atribPlayers) {
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
    for(let d of decks) {
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
    for(let ap of atribPlayers) {
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

    if(maxCount === 1) {
        defineTextResult(maxCount, id);
        distrCard(idWinners, numberRoundCards(values));
    } else {
        defineTextResult(maxCount, id);
        distrCard(0, numberRoundCards(values));
    }
    lastWinner(idWinners);
    textResult.style.display = 'flex';
};

function defineTextResult(mc, atb) {
    if(mc === 1) {
        textResult.querySelector('p').innerHTML = `O jogador ${oldWinner} escolheu o atributo ${atribPlayers[0].children[atb].querySelector('.atrib-text').textContent}.<br> O jogador ${idWinners} foi o vencedor.`;
    } else {
        textResult.querySelector('p').innerHTML = `O jogador ${oldWinner} escolheu o atributo ${atribPlayers[0].children[atb].querySelector('.atrib-text').textContent}.<br> Os jogadores ${idWinners.join(', ')} empataram.`;
    }
};

function lastWinner(winners) {
    if(winners.length != 0) {
        if(winners.includes(oldWinner)) {
            oldWinner = oldWinner; 
        } else {
            const indOW = Math.floor(Math.random() * winners.length);
            oldWinner = winners[indOW];
        }
    } else {
        let auxIdPlayers = [];
        for(let d of decks) {
            if(d != undefined) {
                auxIdPlayers.push(decks.indexOf(d)+1);
            }
        }
        const indOW = Math.floor(Math.random() * auxIdPlayers.length);
        oldWinner = auxIdPlayers[indOW];
        maxCount = 0;
    }
};

function numberRoundCards(vals) {
    let nrCards = 0;
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

function openCloseGameOver() {
    const auxSecGameOver = getComputedStyle(secGameOver).display;

    if(auxSecGameOver === 'none' || secGameOver.style.display === 'none') {
        if(decks[0] === undefined || numbPlayers === 1) {
            btnResetGOver.style.display = 'block';
        }
        secGameOver.style.display = 'block';
    } else if(auxSecGameOver === 'block' || secGameOver.style.display === 'block') {
        secGameOver.style.display = 'none';
    }
};

function titleGameOver(idGO) {
    if(numbPlayers > 1) {
        if(idGO.length > 1) {
            textGameOver.querySelector('p').innerText = `Os jogadores ${idGO.join(', ')} perderam`;
        } else if(idGO.length === 1) {
            textGameOver.querySelector('p').innerText = `O jogador ${idGO} perdeu`;
        }
    } else if(numbPlayers === 1) {
        const indWin = decks.findIndex((indW) => { return indW != undefined });
        textGameOver.querySelector('p').innerText = `O jogador ${indWin+1} ganhou o jogo`;
    } else if(numbPlayers === 0) {
        textGameOver.querySelector('p').innerText = `Os jogadores ${idGO.join(', ')} empataram o jogo`;
    }
};

function resetGame() {
    document.location.reload(true);
};