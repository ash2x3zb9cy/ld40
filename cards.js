class PotOfGreed extends Card {
	effect() {
		if(game.deck.length + game.discard.length < 1) {
			game.log(game.deck.length, game.discard.length);
			return false;
		}
		drawCard(2);
		return true;
	}
	constructor() {
		super(
			"Pot of Greed",
			"Draw 2."
		);
	}
	upgrade() {return new PotOfBenevolence();}
}
class PotOfBenevolence extends Card {
	constructor() {
		super("Pot of Benevolence", "Shuffle two cards from your discard pile into your deck. Draw 2.")
	}

	effect(cb) {
		if (!cb) cb = PotOfBenevolence.jacksonClickCard;
		// Power Shutdown effect
		super.effect();

		// Jackson Howard effect
		PotOfBenevolence.jacksonCount = 2;

		// stop the user from playing cards until it's resolved
		$('.card').off('click');
		$('.discard').on('click', cb);
		return true;
	}

	static jacksonClickCard(e) {
		PotOfBenevolence.jacksonCount--;
		let card = $(e.currentTarget).data().card;
		let i = game.discard.indexOf(card);
		if (e > -1) {
			game.discard.splice(i, 1);
		}

		$(e.currentTarget).remove();
		game.deck.push(card);

		updateDeck();

		if (PotOfBenevolence.jacksonCount === 0) {
			shuffle(game.deck);
			$('.card').on('click', clickCard);
			$('.discard').off('click');
			drawCard(2);
		}
	}
	upgrade() { return new PotOfAvarice(); }
}
class PotOfAvarice extends Card {
	constructor() {
		super("&#9733; Pot of Avarice", "Shuffle five cards from your discard pile into your deck. Draw two cards.")
	}

	effect(cb) {
		if (!cb) cb = PotOfAvarice.jacksonClickCard;
		// Power Shutdown effect
		super.effect();

		// Jackson Howard effect
		PotOfAvarice.jacksonCount = 5;

		// stop the user from playing cards until it's resolved
		$('.card').off('click');
		$('.discard').on('click', cb);
		return true;
	}

	static jacksonClickCard(e) {
		PotOfAvarice.jacksonCount--;
		let card = $(e.currentTarget).data().card;
		let i = game.discard.indexOf(card);
		if (e > -1) {
			game.discard.splice(i, 1);
		}

		$(e.currentTarget).remove();
		game.deck.push(card);

		updateDeck();

		if (PotOfAvarice.jacksonCount === 0) {
			shuffle(game.deck);
			$('.card').on('click', clickCard);
			$('.discard').off('click');
			drawCard(2);
		}
	}
}


class Audacity extends Card {
	constructor() {
		super("Audacity", "Upgrade a card, then discard your hand.");
	}
	effect() {
		$('.card').off('click');
		$('#hand .card').on('click', Audacity.upgradeClickCard);
		return true;
	}

	upgrade() { return new Sacrifice(); }

	static upgradeClickCard(e) {
		let card = $(e.currentTarget).data().card;
		let upgr = card.upgrade();
		if (upgr) {
			// reset event listeners
			$('.card').off('click');
			$('.card').on('click', clickCard);

			// delete the old card without trashing
			let i = game.hand.indexOf(card);
			if (i > -1) {
				game.hand.splice(i, 1);
			}
			$(e.currentTarget).remove();
			card = null;

			// put the upgraded card in discard
			discardCard(upgr);

			// pitch hand
			while (game.hand.length > 0) {
				discardCard(game.hand.pop());
			}
			updateHand();

			return true;
		} else {
			game.log("That card has no upgrades");
			return false;
		}
	}
}
class Sacrifice extends Card {
	constructor() {
		super("Sacrifice", "Upgrade a card, then discard a card.");
	}
	effect() {
		$('.card').off('click');
		$('#hand .card').on('click', Sacrifice.upgradeClickCard);
		return true;
	}
	upgrade() { return new Success(); }

	static upgradeClickCard(e) {
		let card = $(e.currentTarget).data().card;
		let upgr = card.upgrade();
		if (upgr) {
			// reset event listeners
			$('.card').off('click');
			$('.card').on('click', discardClickCard);

			// delete the old card without trashing
			let i = game.hand.indexOf(card);
			if (i > -1) {
				game.hand.splice(i, 1);
			}
			$(e.currentTarget).remove();
			card = null;

			// put the upgraded card in discard
			discardCard(upgr);

			return true;
		} else {
			game.log("That card has no upgrades");
			return false;
		}
	}
}
class Success extends Card {
	constructor() {
		super("&#9733; Success", "Upgrade a card.");
	}
	effect() {
		$('.card').off('click');
		$('#hand .card').on('click', upgradeClickCard);
		return true;
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
			"+1 Action. Draw 1. Add a Pyramid Scheme to your discard pile."
		);
	}
	upgrade() { return new PyramidScheme2(); }
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
			"+2 Actions. Draw 2. Add a Matrix Scheme to your discard pile."
		)
	}

	upgrade() { return new PyramidScheme3(); }
}
class PyramidScheme3 extends Card {
	effect() {
		modActions(2);
		drawCard(2)
		$('.card').off('click');
		$('#hand .card').on('click', upgradeClickCard);

		return true;
	}
	constructor() {
		super(
			"&#9733; Ponzi Scheme",
			"+2 Actions. Draw 2. Upgrade a card."
		)
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
	upgrade() { return new ToxicAsset2(); }
}
class ToxicAsset2 extends Card {
	constructor(){
		super();
		this.name = "Toxic Upgrade"
		this.cardText = "+2 Actions. Draw 1."
	}
	effect() {
		modActions(2);
		drawCard();
		return true;
	}
	upgrade() { return new ToxicAsset3(); }
}
class ToxicAsset3 extends Card {
	constructor(){
		super();
		this.name = "Toxic Operation"
		this.cardText = "+3 Actions. Draw 2."
	}
	effect() {
		modActions(3);
		drawCard(2);
		return true;
	}
}
class ToxicAsset4 extends Card {
	constructor(){
		super();
		this.name = "&#9733; Toxic Agenda"
		this.cardText = "+4 Actions. Draw 4."
	}
	effect() {
		modActions(4);
		drawCard(4);
		return true;
	}
}

/*class DebtCollection extends Card {
	effect() {
		if (game.hand.length == 0) return false;
		modActions(1); modActions(1);

		$('.card').off('click');
		$('#hand .card').on('click', discardClickCard);
		return true;
	}

	constructor() {
		super("&#9733; Debt Collection", "+2 Actions. Discard 1.");
	}
}*/

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

	upgrade() { return new LawyerUp2(); }
}
class LawyerUp2 extends Card {
	constructor() {
		super();
		this.name = "Hit the Gym";
		this.cardText = "Trash 1.";
	}
	effect() {
		$('.card').off('click');
		$('#hand .card').on('click', trashClickCard);
		return true;
	}
	upgrade() { return new LawyerUp3; }
}
class LawyerUp3 extends Card {
	constructor() {
		super();
		this.name = "&#9733; Delete Social Media";
		this.cardText = "+1 Action. Trash 1.";
	}
	effect() {
		$('.card').off('click');
		$('#hand .card').on('click', trashClickCard);
		modActions(1);
		return true;
	}
}

class FourOneNine extends Card {
	constructor() {
		super("419", 'Trash 1. Add "Advance Fee" to your discard pile.');
	}
	effect() {
		$('.card').off('click');
		$('#hand .card').on('click', trashClickCard);

		discardCard(new FourOneNine_Token());
		return true;
	}
}
class FourOneNine_Token extends Card {
	constructor() {
		super("Advance Fee", " ");
	}
	effect() {
		return true;
	}
	get source() {
		return game.SOURCES.token;
	}

	// upgrade() { return new FourOneNine2(); }
}

class FourOneNine2 extends Card {
	constructor() {
		super("Black Money", 'Draw 2. Trash 1. Add "Cleaning Chemicals" to your dicard pile.');
	}
	effect() {
		drawCard(2);
		$('.card').off('click');
		$('#hand .card').on('click', trashClickCard);

		discardCard(new FourOneNine2_Token());
		return true;
	}
	upgrade() { return new FourOneNine3(); }
}
class FourOneNine2_Token extends Card {
	constructor() {
		super("Cleaning Chemicals", "+1 Action.");
	}
	effect() {
		modActions(1);
		return true;
	}
	get source() {return game.SOURCES.token;}
}

class FourOneNine3 extends Card {
	constructor() {
		super("&#9733; Actual Nigerian Prince", 'Draw 3. Trash 1. Add "Thirty-Two Million Pounds Sterling" to your discard pile.');
	}
}
class FourOneNine3_Token extends Card {
	constructor() {
		super("Thirty-Two Million Pounds Sterling", "+2 Actions.");
	}
	effect() {
		modActions(2);
		return true;
	}
}

class PowerShutdown extends Card {
	constructor() {
		super("Market Shutdown", "Discard your entire deck.");
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
	upgrade() { return new PowerShutdown2(); }
}
class PowerShutdown2 extends PowerShutdown {
	constructor() {
		super();
		this.name = "Market Reset";
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
			shuffle(game.deck);
			$('.card').on('click', clickCard);
			$('.discard').off('click');
		}
	}

	upgrade() { return new PowerShutdown3(); }
}
class PowerShutdown3 extends PowerShutdown {
	constructor() {
		super();
		this.name = "&#9733; Market Control";
		this.cardText = "Discard your entire deck. Shuffle three cards from your discard into your deck. Resolve the top three cards of your deck.";
	}
	effect(cb) {
		if (!cb) cb = PowerShutdown3.jacksonClickCard;
		// Power Shutdown effect
		super.effect();

		// Jackson Howard effect
		PowerShutdown3.jacksonCount = 3;

		// stop the user from playing cards until it's resolved
		$('.card').off('click');
		$('.discard').on('click', cb);
		return true;
	}

	static jacksonClickCard(e) {
		PowerShutdown3.jacksonCount--;
		let card = $(e.currentTarget).data().card;
		let i = game.discard.indexOf(card);
		if (e > -1) {
			game.discard.splice(i, 1);
		}

		$(e.currentTarget).remove();
		game.deck.push(card);
		updateDeck();

		if (PowerShutdown3.jacksonCount === 0) {

			console.log("Game.deck:");
			console.log(game.deck);
			console.log("Game.deck.length: " + game.deck.length);

			shuffle(game.deck);
			for (var x = 0; x < 3; x++) {
				if (game.deck.length === 0) {
					game.log("No cards in deck");
					if (game.discard.length === 0) {
						game.log("No cards in discard. Can't draw");
						return false;
					}
					// moves contents of discard into deck
					game.log("Reshuffling discard into deck");
					while (game.discard.length > 0) {
						let c = game.discard.pop();
						game.deck.push(c);
					}
					updateDiscard();

					shuffle(game.deck);
				}
				let c = game.deck.pop();
				console.log(c);
				c.effect();
				discardCard(c);
			}
			$('.card').on('click', clickCard);
			$('.discard').off('click');
		}
	}
}

