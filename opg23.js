"use strict";

const colourAutoBtn = document.getElementById('colourAutoBtn');
const colourAutoField = document.getElementById('colourAutoField');
const colourGuessField = document.getElementById('colourGuessField');
const sliderR = document.getElementById('sliderR');
const sliderG = document.getElementById('sliderG');
const sliderB = document.getElementById('sliderB');
const currentRValue = document.getElementById('currentRValue');
const currentGValue = document.getElementById('currentGValue');
const currentBValue = document.getElementById('currentBValue');
const distanceDisplay = document.getElementById('distanceDisplay');
const timerDisplay = document.getElementById('timerDisplay');

let timerToggle = false; //toggle til at indikere om tiden (og spillet) er startet

const colour1 = {r: 255, g: 255, b: 255};
const colour2 = {r: 255, g: 255, b: 255};
let times = [];

alert('Click "GENERATE COLOUR"-button to start a new game. Then, adjust the sliders until the "distance" bar on the bottom shows 0. Your attempt is being timed.');

//slider array
const sliders = [
    { slider: sliderR, key: 'r', display: currentRValue },
    { slider: sliderG, key: 'g', display: currentGValue },
    { slider: sliderB, key: 'b', display: currentBValue }
];

//låser slidere
function lockSliders(lockedStatus) { //hvis lockedStatus er true, så bliver sliderne låst. Hvis false, så er de åbne.
    sliders.forEach(({slider}) => {
        slider.disabled = lockedStatus;
    })
}

lockSliders(true);   // låser alle, så man ikke kan starte spillet, før man har genereret en random farve

//event listener på farve generer knappen
colourAutoBtn.addEventListener('click', () => {
    for (let key in colour1){ //iterere over hver key i objektet
        colour1[key] = Math.floor(Math.random() * 256); //den runder ned, så 255-256 vil give 255
        console.log(key, colour1[key]); //hvorfor [] frem for dot notation? fordi: key i for...in-løkke er en variabel med navnet på property’en (fx "r", "g", "b"). colour1.key læser bogstaveligt property’en med navnet "key" (findes ikke). colour1[key] bruger værdien af variablen key til at slå den rigtige property op. Så kort sagt: dot = statisk navn, brackets = dynamisk navn.
    }
    colourAutoField.style.backgroundColor= `rgb(${colour1.r}, ${colour1.g}, ${colour1.b})`;
    resetGuess (); //ligegyldig ved første spil, men nødvendig for det næste og flere
    lockSliders(false); //åbner for spillets slidere
});

//event listener på slidere (reagerer kun hvis spillet er igang)
sliders.forEach(({ slider, key, display }) => {
    slider.addEventListener('input', () => updateColourGuess(slider, key, display));
});

function updateColourGuess (val, key, divhtml) { 
    let numberValue = Number(val.value);
    colour2[key] = numberValue; 
    divhtml.textContent = numberValue;
    colourGuessField.style.backgroundColor = `rgb(${colour2.r}, ${colour2.g}, ${colour2.b})`;
    
    distRGB(); //regner distancen ud - hele den her function kører, når man flytter på slideren
}

function distRGB() {
    let distance = Math.hypot(colour2.r - colour1.r, colour2.g - colour1.g, colour2.b - colour1.b);
    distanceDisplay.textContent = Number(distance.toFixed(4)); //reducer til 4 cifre - ellers viser den vildt mange. Bruger Number() så HVIS den er under 4 cifre, så reducere den til fx 3, 2, 1 eller 0 cifre.
    if (distance > 0 && timerToggle === false){ //når man flytter en slider, så vil distance blive over 0, og så vil tiden starte. Den vil kun gå ind i den her når spillet starter og ikke efter
        timerToggle = true;
        logTimer();
        startTimer();
    } 
    if (distance === 0 && timerToggle === true) {
        logTimer();
        lockSliders(true);
        setTimeout(() => { //der går lige et sekund før man får en "du har klaret spillet" meddelelse
            alert(`It took you ${(times[1]-times[0])/1000} seconds to find the colour. Want to try again? Just generate a new colour.`)
            times = [];
        }, 1000);
        timerToggle = false;
        clearInterval(liveTimer);
    }
}

//live timer - faktisk bare til display. Den er tilføjet til sidst da den ikke er påkrævet i opgavebesvarelsen.
let seconds = 0;
let liveTimer; // gemmer intervalID (sættes lige nedenunder). Ellers kan den ikke stoppes igen
function startTimer() {
    liveTimer = setInterval (() => {
        seconds++;
        timerDisplay.textContent= `${seconds}`;
    }, 1000)
};

//timer logger
function logTimer() {
    const time = Date.now();
    times.push(time);
};

//reset gætte-sektionen. 
function resetGuess () { // når man trykker på random-generer-farve-knappen, så skal gætte delen resettes
    colour2.r = 0;
    colour2.g = 0;
    colour2.b = 0;

    sliderR.value = 0;
    sliderG.value = 0;
    sliderB.value = 0;

    currentRValue.textContent = '0';
    currentGValue.textContent = '0';
    currentBValue.textContent = '0';

    colourGuessField.style.backgroundColor = `rgb(${colour2.r}, ${colour2.g}, ${colour2.b})`;
    distanceDisplay.textContent = '... Move a slider to start';

    clearInterval(liveTimer);
    seconds = 0;
    timerDisplay.textContent = '0';
    timerToggle = false;

    times = [];
}


