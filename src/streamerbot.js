import { StreamerbotAddress, StreamerbotPort } from './constantes.js';
import {
    RewardRedemption, AddTimeWithCheers, AddTimeWithSub, AddTimeWithReSub,
    AddTimeWithGiftSub, AddTimeWithGiftBomb, addTimeKofiDonation,
    // addTimeKofiSubscription, addTimeKofiResubscription, addTimeKofiShopOrder,
    handleCommand
} from './eventsHandler.js';

let ws = null;

let sbDebugMode = true;

export function connectws() {
	if (!("WebSocket" in window)) return;

	ws = new WebSocket(`ws://${StreamerbotAddress}:${StreamerbotPort}/`);

	ws.onclose = () => {
		setConnectionStatus(false);
		setTimeout(connectws, 5000);
	};

	ws.onopen = () => {
		setConnectionStatus(true);
		console.log("✅ WebSocket conectado");

		ws.send(JSON.stringify({
			request: "Subscribe",
			id: "subscribe-all-events",
			events: {
				twitch: [
					// "Sub",
					// "ReSub",
					// "GiftSub",
					// "GiftBomb",
					"Cheer",
					"RewardRedemption"
				],
				kofi: [
					"Donation"
				// 	"Subscription",
				// 	"Resubscription",
				// 	"ShopOrder"
				],
				commands: ["Triggered"]
			}
		}));
	};

	ws.onmessage = (event) => {
		const wsdata = JSON.parse(event.data);
		if (!wsdata?.event?.type) return;

		if (sbDebugMode) {
			console.log("🟡 Evento recibido:", wsdata.event.source, wsdata.event.type, wsdata.data);
		}

		const { source, type } = wsdata.event;
		const data = wsdata.data;

		switch (source) {
			case 'Twitch':
				switch (type) {
					// case 'Sub': AddTimeWithSub(data); break;
					// case 'ReSub': AddTimeWithReSub(data); break;
					// case 'GiftSub': AddTimeWithGiftSub(data); break;
					// case 'GiftBomb': AddTimeWithGiftBomb(data); break;
					case 'Cheer': AddTimeWithCheers(data); break;
					case 'RewardRedemption': RewardRedemption(data); break;
				}
				break;

			// case 'Kofi':
			// 	switch (type) {
			// 		case 'Donation': addTimeKofiDonation(data); break;
			// 		case 'Subscription': addTimeKofiSubscription(data); break;
			// 		case 'Resubscription': addTimeKofiResubscription(data); break;
			// 		case 'ShopOrder': addTimeKofiShopOrder(data); break;
			// 	}
			// 	break;

			case 'Command':
				if (type === 'Triggered') handleCommand(data);
				break;
		}
	};
}


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