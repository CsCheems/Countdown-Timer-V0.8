import {
    allowTwitch, allowYoutube, allowKofi, allowStreamElements, allowStreamlabs,
    tier0, tier1, tier2, tier3, minBits, bitsTime,
    donationTiers, processedGiftBombIds, streamlabsDonation, streamlabsTime,
    streamElementsTip, streamElementsTime
} from './constantes.js';
import {
    AddTime, getTimerState, PauseTimer, ResumeTimer, StartTimer, ResetTimer, addToTimer
} from './timeHandler.js';

// HELPER PARA MANEJAR TIEMPO PAUSADO

function obtenerTiers(subTier, isPrime = false) {
    const tier = isPrime ? 0 : parseInt(subTier, 10);
    switch (tier) {
        case 0:
            return tier0;
        case 1000:
            return tier1;
        case 2000:
            return tier2;
        case 3000:
            return tier3;
        default:
            console.warn(`subTier desconocido (${subTier}), se usará tier0 como valor por defecto.`);
            return tier0;
    }
}

function obtenerGiftBombTiers(sub_tier) {
    const tier = parseInt(sub_tier);
    switch (tier) {
        case 1000:
            return tier1;
        case 2000:
            return tier2;
        case 3000:
            return tier3;
        default:
            console.warn(`subTier desconocido (${sub_tier}), se usará tier1 como valor por defecto.`);
            return tier1;
    }
}

export function RewardRedemption(data) {
    console.log(data);
    const { isMarathonOver } = getTimerState();
    if (isMarathonOver) return;

    const title = data.reward.title;
    let valorCalculado = 0;
    if (title === "Add 5 min") {
        valorCalculado = 300;
    }
    AddTime(valorCalculado);
}

export function AddTimeWithCheers(data) {
    console.log("Cheers: ", data);
    const { isMarathonOver } = getTimerState();
    if (isMarathonOver) return;

    const bits = data.message.bits;
    let valorCalculado = (bits / minBits) * bitsTime;
    valorCalculado = Math.round(valorCalculado * 60);
    AddTime(valorCalculado);
    //iniciarContadorCheers();
}

export function AddTimeWithGiftSub(data) {
    console.log("Gift Sub: ", data);
    const { isMarathonOver } = getTimerState();
    if (isMarathonOver) return;

    const giftId = data.communityGiftId;
    if (giftId && processedGiftBombIds.has(giftId)) {
        return;
    }
    const tierSub = data.subTier;
    const tiempo = obtenerTiers(tierSub);
    let valorCalculado = Math.round(tiempo * 60);
    AddTime(valorCalculado);
}

export function AddTimeWithSub(data) {
    console.log("Sub: ", data);
    const { isMarathonOver } = getTimerState();
    if (isMarathonOver) return;

    const tierSub = data.sub_tier;
    const tiempo = obtenerTiers(tierSub, data.isPrime);
    let valorCalculado = Math.round(tiempo * 60);
    AddTime(valorCalculado);
}

export function AddTimeWithReSub(data) {
    console.log("ReSub: ", data);
    const { isMarathonOver } = getTimerState();
    if (isMarathonOver) return;

    const tierSub = data.subTier;
    const tiempo = obtenerTiers(tierSub, data.isPrime);
    let valorCalculado = Math.round(tiempo * 60);
    AddTime(valorCalculado);
}

export function AddTimeWithGiftBomb(data) {
    console.log("GiftBomb: ", data);
    const { isMarathonOver } = getTimerState();
    if (isMarathonOver) return;

    const giftBombId = data.id;
    if (processedGiftBombIds.has(giftBombId)) {
        return;
    }
    processedGiftBombIds.add(giftBombId);
    const totalGiftedSubs = data.recipients.length;
    const tiempo = obtenerGiftBombTiers(data.sub_tier);
    let valorCalculado = totalGiftedSubs * tiempo;
    valorCalculado = Math.round(valorCalculado * 60);
    AddTime(valorCalculado);
}

export function addTimeKofiDonation(data) {
    console.log(data);
    const { isMarathonOver } = getTimerState();
    if (isMarathonOver) return;

    const cantidad = parseFloat(data.amount);
    let valorCalculado = 0;

    const tiersOrdenados = [...donationTiers].sort((a, b) => b.cantidad - a.cantidad);

    for (const tier of tiersOrdenados) {
        if (cantidad >= tier.cantidad) {
            valorCalculado = tier.tiempo;
            break;
        }
    }

    if (valorCalculado > 0) {
        AddTime(valorCalculado);
    } else {
        return;
    }
}

// export function addTimeKofiSubscription(data) {
//     console.log(data);
//     //PENDIENTE
// }

// export function addTimeKofiResubscription(data) {
//     console.log(data);
//     //PENDIENTE
// }

// export function addTimeKofiShopOrder(data) {
//     console.log(data);
//     //PENDIENTE
// }

//STREAMELEMENTS
export function addTimeStreamElementsTip(data){
    console.log(data);
}

//STREAMLABS
export function addTimeStreamlabsDonation(data){
    console.log(data);
    const cantidad = data.amount;

}

//YOUTUBE
export function addTimeMemberMileStone(data){
    console.log(data);
}

export function addTimeGiftMembershipReceived(data){
    console.log(data);
}

export function addTimeMembershipGift(data){
    console.log(data);
}

export function addTimeNewSponsor(data) {
    console.log(data);
}

export function addTimeSuperchat(data) {
    console.log(data);
}

export function addTimeSuperSticker(data) {
    console.log(data);
}

//HELPERS//
export function handleCommand(data) {
    console.log(data);
    const comando = data.name;
    const message = data.message;
    switch (comando) {
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
        case 'addTime':
            addToTimer(message);
            break;
        default:
            console.warn('Comando no reconocido');
            break;
    }
}
