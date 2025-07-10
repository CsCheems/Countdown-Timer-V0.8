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
export const allowTwitch = obtenerBooleanos("allowTwitch", true);
export const tier0 = GetIntParam("tier0", 17);
export const tier1 = GetIntParam("tier1", 15);
export const tier2 = GetIntParam("tier2", 20);
export const tier3 = GetIntParam("tier3", 25);
export const minBits = GetIntParam("minBits", 100);
export const bitsTime = GetIntParam("bitsTime", 13);

//KOFI
export const allowKofi = obtenerBooleanos("allowKofi", false);
export const dono1 = GetIntParam("dono1", 5);
export const dono1Time = GetIntParam("dono1Time", 20);
export const donationTiers = [
    {cantidad: dono1, tiempo: dono1Time * 60},
]

//STREAMLABS
export const allowStreamlabs = obtenerBooleanos("allowStreamlabs", false);
export const streamlabsDonation = GetIntParam("streamlabsDonation", 5);
export const streamlabsTime = GetIntParam("streamlabsTime", 5);


//STREAMELEMENTS
export const allowStreamElements = obtenerBooleanos("allowStreamElements", false);
export const streamElementsTip = GetIntParam("streamElementsTip", 5);
export const streamElementsTime = GetIntParam("streamElementsTime", 20);

//YOUTUBE
export const allowYoutube = obtenerBooleanos("allowYoutube", false);

//VISUAL
export const colorFondo = urlParameters.get("fondoColor") || "#000000";
export const opacity = urlParameters.get("opacidad") || 0.75;
export const colorFuente = urlParameters.get("colorFuente") || "#ffffff";
export const fuenteLetra = urlParameters.get("fuenteLetra") || "Consolas";

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