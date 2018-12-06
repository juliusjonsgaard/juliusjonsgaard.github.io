
let brukerScore = 0;
let dataScore = 0;
const brukerScore_span = document.getElementById('bruker-score');
const dataScore_span = document.getElementById('data-score');
const scoreTavle_div = document.querySelector('.score-tavle');
const resultat_div = document.querySelector('.resultat');
const stein_div = document.getElementById('Stein');
const papir_div = document.getElementById('Papir');
const saks_div = document.getElementById('Saks');
const resetButton = document.getElementById("reset-button");



// setter oppe en function for at maskinen skal bruke math.random til å velge en verdig mellom 0-2
function getDataValg() {
    const muligheter = ['Stein', 'Saks', 'Papir'];
    const randomNumber = Math.floor(Math.random() * 3);
    return muligheter[randomNumber];
}

// fuction for hvilke verdier som skal komme, når jeg trykker på de forskjellige trekkene
function convertCase(hvaJegVilHa) {
    if (hvaJegVilHa === 'Papir') return 'Papir';
    if (hvaJegVilHa === 'Saks') return 'Saks';
    return 'Stein';
}

// Situasjonen hvor du vinner - dette er function som bestemmer hva som sies når du vinner
function win(spiller, maskin) {
    brukerScore++;
    brukerScore_span.innerHTML = brukerScore;
    const userName = ' (Spiller)'.fontsize(3).sup();
    const compName = ' (Maskin)'.fontsize(3).sup();
    resultat_div.innerHTML = `<p>${convertCase(spiller)}${userName} tar ${convertCase(maskin)}${compName}. Du vant!</p>`;
    const roundStatus = document.getElementById(spiller);
    roundStatus.classList.add('winningStyles');
    setTimeout(() => roundStatus.classList.remove('winningStyles'), 300);
}

// Situasjonen hvor du taper  - dette er function som bestemmer hva som sies når du vinner
function loses(spiller, maskin) {
    dataScore++;
    dataScore_span.innerHTML = dataScore;
    const userName = ' (Spiller)'.fontsize(3).sup();
    const compName = ' (Maskin)'.fontsize(3).sup();
    resultat_div.innerHTML = `<p>${convertCase(maskin)}${compName} tar ${convertCase(spiller)}${userName}. Du tapte!</p>`;
    const roundStatus = document.getElementById(spiller);
    roundStatus.classList.add('losingStyles');
    setTimeout(() => roundStatus.classList.remove('losingStyles'), 300);
}

// Situasjonen hvor det blir likt - dette er function som bestemmer hva som sies når det blir likt
function draw(spiller, maskin) {
    const userName = ' (Spiller)'.fontsize(3).sup();
    const compName = ' (Maskin)'.fontsize(3).sup();
    resultat_div.innerHTML = `<p>Det ble likt! Dere valgte begge ${convertCase(spiller)}</p>`;
    const roundStatus = document.getElementById(spiller);
    roundStatus.classList.add('drawStyles');
    setTimeout(() => roundStatus.classList.remove('drawStyles'), 300);
}

// dette er function som bestemmer hvilket trekk som vinner
function game(brukerValg) {
    const dataValg = getDataValg();


    switch (brukerValg + dataValg) {
        case 'PapirStein':
        case 'SteinSaks':
        case 'SaksPapir':
            win(brukerValg, dataValg);
            // du vinner
            break;
        case 'SteinPapir':
        case 'SaksStein':
        case 'PapirSaks':
            loses(brukerValg, dataValg);
            // du taper
            break;
        case 'SteinStein':
        case 'SaksSaks':
        case 'PapirPapir':
            draw(brukerValg, dataValg);
            // det blir likt
            break;
    }
}

const resetScores = () => {
    dataScore= 0;
    dataScore.innerHTML = computerScore
    brukerScore = 0;
    brukerScore.innerHTML = userScore;
};

// denne function lager en eventlistener for stein, saks og papir.
//Funksjonen henter html elementet og sender verdien til funksjonene i spillet.
//Gjør at det er mulig å velge de ulike trekkene
function main() {
    stein_div.addEventListener('click', () => game('Stein'));
    saks_div.addEventListener('click', () => game('Saks'));
    papir_div.addEventListener('click', () => game('Papir'));
    resetButton.addEventListener('click', () => resetScores());


}

main();

