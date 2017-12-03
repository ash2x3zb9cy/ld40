class PotOfGreed extends Card {
	effect() {
		if(game.deck.length + game.discard.length < 1) {
			game.log(game.deck.length, game.discard.length);
			return false;
		}
		drawCard();
		drawCard();

		return true;
	}
	constructor() {
		super(
			"Pot of Greed",
			"Draw two cards."
		);
	}
}

class PyramidScheme extends Card {
	effect() {
		modActions(1);
		drawCard();
		discardCard(new PyramidScheme());

		return true;
	}
	constructor() {
		super(
			"Pyramid Scheme",
			"+1 Action. Draw a card. Add a Pyramid Scheme to your discard pile."
		);
	}
	upgrade() {return new PyramidScheme2();}
}
class PyramidScheme2 extends Card {
	effect() {
		modActions(2);
		drawCard(2)
		discardCard(new PyramidScheme2());
		return true;
	}
	constructor() {
		super(
			"Matrix Scheme",
			"+2 Actions. Draw two cards. Add a Matrix Scheme to your discard pile."
		)
	}
}
class PyramidScheme3 extends Card {
	effect() {
		modActions(2);
		drawCard(2)
		$('.card').off('click');
		$('#hand .card').on('click', PyramidScheme3.clickCard);

		return true;
	}
	constructor() {
		super(
			"Ponzi Scheme",
			"+2 Actions. Draw 2 cards. Upgrade a card."
		)
	}

	static clickCard(e) {
		let card = $(e.currentTarget).data().card;
		let upgr = card.upgrade();
		if (upgr) {
			// reset event listeners
			$('.card').off('click');
			$('.card').on('click', clickCard);

			// put the upgraded card in discard
			discardCard(upgr);
			return true;
		} else {
			game.log("That card has no upgrades");
			return false;
		}
	}
}


class ToxicAsset extends Card {
	effect() {
		modActions(1);
		return true;
	}
	constructor() {
		super("Toxic Asset", "+1 Action.");
	}
}

class DebtCollection extends Card {
	effect() {
		if (game.hand.length == 0) return false;
		modActions(1); modActions(1);

		$('.card').off('click');
		$('#hand .card').on('click', discardClickCard);
		return true;
	}

	constructor() {
		super("Debt Collection", "+2 Actions. The next card you select is discarded.");
	}
}

class LawyerUp extends Card {
	effect() {
		if (game.actions < 2 || game.hand.length === 0) return false;
		modActions(- 1);
		$('.card').off('click');
		$('#hand .card').on('click', trashClickCard);
		return true;
	}
	constructor() {
		super("Lawyer Up", "Additional cost: 1 Action. Trash 1.");
	}
}

class FourOneNine extends Card {
	constructor() {
		super("419", 'Trash 1. Add "Thirty Two Million Pounds Sterling" to your discard pile.');
	}
	effect() {
		$('.card').off('click');
		$('#hand .card').on('click', trashClickCard);

		game.discard.push(new FourOneNine_Token());
		updateDiscard();
		return true;
	}
}
class FourOneNine_Token extends Card {
	constructor() {
		super("Thirty Two Million Pounds Sterling", " ");
	}
	effect() {
		return true;
	}
}

class PowerShutdown extends Card {
	constructor() {
		super("Power Shutdown", "Discard your entire deck.");
	}
	effect() {
		while(game.deck.length > 0) {
			let card = game.deck.pop();
			game.discard.push(card);
			let $card = $makeCard(card);

			$card.addClass("discard");

			$('#discard').append($card);
		}
		updateDeck();
		return true;
	}
}
class PowerShutdown2 extends PowerShutdown {
	constructor() {
		super();
		this.name = "Power Shutdown 2";
		this.cardText = "Discard your entire deck. Shuffle three cards from your discard into your deck.";
	}
	effect(cb) {
		if (!cb) cb = PowerShutdown2.jacksonClickCard;
		// Power Shutdown effect
		super.effect();

		// Jackson Howard effect
		PowerShutdown2.jacksonCount = 3;

		// stop the user from playing cards until it's resolved
		$('.card').off('click');
		$('.discard').on('click', cb);
		return true;
	}

	get source() {
		return Card.SOURCES.token;
	}

	static jacksonClickCard(e) {
		PowerShutdown2.jacksonCount--;
		let card = $(e.currentTarget).data().card;
		let i = game.discard.indexOf(card);
		if (e > -1) {
			game.discard.splice(i, 1);
		}

		$(e.currentTarget).remove();
		game.deck.push(card);

		updateDeck();

		if (PowerShutdown2.jacksonCount === 0) {
			console.log("DONE");
			shuffle(game.deck);
			$('.card').on('click', clickCard);
			$('.discard').off('click');
		}
	}
}
class PowerShutdown3 extends PowerShutdown2 {
	constructor() {
		super();
		this.name = "Power Shutdown 3";
		this.cardText = "Discard your entire deck. Shuffle three cards from your discard into your deck. Resolve the top three cards of your deck.";
	}
	effect() {
		super.effect(PowerShutdown3.jacksonClickCardPlusDiags);
		return true;
	}

	static jacksonClickCardPlusDiags(e) {
		PowerShutdown2.jacksonClickCard(e);
		if (PowerShutdown2.jacksonCount == 0) {
			for (var i = 0; i < 3; i++) {
				let card = game.deck.pop();
				game.log("Playing " + card.name);
				card.effect();
			}
			updateDeck();
		}
	}
}
class PrintDummy extends Card {
	constructor() {super("PrintDummy", 'Logs "PrintDummy" when played.');}
	effect() {
		game.log("PrintDummy");
	}

	get source() {
		return Card.SOURCES.token;
	}
}