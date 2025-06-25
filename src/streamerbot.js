import { StreamerbotAddress, StreamerbotPort } from './constantes.js';
import {
    RewardRedemption, AddTimeWithCheers, AddTimeWithSub, AddTimeWithReSub,
    AddTimeWithGiftSub, AddTimeWithGiftBomb, addTimeKofiDonation,
    addTimeKofiSubscription, addTimeKofiResubscription, addTimeKofiShopOrder,
    handleCommand
} from './eventsHandler.js';

export function initializeStreamerbotClient() {

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

    // COMMAND EVENTS
    client.on("Command.Triggered", (response) => {
        handleCommand(response.data);
    });

    client.on("Twitch.RewardRedemption", (response) => {
        RewardRedemption(response.data);
    });

    // TWITCH EVENTS
    client.on("Twitch.Cheer", (response) => {
        AddTimeWithCheers(response.data);
    });

    client.on("Twitch.Sub", (response) => {
        AddTimeWithSub(response.data);
    });

    client.on("Twitch.ReSub", (response) => {
        AddTimeWithReSub(response.data);
    });

    client.on("Twitch.GiftSub", (response) => {
        AddTimeWithGiftSub(response.data);
    });

    client.on("Twitch.GiftBomb", (response) => {
        AddTimeWithGiftBomb(response.data);
    });

    // KOFI EVENTS
    client.on("Kofi.Donation", (response) => {
        addTimeKofiDonation(response.data);
    });

    client.on("Kofi.Subscription", (response) => {
        addTimeKofiSubscription(response.data);
    });

    client.on("Kofi.Resubscription", (response) => {
        addTimeKofiResubscription(response.data);
    });

    client.on("Kofi.ShopOrder", (response) => {
        addTimeKofiShopOrder(response.data);
    });
}

//STREAMERBOT STATUS FUNCTION//
function setConnectionStatus(connected) {
    let statusContainer = document.getElementById("status-container");
    if (statusContainer) {
        if (connected) {
            statusContainer.style.background = "#2FB774";
            statusContainer.innerText = "CONECTADO!";
            statusContainer.style.opacity = "0";
            setTimeout(() => {
                statusContainer.style.transition = "all 2s ease";
                statusContainer.style.opacity = "0";
            }, 10);
        } else {
            statusContainer.style.background = "FF0000";
            statusContainer.innerText = "CONECTANDO...";
            statusContainer.style.transition = "";
            statusContainer.style.opacity = "1";
        }
    }
}
