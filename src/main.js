import { hexToRgb } from './utils.js';
import { colorFondo, opacity, colorFuente, fuenteLetra } from './constantes.js';
import { initializeTimer, startCountdown } from './timeHandler.js';
import { connectws } from './streamerbot.js';

// APLICAR ESTILOS
const mainContainer = document.getElementById("main-container");
const timerDiv = document.getElementById("timer");

if (timerDiv) {
    timerDiv.style.fontFamily = fuenteLetra;
}

if (mainContainer) {
    mainContainer.style.color = colorFuente;

    const { r, g, b } = hexToRgb(colorFondo);
    mainContainer.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    if (opacity > 0) {
        mainContainer.style.boxShadow = "4px 4px 4px black";
    } else {
        mainContainer.style.boxShadow = "0 0 0 black";
    }
}

window.addEventListener("load", function () {
    const countdownDisplay = document.getElementById("timer");
    if (countdownDisplay) {
        initializeTimer(countdownDisplay);
    } else {
        console.error("Elemento con ID 'timer' no encontrado.");
    }
    connectws();
    //startCountdown();
});
