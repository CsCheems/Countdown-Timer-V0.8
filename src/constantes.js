//IMPORTAR DE UTILS
import { GetIntParam, obtenerBooleanos, urlParameters } from "./utils.js";

//WEBSOCKET
export const StreamerbotPort = urlParameters.get("port") || "8080";
export const StreamerbotAddress = urlParameters.get("address") || "127.0.0.1";

//CONSTANTES
export const comboMode = obtenerBooleanos("comboMode", false);
export const startingTime = GetIntParam("startingTime", 4800);
export const maxTime = GetIntParam("maxTime", 7200);

//TWITCH
export const tier0 = GetIntParam("tier0", 17);
export const tier1 = GetIntParam("tier1", 15);
export const tier2 = GetIntParam("tier2", 20);
export const tier3 = GetIntParam("tier3", 25);
export const minBits = GetIntParam("minBits", 100);
export const bitsTime = GetIntParam("bitsTime", 13);

//KOFI
// export const dono1 = GetIntParam("dono1", 3);
// export const dono2 = GetIntParam("dono2", 6);
// export const dono3 = GetIntParam("dono3", 9);
// export const dono1Time = GetIntParam("dono1Time", 20);
// export const dono2Time = GetIntParam("dono2Time", 30);
// export const dono3Time = GetIntParam("dono3Time", 40);
// export const donationTiers = [
//     {cantidad: dono1, tiempo: dono1Time * 60},
//     {cantidad: dono2, tiempo: dono2Time * 60},
//     {cantidad: dono3, tiempo: dono3Time * 60}
// ]

//VISUAL
export const colorFondo = urlParameters.get("fondoColor") || "#000000";
export const opacity = urlParameters.get("opacidad") || 0.75;
export const colorFuente = urlParameters.get("colorFuente") || "#ffffff";
export const fuenteLetra = urlParameters.get("fuenteLetra") || "Arial";

//MISC
export const maxIncrementTime = 5;
export const minToActivateComboBits = 3;
export const processedGiftBombIds = new Set();

//VARIABLES DE ESTADO
export let timer = startingTime;
export let totalTime = startingTime;
export let intervalId = null;
export let cuentaRegresivaIntervalo = null;
export let comboModeIntervalo = null;
export let cooldownIntervalo = null;
export let combo = false;
export let contadorBits = 0;
export let contadorSubs = 0; // No se usa de momento, lo considerare para el futuro
export let cuentaRegresiva = 0;
export let cuentaRegresivaComboMode = 0;
export let cooldownComboMode = 0;
export let isCombocooldown = false;
export let incrementTime = 0; // No se usa de momento, lo considerare para el futuro
export let marathonOver = false;
export let isPaused = true;
export let temp = 0; // Para el console.log de updateCountdownDisplay
export let maxTimeReached = false;