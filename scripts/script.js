import { getPokemon } from './servicePokemonApi.js';

let numbPlayers = 4;
let numbTotalCards = 16;
let numbCardInit = 4;
let namesPlyrs = [];
let pokemonList = []; 
let listPl1=[], listPl2=[], listPl3=[], listPl4=[], listDraw=[];
let allListPl=[listPl1, listPl2, listPl3, listPl4, listDraw];
const btnMainPlay = document.querySelector('#main-play-btn');
const btnLoadChoose = document.querySelector('#btn-load-choose');
const btnLoadPlay = document.querySelector('#btn-load-play');
const btnSelecCards = document.querySelector('#btn-selected-cards');
const btnGameOver = document.querySelector('#btn-ok-gameover');
const btnResetGOver = document.querySelector('#btn-reset-gameover');
const secLoading = document.querySelector('#loading');
const secSelecCards = document.querySelector('.selected-cards');
const secGameOver = document.querySelector('#gameover-sec'); 
const loadIcon = document.querySelector('#loading-icon'); 
const decks = [];
const deckCenter = document.querySelector('#center-deck');
const infoPlayers = [];
const cardsSelec = [];
const attribButtons1 = document.querySelector('#player-1').getElementsByClassName('button-card');
const attribPlayers = [];
const textResult = document.querySelector('#text-result');
const textGameOver = document.querySelector('#title-gameover');
let idsInGame = [];
let maxCount = 0;
let idWinners = [];
let oldWinner = 1;
let idGameOverPl = [];


btnLoadChoose.addEventListener('click', () => {
    const elemNumbCards = document.querySelector('#numb-cards');
    const elemNumbPl = document.querySelector('#numb-players');
    numbCardInit = Number(elemNumbCards.value);
    numbPlayers = Number(elemNumbPl.value);
    numbTotalCards = numbCardInit * numbPlayers;
    elemNumbCards.setAttribute('disabled', '');
    elemNumbPl.setAttribute('disabled', '');

    const elemNick = document.querySelector('#nick');
    elemNick.setAttribute('disabled', '');

    btnLoadChoose.style.display = 'none';
    loadIcon.style.visibility = 'visible';
    btnLoadPlay.style.display = 'flex';

    console.log(elemNick.value);
    addNick(elemNick.value);
    ruffleIds(numbTotalCards);
    mainBoxDisplay(numbPlayers);
    getInfoPokemon();
});

function ruffleIds(totalIds) {
    for (let i = 0; i < totalIds; i++) {

        if (idsInGame.length === totalIds) {
            // Todos os números já foram sorteados
            return;
        }

        let ruffledNumb;
        do {
            // Gerando um número aleatório
            ruffledNumb = Math.floor(Math.random() * 151) + 1;
        } while (idsInGame.includes(ruffledNumb)); // Verificando se o número já foi sorteado

        // Armazenando o número sorteado no vetor
        idsInGame.push(ruffledNumb);
    }
}

function mainBoxDisplay(nPlayers) {
    if(nPlayers === 2) {
        for(let i = nPlayers + 1; i <= 4; i++) {
            document.querySelector(`#pc-${i}`).style.display = 'none';
            document.querySelector(`#info-pl-${i}`).style.display = 'none';
        }
        const p2Pc = document.querySelector(`#pc-2`);
        p2Pc.classList.replace('vertical', 'horizontal');
        p2Pc.style.right = 'auto';
        p2Pc.style.top = '0';
        p2Pc.querySelector('.name-player').style.bottom = 'auto';
        p2Pc.querySelector('.name-player').style.left = 'var(--distance-name-player)';
        p2Pc.querySelector('#deck-2').style.flexDirection = 'row-reverse';
        document.querySelector(`#info-pl-2`).style.borderRight = '0';
    }
}

async function getInfoPokemon() {
    pokemonList = await getPokemon(idsInGame);
    console.log(pokemonList);
    afterload();
};

function afterload() {
    btnLoadPlay.disabled = false;
    loadIcon.style.visibility = 'hidden';
    for(let i = 0; i < attribButtons1.length; i++) {
        attribButtons1[i].addEventListener('click', () => {
            showAdvCards("on");
            disableBtn(i);
            takeCards();
            compareValues(i);
        });
    }
    btnLoadPlay.addEventListener('click', startGame);
    btnMainPlay.addEventListener('click', openSelecCards);
    btnSelecCards.addEventListener('click', closeSelecCards);
    btnGameOver.addEventListener('click', openCloseGameOver);
    btnResetGOver.addEventListener('click', resetGame);
}

function startGame() {
    countPlayers(numbPlayers);
    secLoading.style.display = 'none';
};

function addNick(namePl1) {
    if(namePl1 !== "") {
        namesPlyrs[0] = namePl1;
        document.querySelector('.name-player').querySelector('span').textContent = namesPlyrs[0];
        document.querySelector('#info-pl-1').querySelector('.info-name').textContent = namesPlyrs[0];
    } else {
        namesPlyrs[0] = 'Jogador 1';
        document.querySelector('.name-player').querySelector('span').textContent = namesPlyrs[0];
        document.querySelector('#info-pl-1').querySelector('.info-name').textContent = namesPlyrs[0];
    }
    for(let i = 1; i < numbPlayers; i++) {
        namesPlyrs[i] = `Jogador ${i+1}`;
    }
    const tagsNames = document.getElementsByClassName('tag-selec-card');
    for(let i = 0; i < numbPlayers; i++) {
        tagsNames[i].innerText = namesPlyrs[i];
    }
}

function countPlayers(nPlayers) {
    for(let i = 1; i < nPlayers + 1; i++) {
        decks.push(document.querySelector(`#deck-${i}`));
        infoPlayers.push(document.querySelector(`#info-pl-${i}`));
        if(i != 1) {
            infoPlayers[i-1].querySelector('.info-name').textContent = `Jogador ${i}`;
        }
        cardsSelec.push(document.querySelector(`#card-pl-${i}`));
        attribPlayers.push(document.querySelector(`#player-${i}`).querySelector('.attributes-card'));
    }
    addCard();
    infoCards();
    shuffleIds();
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
                delete attribPlayers[i];
                idGameOverPl.push(i+1);
                if(idWinners.includes(i+1)) {
                    idWinners.splice(idWinners.indexOf(i+1), 1);
                }
            }      
        }
    }
};

function shuffleIds() {
    /*
    const exemp = [];
    for(let i = 0; i < numbTotalCards; i++) {
        exemp[i] = i;
    }

    let p, n, tmp;
    for(p = exemp.length; p;) {
        n = Math.random() * p-- | 0;
        tmp = exemp[n];
        exemp[n] = exemp[p];
        exemp[p] = tmp;
    } */ // OBSOLETO

    let indexDeck = 0;
    for(let i = 0; i < numbTotalCards; i++) {
        allListPl[indexDeck].push(i);

        if(i === ((indexDeck+1)*numbTotalCards/numbPlayers)-1) {
            indexDeck++;
        }
    }
};

function defineAttribs() {
    for(let i=0; i < cardsSelec.length; i++) {
        if(decks[i] != undefined) {
            cardsSelec[i].querySelector('.number-card').querySelector('p').innerText = `#${pokemonList[allListPl[i][0]].id}`;
            cardsSelec[i].querySelector('.name-card').querySelector('p').innerText = pokemonList[allListPl[i][0]].name;
            cardsSelec[i].querySelector('.image-card').querySelector('img').setAttribute('src', pokemonList[allListPl[i][0]].image);
            attribPlayers[i].children[0].querySelector('.attrib-value').textContent = pokemonList[allListPl[i][0]].attribs[0];
            attribPlayers[i].children[1].querySelector('.attrib-value').textContent = pokemonList[allListPl[i][0]].attribs[1];
            attribPlayers[i].children[2].querySelector('.attrib-value').textContent = pokemonList[allListPl[i][0]].attribs[2];
            attribPlayers[i].children[3].querySelector('.attrib-value').textContent = pokemonList[allListPl[i][0]].attribs[3];
            attribPlayers[i].children[4].querySelector('.attrib-value').textContent = pokemonList[allListPl[i][0]].attribs[4];
        }
    }
}

function openSelecCards() {
    if(numbPlayers > 1) {
        idGameOverPl = [];
        secSelecCards.style.display = 'block';
        if(oldWinner === 1) {
            cardsSelec[0].style.display = 'flex';
        } else {
            choseAttrib();
        }
    }
};

function closeSelecCards() {
    secSelecCards.style.display = 'none';  
    showAdvCards("off");
    disableBtn(attribButtons1.length);
    if(idGameOverPl.length > 0) {
        for(let id of idGameOverPl) {
            document.querySelector(`#card-pl-${id}`).style.display = 'none';
        }
        titleGameOver(idGameOverPl);
        openCloseGameOver();
    }
    defineAttribs();
};

function choseAttrib() {
    const auxAttrib = Math.floor(Math.random() * 5);
    showAdvCards("on");
    disableBtn(auxAttrib);
    takeCards();
    compareValues(auxAttrib);
};

function showAdvCards(turn) {
    if(turn === "on") {
        for(let cs of cardsSelec) {
            if(cs != undefined) {
                if(idWinners.length > 1) {
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
    const allAttribBtns = document.getElementsByClassName('button-card');
    
    if(id < attribButtons1.length) {
        for(let ap of attribPlayers) {
            if(ap != undefined) {
                ap.children[id].classList.add('chosen');
            }
        }
        for(let i = 0; i < allAttribBtns.length; i++) {
            allAttribBtns[i].disabled = true;
        }
    } else {
        for(let i = 0; i < allAttribBtns.length; i++) {
            allAttribBtns[i].classList.remove('chosen');
            allAttribBtns[i].disabled = false;
        }
    }
};

function takeCards() {
    for(let d of decks) {
        if(d != undefined) {
            if(idWinners.length > 1) {
                idWinners.forEach((ids) => {
                    if(decks.indexOf(d) === ids-1) {
                        d.removeChild(d.lastChild);
                        listDraw.push(allListPl[decks.indexOf(d)].shift());
                    }
                });
            } else {
                d.removeChild(d.lastChild);
                listDraw.push(allListPl[decks.indexOf(d)].shift());
            }
        }
    }
};

function compareValues(id) {
    let values = [];
    for(let ap of attribPlayers) {
        if(ap != undefined) {
            if(idWinners.length > 1) {
                if(idWinners.includes(attribPlayers.indexOf(ap)+1)) {
                    values.push(Number(ap.children[id].querySelector('.attrib-value').textContent));
                } else {
                    values.push(-Infinity);
                }
            } else {
                values.push(Number(ap.children[id].querySelector('.attrib-value').textContent));
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
    const attribText = document.querySelector(`#player-1`).querySelector('.attributes-card').children[atb].querySelector('.attrib-text').textContent;
    if(mc === 1) {
        textResult.querySelector('p').innerHTML = `${namesPlyrs[oldWinner-1]} escolheu o atributo ${attribText}.<br>${namesPlyrs[idWinners-1]} foi o vencedor.`;
    } else {
        let nameWinners = idWinners.map(ind => namesPlyrs[ind-1]);
        textResult.querySelector('p').innerHTML = `${namesPlyrs[oldWinner-1]} escolheu o atributo ${attribText}.<br>${nameWinners.join(', ')} empataram.`;
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
        
        let numbLD = listDraw.length; 
        for(let i=0; i < numbLD; i++) {
            allListPl[idPlayer-1].push(listDraw.shift()); 
        }
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
            let nameLoosers = idGO.map(ind => namesPlyrs[ind-1]);
            textGameOver.querySelector('p').innerText = `${nameLoosers.join(', ')} perderam`;
        } else if(idGO.length === 1) {
            textGameOver.querySelector('p').innerText = `${namesPlyrs[idGO-1]} perdeu`;
        }
    } else if(numbPlayers === 1) {
        const indWin = decks.findIndex((indW) => { return indW != undefined });
        textGameOver.querySelector('p').innerText = `${namesPlyrs[indWin]} ganhou o jogo`;
    } else if(numbPlayers === 0) {
        let nameWinners = idGO.map(ind => namesPlyrs[ind-1]);
        textGameOver.querySelector('p').innerText = `${nameWinners.join(', ')} empataram o jogo`;
    }
};

function resetGame() {
    document.location.reload(true);
};