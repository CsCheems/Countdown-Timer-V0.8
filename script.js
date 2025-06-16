// FUNCIONES UTILITARIAS

const hexToRgb = (hex) => {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

// PARAMETROS DE STREAMERBOT
const querystring = window.location.search;
const urlParameters = new URLSearchParams(querystring);
const StreamerbotPort = urlParameters.get('port') || '8080';
const StreamerbotAddress = urlParameters.get('address') || '127.0.0.1';

// CONSTANTES
const comboMode = obtenerBooleanos("comboMode", false);
const startingTime = GetIntParam("startingTime", 3600);
const maxTime = GetIntParam("maxTime", 0);
const tier0 = GetIntParam("tier0", 10);
const tier1 = GetIntParam("tier1", 10);
const tier2 = GetIntParam("tier2", 20);
const tier3 = GetIntParam("tier3", 30);
const minBits = GetIntParam("minBits", 100);
const bitsTime = GetIntParam("bitsTime", 100);
const colorFondo = urlParameters.get("fondoColor") || "#000000";
const opacity = urlParameters.get("opacidad") || 0.75;
const colorFuente = urlParameters.get("colorFuente") || "#ffffff";
const fuenteLetra = urlParameters.get("fuenteLetra") || "Arial";
const maxIncrementTime = 5;
const minToActivateComboBits = 3;

let timer = startingTime;

// VARIABLES
let countdownDisplay;
let intervalId = null;
let cuentaRegresivaIntervalo = null;
let comboModeIntervalo = null;
let cooldownIntervalo = null;
let combo = false;
let contadorBits = 0;
let contadorSubs = 0;
let cuentaRegresiva = 0;
let cuentaRegresivaComboMode = 0;
let cooldownComboMode = 0;
let isCombocooldown = false;
let incrementTime = 0;
let marathonOver = false;
let isPaused = true;
let temp = 0;
let maxTimeReached = false;

// APLICAR ESTILOS
const mainContainer = document.getElementById("main-container");
const timerDiv = document.getElementById("timer");

timerDiv.style.fontFamily = fuenteLetra;
mainContainer.style.color = colorFuente;

const { r, g, b } = hexToRgb(colorFondo);
mainContainer.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;

if(opacity > 0){
    mainContainer.style.boxShadow = "4px 4px 4px black";
}else{
    mainContainer.style.boxShadow = "0 0 0 black";
}

// CONEXIÓN A STREAMERBOT
const client = new StreamerbotClient({
  host: StreamerbotAddress,
  port: StreamerbotPort,
  onConnect: (data) => {
    console.log(data);
    setConnectionStatus(true);
  },
  onDisconnect: () => {
    setConnectionStatus(false);
  }
});


//COMMAND EVENTS//
client.on('Command.Triggered', (response) => {
    handleCommand(response.data);
})


client.on('Twitch.RewardRedemption', (response)=> {
    if(!marathonOver)
        RewardRedemption(response.data);
    else
        return;
})

//TWITCH EVENTS//
client.on('Twitch.Cheer', (response) => {
    if(!marathonOver)
        AddTimeWithCheers(response.data);
    else
        return;
})

client.on('Twitch.Sub', (response) => {
    if(!marathonOver)
        AddTimeWithSub(response.data);
    else
        return;
})

client.on('Twitch.ReSub', (response) => {
    if(!marathonOver)
        AddTimeWithReSub(response.data);
    else
        return;
})

client.on('Twitch.GiftSub', (response) => {
    if(!marathonOver)
        AddTimeWithGiftSub(response.data);
    else
        return;
})

client.on('Twitch.GiftBomb', (response) => {
    if(!marathonOver)
        AddTimeWithGiftBomb(response.data);
    else
        return;
})

//ADD TIME WITH CHEERS//
function AddTimeWithCheers(data) {
    const bits = data.message.bits;
    let valorCalculado = bits / minBits;
    valorCalculado = valorCalculado * bitsTime;

    valorCalculado = valorCalculado * 60;

    // if(comboMode && combo){
    //     let aumento60Segundos = 60;
    //     if(incrementTime <= maxIncrementTime){
    //         incrementTime++;  
    //     }
    //     aumento60Segundos *= incrementTime; 
    //     valorCalculado += aumento60Segundos; 
    // }
    // if(bits >= minBits && comboMode && !combo){
    //     iniciarContadorCheers();
    // }
    AddTime(valorCalculado);
}

//AGREGAR TIEMPO CON GIFBOMB
function AddTimeWithGiftSub(data){
    console.log(data);
    const tierSub = data.subTier;
    const tiempo =  obtenerTiers(tierSub);
    let valorCalculado = tiempo * 60;
    
    // if(comboMode && combo){
    //     let aumento60Segundos = 60;
    //     if(incrementTime <= maxIncrementTime){
    //         incrementTime++;  
    //     }
    //     aumento60Segundos *= incrementTime; 
    //     valorCalculado += aumento60Segundos; 
    // }
    // if(bits >= minBits && comboMode && !combo){
    //     iniciarContadorSubs();
    // }
    AddTime(valorCalculado);
}

function AddTimeWithSub(data){
    console.log(data);
    const tierSub = data.sub_tier;
    const tiempo =  obtenerTiers(tierSub);
    let valorCalculado = tiempo * 60;
    
    // if(comboMode && combo){
    //     let aumento60Segundos = 60;
    //     if(incrementTime <= maxIncrementTime){
    //         incrementTime++;  
    //     }
    //     aumento60Segundos *= incrementTime; 
    //     valorCalculado += aumento60Segundos; 
    // }
    // if(bits >= minBits && comboMode && !combo){
    //     iniciarContadorSubs();
    // }
    AddTime(valorCalculado);
}

function AddTimeWithReSub(data){
    console.log(data);
    const tierSub = data.subTier;
    const tiempo =  obtenerTiers(tierSub);
    let valorCalculado = tiempo * 60;
    
    // if(comboMode && combo){
    //     let aumento60Segundos = 60;
    //     if(incrementTime <= maxIncrementTime){
    //         incrementTime++;  
    //     }
    //     aumento60Segundos *= incrementTime; 
    //     valorCalculado += aumento60Segundos; 
    // }
    // if(bits >= minBits && comboMode && !combo){
    //     iniciarContadorSubs();
    // }
    AddTime(valorCalculado);
}

function AddTimeWithGiftBomb(data){
    console.log(data);
    const totalGiftedSubs = data.recipients.length;
    const tiempo = tier1;
    let valorCalculado = totalGiftedSubs * tiempo;

    valorCalculado = valorCalculado * 60;
    
    // if(comboMode && combo){
    //     let aumento60Segundos = 60;
    //     if(incrementTime <= maxIncrementTime){
    //         incrementTime++;  
    //     }
    //     aumento60Segundos *= incrementTime; 
    //     valorCalculado += aumento60Segundos; 
    // }
    // if(bits >= minBits && comboMode && !combo){
    //     iniciarContadorSubs();
    // }
    AddTime(valorCalculado);
}



//AGREGAR TIEMPO//
function AddTime(secondsToAdd) {
    if (maxTimeReached) return;

    // Calculate potential new timer value
    let potentialTimer = timer + secondsToAdd;

    // Check if maxTime is set and if potentialTimer exceeds maxTime
    if (maxTime > 0 && potentialTimer > maxTime) {
        secondsToAdd = maxTime - timer; // Adjust secondsToAdd to reach maxTime exactly
        maxTimeReached = true;
    }

    if (secondsToAdd <= 0 && maxTimeReached) {
        return; // No time to add or already at maxTime
    }
    //AQUI SE CREA EL PINCHE SPAN DE FORMA DINAMICA
    const tiempoAgregado = document.createElement('span');
    tiempoAgregado.className = "tiempoAgregado";
    tiempoAgregado.style.color = "#00F700";
    tiempoAgregado.style.fontSize = "18px";
    tiempoAgregado.style.fontFamily = "Cal Sans";
    tiempoAgregado.opacity = "0";
    tiempoAgregado.innerHTML = `+${secondsToAdd}`;
    tiempoAgregado.style.position = "absolute";
    tiempoAgregado.style.transform = "translate(-40%, -140%)";
    tiempoAgregado.style.transition = "opacity 1s ease-in";
    tiempoAgregado.style.right = "10px";

    //AL TIME WRAPPER LE METEMOS DE HIJO EL SPAN ALV
    const timeWrapper = document.getElementById('time-wrapper');
    timeWrapper.appendChild(tiempoAgregado);

    //ANIMAMOS EL SPAN PARA QUE SE VEA AESTHETIC COMO DICEN LOS INDIGENAS
    gsap.to(tiempoAgregado, {
        opacity: 1,
        duration:0.6,
        ease: "power2.out",  
        y: -55 
    });
    
    //Y UNA MAS PARA EL DESVANECIMIENTO CSM
    gsap.to(tiempoAgregado, {
        opacity: 0,
        duration:0.6,
        ease: "power2.in",  
    });

    //MANDAMOS ALV EL SPAN
    setTimeout(() => {
        timeWrapper.removeChild(tiempoAgregado);
    }, 2000);

    timer += secondsToAdd;
    console.log(`Tiempo añadido: ${secondsToAdd} segundos. Total: ${timer}`);
}

//COUNTDOWN TIMER//
function startCountdown() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(function () {
        let horas = Math.floor(timer / 3600);
        let minutos = Math.floor((timer % 3600) / 60);
        let segundos = timer % 60;

        horas = horas < 10 ? "0" + horas : horas;
        minutos = minutos < 10 ? "0" + minutos : minutos;
        segundos = segundos < 10 ? "0" + segundos : segundos;

        countdownDisplay.textContent = `${horas}:${minutos}:${segundos}`;
        temp = countdownDisplay.textContent;
        console.log(temp);
        if (--timer < 0 || (maxTime > 0 && timer <= maxTime && maxTimeReached)) {
            marathonOver = true;
            clearInterval(intervalId);
            countdownDisplay.textContent = "¡Se acabó!";
        }
        if (maxTime > 0 && timer >= maxTime) {
            maxTimeReached = true;
            clearInterval(intervalId);
            countdownDisplay.textContent = `${horas}:${minutos}:${segundos}`;
            return;
        }
    }, 1000);
}

window.addEventListener('load', function () {
    countdownDisplay = document.getElementById('timer');
});
  
//STREAMERBOT STATUS FUNCTION//
function setConnectionStatus(connected){
    let statusContainer = document.getElementById('status-container');
    if(connected){
        statusContainer.style.background = "#2FB774";
        statusContainer.innerText = "CONECTADO!";
        statusContainer.style.opacity = 0;
        setTimeout(() => {
            statusContainer.style.transition = "all 2s ease";
            statusContainer.style.opacity = 0;
        }, 10);
    }else{
        statusContainer.style.background = "FF0000";
        statusContainer.innerText = "CONECTANDO...";
        statusContainer.style.transition = "";
        statusContainer.style.opacity = 0;
    }
}

//HANDLE SUBS COUNTDOWN
function iniciarContadorSubs(){
    contadorSubs
}

//HANDLE CHEER COUNTDOWN
function iniciarContadorCheers(){
    contadorBits++;
    console.log("Contador: ",contadorBits);

    if(cuentaRegresivaIntervalo){
        clearInterval(cuentaRegresivaIntervalo);
    }

    cuentaRegresiva = 60;

    if(contadorBits >= minToActivateComboBits){
        clearInterval(cuentaRegresivaIntervalo);
        combo = true;
        contadorBits = 0;
        cuentaRegresivaIntervalo = null;
        iniciarComboMode();
        comboTimeAnimation();
        return;
    }

    cuentaRegresivaIntervalo = setInterval(() => {
        cuentaRegresiva--;
        if(cuentaRegresiva <= 0){
            clearInterval(cuentaRegresivaIntervalo);
            cuentaRegresivaIntervalo = null;
            contadorBits = 0;
            console.log(contadorBits);
            return;
        }
    }, 1000);
}

function iniciarComboMode(){
    cuentaRegresivaComboMode = 60;
    comboAnimation();

    if(comboModeIntervalo){
        clearInterval(comboModeIntervalo);
    }

    comboModeIntervalo = setInterval(() => {
        cuentaRegresivaComboMode--;
        if(cuentaRegresivaComboMode <= 0){
            clearInterval(comboModeIntervalo);
            comboModeIntervalo = null;
            comboModeCooldown();
        }
    }, 1000)
}

function comboModeCooldown(){
    cooldownComboMode = 600;
    const comboAlgo = document.getElementsByClassName('comboAlgo')[0];
    const comboWrapper = document.getElementById('combo-wrapper');
    gsap.to(comboAlgo, {
        opacity: 0,
        duration:0.6,
        ease: "power2.in",  
    });

    setTimeout(() => {
        comboWrapper.removeChild(comboAlgo);
    }, 2000);

    isCombocooldown = true;
    combo = false;
    console.log(combo);

    if(cooldownIntervalo){
        clearInterval(cooldownIntervalo);
    }

    cooldownIntervalo = setInterval(() =>{
        cooldownComboMode--;
        console.log(cooldownComboMode);
        if(cooldownComboMode <= 0){
            clearInterval(cooldownIntervalo);
            cooldownIntervalo = null;
            isCombocooldown = false;
        } 
    }, 1000)
}

function comboAnimation(){
    const comboAlgo = document.createElement('span');
    comboAlgo.className = "comboAlgo";
    comboAlgo.style.color = "#FFFFFF";
    comboAlgo.style.fontSize = "28px";
    comboAlgo.style.fontFamily = "'Press Start 2P', monospace";
    comboAlgo.style.fontWeight = "bold";
    comboAlgo.style.textShadow = "2px 2px 2px #000"
    comboAlgo.opacity = "0";
    comboAlgo.innerHTML = 'Combo';
    comboAlgo.style.position = "absolute";
    comboAlgo.style.transform = 'translate(-140px,-70px) rotate(-45deg)';
    comboAlgo.style.padding = '10px';

    const comboWrapper = document.getElementById('combo-wrapper');
    comboWrapper.appendChild(comboAlgo);

    gsap.to(comboAlgo, {
        rotation: -20,
        scale: 1.3,
        duration: 0.5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
    });    
}

function comboTimeAnimation() {
    const comboTimer = document.getElementById('combo-timer-square');

    //CON ESTA WEA ELIMINAMOS CUALQUIER ANIMACION PREVIA ACTIVA
    gsap.killTweensOf(comboTimer);

    //MOSTRAMOS LOS ELEMENTOS CON ESTOS VALORES
    comboTimer.style.opacity = '1';
    comboTimer.style.transformOrigin = 'left center';
    
    //REINICIAMOS LA PINCHE ESCALA DEL DIV PORQUE SI NO, NO SE VERA LA MADRE
    gsap.set(comboTimer, { scaleX: 1 });

    //AL CHILE ESTA PARTE SE LA PREGUNTE A GEMINI XD
    requestAnimationFrame(() => {
        gsap.to(comboTimer, {
            duration: 60, //ESTE VALOR SE OBTIENE DEL URI
            scaleX: 0,
            ease: 'linear'
        });
    });
}


//MANIPULACION DE TIMER//
function PauseTimer(){
    if(isPaused)
        return;
    localStorage.setItem('pause', timer);
    clearInterval(intervalId)
    isPaused = true;
}

function ResumeTimer(){
    if(!isPaused)
        return;
    isPaused = false;
    timer = localStorage.getItem('pause');
    startCountdown();
}

function StartTimer(){
    if(!isPaused)
        return;
    isPaused = false;
    startCountdown();
    setTimeout(() => {
        AddTimeWithGiftBomb(data);
    }, 5000);
}

function ResetTimer(){
    isPaused = false;
    timer = startingTime;
    startCountdown();
}



//HELPERS//
function handleCommand(data){
    const comando = data.name;
    switch(comando){
        case 'pause':
            PauseTimer();
            break;
        case 'start':
            StartTimer();
            break;
        case 'reset':
            ResetTimer();
            break;
        case 'resume':
            ResumeTimer();
            break;
    }
}

function obtenerTiers(subTier){
    let time = 0;
    switch(subTier){
        case 0:
            time = tier0;
            break;
        case 1:
            time = tier1;
            break;
        case 2:
            time = tier2;
            break;
        case 3:
            time = tier3;
            break;
    }
    return time;
}

function obtenerBooleanos(paramName, defaultValue) {
	const urlParams = new URLSearchParams(window.location.search);
	const paramValue = urlParams.get(paramName);

	if (paramValue === null) {
		return defaultValue;
	}

	const lowercaseValue = paramValue.toLowerCase();

	if (lowercaseValue === 'true') {
		return true;
	} else if (lowercaseValue === 'false') {
		return false;
	} else {
		return paramValue;
	}
}

function GetIntParam(paramName, defaultValue) {
	const urlParams = new URLSearchParams(window.location.search);
	const paramValue = urlParams.get(paramName);

	if (paramValue === null) {
		return defaultValue; 
	}

	console.log(paramValue);

	const intValue = parseInt(paramValue, 10); 

	if (isNaN(intValue)) {
		return null;
	}

	return intValue;
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
////////NI DE PEDO ME PONDRE A COMENTAR TODO,////////
////////AHI ENTIENDELE COMO PUEDAS A LO DEMAS////////
/////////////////////////////////////////////////////
/////////////////////////////////ATTE - CHEMA////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

// const data = {
//   "gifts": 6, /* 0 - Prime, 1 - Tier 1, 2 - Tier 2, 3 - Tier 3 */
//   "color": "#008D99",
//   "emotes": [],
//   "message": "",
//   "userId": 123456,
//   "userName": "<username>",
//   "displayName": "<display name>",
//   "role": 1 /* 1 - Viewer, 2 - VIP, 3 - Moderator, 4 - Broadcaster  */
// }