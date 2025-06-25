import { minToActivateComboBits } from './constantes.js';

// Variables de estado internas para este módulo
let contadorBits = 0;
let cuentaRegresivaIntervalo = null;
let cuentaRegresiva = 0;
let comboModeIntervalo = null;
let cuentaRegresivaComboMode = 0;
let cooldownIntervalo = null;
let cooldownComboMode = 0;
let isCombocooldown = false;
let combo = false;

// Lógica de contador de bits y modo combo
export function handleBitCounting() {
    contadorBits++;
    console.log("Contador: ", contadorBits);

    if (cuentaRegresivaIntervalo) {
        clearInterval(cuentaRegresivaIntervalo);
    }

    cuentaRegresiva = 60;

    if (contadorBits >= minToActivateComboBits) {
        activateComboMode();
        return;
    }

    startCountdownInterval();
}

function activateComboMode() {
    clearInterval(cuentaRegresivaIntervalo);
    combo = true;
    contadorBits = 0;
    cuentaRegresivaIntervalo = null;
    iniciarComboMode();
    comboTimeAnimation();
}

function startCountdownInterval() {
    cuentaRegresivaIntervalo = setInterval(() => {
        cuentaRegresiva--;
        if (cuentaRegresiva <= 0) {
            resetBitCounter();
        }
    }, 1000);
}

function resetBitCounter() {
    clearInterval(cuentaRegresivaIntervalo);
    cuentaRegresivaIntervalo = null;
    contadorBits = 0;
    console.log(contadorBits);
}

export function iniciarContadorCheers() {
    handleBitCounting();
}

function iniciarComboMode() {
    cuentaRegresivaComboMode = 60;
    comboAnimation();

    if (comboModeIntervalo) {
        clearInterval(comboModeIntervalo);
    }

    comboModeIntervalo = setInterval(() => {
        cuentaRegresivaComboMode--;
        if (cuentaRegresivaComboMode <= 0) {
            clearInterval(comboModeIntervalo);
            comboModeIntervalo = null;
            comboModeCooldown();
        }
    }, 1000);
}

function comboModeCooldown() {
    cooldownComboMode = 600;
    const comboAlgo = document.getElementsByClassName("comboAlgo")[0];
    const comboWrapper = document.getElementById("combo-wrapper");
    if (comboAlgo && comboWrapper) {
        if (typeof gsap !== 'undefined') {
            gsap.to(comboAlgo, {
                opacity: 0,
                duration: 0.6,
                ease: "power2.in",
            });
        }

        setTimeout(() => {
            if (comboWrapper.contains(comboAlgo)) {
                comboWrapper.removeChild(comboAlgo);
            }
        }, 2000);
    }

    isCombocooldown = true;
    combo = false;
    console.log(combo);

    if (cooldownIntervalo) {
        clearInterval(cooldownIntervalo);
    }

    cooldownIntervalo = setInterval(() => {
        cooldownComboMode--;
        console.log(cooldownComboMode);
        if (cooldownComboMode <= 0) {
            clearInterval(cooldownIntervalo);
            cooldownIntervalo = null;
            isCombocooldown = false;
        }
    }, 1000);
}

function comboAnimation() {
    const comboAlgo = document.createElement("span");
    comboAlgo.className = "comboAlgo";
    comboAlgo.style.color = "#FFFFFF";
    comboAlgo.style.fontSize = "28px";
    comboAlgo.style.fontFamily = "'Press Start 2P', monospace";
    comboAlgo.style.fontWeight = "bold";
    comboAlgo.style.textShadow = "2px 2px 2px #000";
    comboAlgo.style.opacity = "0"; // Corregido: opacity debe ser string
    comboAlgo.innerHTML = 'Combo';
    comboAlgo.style.position = "absolute";
    comboAlgo.style.transform = 'translate(-140px,-70px) rotate(-45deg)';
    comboAlgo.style.padding = '10px';

    const comboWrapper = document.getElementById("combo-wrapper");
    if (comboWrapper) {
        comboWrapper.appendChild(comboAlgo);

        if (typeof gsap !== 'undefined') {
            gsap.to(comboAlgo, {
                rotation: -20,
                scale: 1.3,
                duration: 0.5,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }
}

function comboTimeAnimation() {
    const comboTimer = document.getElementById("combo-timer-square");

    if (comboTimer) {
        if (typeof gsap !== 'undefined') {
            //CON ESTA WEA ELIMINAMOS CUALQUIER ANIMACION PREVIA ACTIVA
            gsap.killTweensOf(comboTimer);

            //MOSTRAMOS LOS ELEMENTOS CON ESTOS VALORES
            comboTimer.style.opacity = '1';
            comboTimer.style.transformOrigin = 'left center';

            //REINICIAMOS LA PINCHE ESCALA DEL DIV PORQUE SI NO, NO SE VERA LA MADRE
            gsap.set(comboTimer, { scaleX: 1 });

            requestAnimationFrame(() => {
                gsap.to(comboTimer, {
                    duration: 60, //ESTE VALOR SE OBTIENE DEL URI (no lo integre lol)
                    scaleX: 0,
                    ease: 'linear'
                });
            });
        }
    }
}

// Exportar el estado del combo si es necesario (solo lectura)
export const getComboState = () => ({
    combo,
    contadorBits,
    isCombocooldown
});
