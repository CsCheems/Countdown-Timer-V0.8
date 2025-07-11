//IMPORTS DE UTILS Y CONSTANTS
import { startingTime, maxTime } from './constantes.js';
import { getPausedTime } from './utils.js';

// VARIABLES DE ESTADO
let currentTimer = startingTime;
let currentTotalTime = startingTime;
let currentIntervalId = null;
let isTimerPaused = true;
let isMarathonOver = false;
let isMaxTimeReached = false;
let countdownDisplayElement;

export function initializeTimer(displayElement) {
    countdownDisplayElement = displayElement;
    updateCountdownDisplay(currentTimer);
}

//HELPER PARA MANEJAR TIEMPO PAUSADO
function getAdjustedTime(calculatedTime) {
    if (isTimerPaused) {
        const pausedTime = getPausedTime();
        localStorage.clear();
        const newTime = calculatedTime + pausedTime;
        localStorage.setItem('pause', newTime);
        return newTime;
    }
    return calculatedTime;
}

//AGREGAR TIEMPO//
export function AddTime(secondsToAdd) {
    secondsToAdd = Math.round(secondsToAdd);

    if (isMaxTimeReached || isMarathonOver) return;

    let tiempoRestante = maxTime - currentTotalTime;

    if (tiempoRestante <= 0) {
        isMaxTimeReached = true;
        return;
    }

    if (secondsToAdd > tiempoRestante) {
        secondsToAdd = tiempoRestante;
        isMaxTimeReached = true;
    }

    currentTotalTime += secondsToAdd;
    currentTimer += secondsToAdd;

    animateTimeAddition(secondsToAdd);

    console.log(`⏱️ Tiempo añadido: ${secondsToAdd}s | ⌛ Total acumulado: ${currentTotalTime}s / ${maxTime}s | 🕒 Timer visual: ${currentTimer}s`);
}

function animateTimeAddition(seconds) {
    const tiempoAgregado = document.createElement('span');
    tiempoAgregado.className = "tiempoAgregado";
    tiempoAgregado.style.color = "#00F700";
    tiempoAgregado.style.fontSize = "15px";
    tiempoAgregado.style.fontFamily = "Cal Sans";
    tiempoAgregado.opacity = "0";
    tiempoAgregado.innerHTML = `+${seconds}`;
    tiempoAgregado.style.position = "absolute";
    tiempoAgregado.style.transform = "translate(-40%, -140%)";
    tiempoAgregado.style.transition = "opacity 1s ease-in";
    tiempoAgregado.style.right = "10px";
    const timeWrapper = document.getElementById('time-wrapper');
    timeWrapper.appendChild(tiempoAgregado);

    gsap.to(tiempoAgregado, {
        opacity: 1,
        duration:0.6,
        ease: "power2.out",  
        y: -55 
    });

    gsap.to(tiempoAgregado, {
        opacity: 0,
        duration:0.6,
        ease: "power2.in",  
    });

    setTimeout(() => {
        timeWrapper.removeChild(tiempoAgregado);
    }, 2000);
}

//COUNTDOWN TIMER//
export function startCountdown() {
    if (currentIntervalId) clearInterval(currentIntervalId);

    currentIntervalId = setInterval(function () {
        if (currentTimer <= 0) {
            isMarathonOver = true;
            clearInterval(currentIntervalId);
            if (countdownDisplayElement) {
                countdownDisplayElement.textContent = "¡Se acabó!";
            }
            return;
        }

        let displayTime = currentTimer;

        if (maxTime > 0 && currentTimer >= maxTime) {
            isMaxTimeReached = true;
            displayTime = maxTime;
        }

        updateCountdownDisplay(displayTime);
        currentTimer--;
    }, 1000);
}

function updateCountdownDisplay(timeInSeconds) {
    let horas = Math.floor(timeInSeconds / 3600);
    let minutos = Math.floor((timeInSeconds % 3600) / 60);
    let segundos = Math.floor(timeInSeconds % 60);

    horas = horas < 10 ? "0" + horas : horas;
    minutos = minutos < 10 ? "0" + minutos : minutos;
    segundos = segundos < 10 ? "0" + segundos : segundos;

    if (countdownDisplayElement) {
        countdownDisplayElement.textContent = `${horas}:${minutos}:${segundos}`;
    }
}

//MANIPULACION DE TIMER//
export function PauseTimer() {
    if (isTimerPaused) return;
    localStorage.setItem('pause', currentTimer);
    clearInterval(currentIntervalId);
    isTimerPaused = true;
}

export function ResumeTimer() {
    if (!isTimerPaused) return;
    isTimerPaused = false;
    currentTimer = getPausedTime();
    localStorage.removeItem('pause');
    startCountdown();
}

export function StartTimer() {
    if (!isTimerPaused) return;
    isTimerPaused = false;
    startCountdown();
}

export function ResetTimer() {
    isTimerPaused = false;
    currentTimer = startingTime;
    currentTotalTime = startingTime;
    isMarathonOver = false;
    isMaxTimeReached = false;
    startCountdown();
}

export function addToTimer(message) {
    if (isTimerPaused) return;
    const agregarSegundos = parseInt(message);
    if (isNaN(agregarSegundos)) {
        console.warn("addToTimer: No es un número válido:", message);
        return;
    }
    AddTime(getAdjustedTime(agregarSegundos));
}

export const getTimerState = () => ({
    isMarathonOver,
    isTimerPaused,
    currentTimer,
    currentTotalTime,
    isMaxTimeReached
});

